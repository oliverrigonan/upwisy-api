export interface GenerationProgress {
  progress: number;
  message: string;
}

export interface GenerationComplete {
  progress: number;
  course_id: string;
}


export interface FullCourseGenerationProgress {
  course: {
    id: string;
    title: string;
    progress: number;
    status: string;
  };
  lessons: {
    id: string;
    title: string;
    progress: number;
    status: string;
    lesson_sections: {
      id: string;
      title: string;
      progress: number;
      status: string;
    }[]
  }[],
  quizzes: {
    id: string;
    progress: number;
    status: string;
    quiz_items: {
      id: string;
      question: string;
      progress: number;
      status: string;
    }[]
  }[]
}