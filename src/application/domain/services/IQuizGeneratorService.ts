import { QuizQuestion } from "../entities/Quiz";

export interface IQuizGeneratorService {
  generateQuiz(transcriptText: string): Promise<QuizQuestion[]>;
}
