import { Question } from '@/interfaces/question';

export interface Option {
  id: string;
  title: string;
  isCorrect: boolean;
  questionId: string;
  createdAt: Date;
}