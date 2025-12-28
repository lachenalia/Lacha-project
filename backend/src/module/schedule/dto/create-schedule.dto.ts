export class CreateScheduleDto {
  title!: string;
  description?: string;
  categoryId?: number;
  startAt!: Date;
  endAt?: Date;
  isAllDay!: boolean;
  repeatRule?: any;
  location?: string;
}
