import { Controller, Get } from "@overnightjs/core";
import { Request, Response } from "express";
import { GenerateQuizUseCase } from "../../application/use-cases/GenerateQuizUseCase";
import { GetTranscriptUseCase } from "../../application/use-cases/GetTranscriptUseCase";

@Controller("quiz")
export class QuizController {
  constructor(
    private readonly getTranscriptUseCase: GetTranscriptUseCase,
    private readonly generateQuizUseCase: GenerateQuizUseCase
  ) {}

  @Get("")
  async generateQuiz(req: Request, res: Response) {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      return res
        .status(400)
        .json({ error: "URL do vídeo é obrigatória e deve ser uma string." });
    }

    try {
      const transcriptText = await this.getTranscriptUseCase.execute(url);
      const quiz = await this.generateQuizUseCase.execute(transcriptText);
      return res.json(quiz);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
}
