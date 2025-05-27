import { IQuizGeneratorService } from "../domain/services/IQuizGeneratorService";

export class GenerateQuizUseCase {
  constructor(private quizService: IQuizGeneratorService) {}

  async execute(transcriptText: string): Promise<any> {
    return this.quizService.generateQuiz(transcriptText);
  }
}
