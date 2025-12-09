export interface GenerationProgress {
  progress: number;
  message: string;
}

export interface GenerationComplete {
  progress: number;
  course_id: string;
}