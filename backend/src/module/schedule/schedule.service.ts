import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleEntity } from './schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
  ) {}

  async findAll(userId: number) {
    return await this.scheduleRepository.find({
      where: { userId },
      relations: ['category'],
      order: { startAt: 'ASC' },
    });
  }

  async findOne(userId: number, id: number) {
    const schedule = await this.scheduleRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    return schedule;
  }

  async create(userId: number, dto: CreateScheduleDto) {
    const schedule = this.scheduleRepository.create({
      ...dto,
      userId,
    });
    return await this.scheduleRepository.save(schedule);
  }

  async update(userId: number, id: number, dto: UpdateScheduleDto) {
    const schedule = await this.findOne(userId, id);
    Object.assign(schedule, dto);
    return await this.scheduleRepository.save(schedule);
  }

  async remove(userId: number, id: number) {
    const schedule = await this.findOne(userId, id);
    return await this.scheduleRepository.remove(schedule);
  }
}
