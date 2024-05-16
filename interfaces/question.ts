export interface Question {
    id: string;
    title: string;
    description: string | null;
    quizId: string;
    createdAt: Date;
}