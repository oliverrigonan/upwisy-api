export class UpdateLearningPlanDto {
    date: Date;
    start_time: string;
    end_time: string;
    repetition: string;
    days_of_week: string[];
    ends: string;
    ends_on_date: Date;
    notes: string;
}