import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HabitEntity } from './habit.entity';
import { HabitLogEntity } from './habit-log.entity';
import { CreateHabitDto, UpdateHabitDto } from './dto/habit.dto';

@Injectable()
export class HabitService {
  constructor(
    @InjectRepository(HabitEntity)
    private readonly habitRepository: Repository<HabitEntity>,
    @InjectRepository(HabitLogEntity)
    private readonly habitLogRepository: Repository<HabitLogEntity>,
  ) {}

  async create(userId: number, dto: CreateHabitDto): Promise<HabitEntity> {
    const { category, ...rest } = dto;
    const habit = this.habitRepository.create({
      ...rest,
      categoryName: category,
      userId,
    });
    return await this.habitRepository.save(habit);
  }

  async findAll(userId: number, date?: string): Promise<any[]> {
    const habits = await this.habitRepository.find({
      where: { userId },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });

    if (date) {
      const logs = await this.habitLogRepository.find({
        where: {
          habit: { userId },
          logDate: date,
        },
      });

      return habits.map((habit) => {
        const log = logs.find((l) => Number(l.habitId) === Number(habit.id));
        return {
          ...habit,
          isCompleted: log ? log.isSuccess : false,
        };
      });
    }

    return habits;
  }

  async toggleCompletion(
    userId: number,
    habitId: number,
    date: string,
    note?: string,
  ): Promise<boolean> {
    const habit = await this.findOne(userId, habitId);
    
    const existingLog = await this.habitLogRepository.findOne({
      where: { habitId: habit.id, logDate: date },
    });

    if (existingLog) {
      await this.habitLogRepository.remove(existingLog);
      return false;
    } else {
      const log = this.habitLogRepository.create({
        habitId: habit.id,
        logDate: date,
        isSuccess: true,
        note,
      });
      await this.habitLogRepository.save(log);
      return true;
    }
  }

  async findOne(userId: number, id: number): Promise<HabitEntity> {
    const habit = await this.habitRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }
    return habit;
  }

  async getHabitDetail(userId: number, id: number): Promise<any> {
    const habit = await this.findOne(userId, id);
    const logs = await this.habitLogRepository.find({
      where: { habitId: habit.id },
      order: { logDate: 'DESC' },
    });

    // Calculate Streaks
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    
    // For current streak, we need to know if it's unbroken from today/yesterday
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    const logDates = logs.filter(l => l.isSuccess).map(l => l.logDate);
    
    // Max Streak calculation
    const sortedDates = [...logDates].sort();
    if (sortedDates.length > 0) {
      tempStreak = 1;
      maxStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prev = new Date(sortedDates[i-1]);
        const curr = new Date(sortedDates[i]);
        const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
        
        if (diff === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
        maxStreak = Math.max(maxStreak, tempStreak);
      }
    }

    // Current Streak calculation
    let checkDate = today;
    const dateSet = new Set(logDates);
    
    if (!dateSet.has(today)) {
      checkDate = yesterday;
    }

    while (dateSet.has(checkDate)) {
      currentStreak++;
      const d = new Date(checkDate);
      d.setDate(d.getDate() - 1);
      checkDate = d.toISOString().split('T')[0];
    }

    return {
      habit,
      logs,
      stats: {
        totalSuccess: logDates.length,
        currentStreak,
        maxStreak,
      }
    };
  }

  async update(
    userId: number,
    id: number,
    dto: UpdateHabitDto,
  ): Promise<HabitEntity> {
    const habit = await this.findOne(userId, id);
    Object.assign(habit, dto);
    return await this.habitRepository.save(habit);
  }

  async remove(userId: number, id: number): Promise<void> {
    const habit = await this.findOne(userId, id);
    await this.habitRepository.remove(habit);
  }
}
