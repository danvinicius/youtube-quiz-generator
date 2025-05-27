import express from "express";
import { Server } from "@overnightjs/core";
import { GenerateQuizUseCase } from "./application/use-cases/GenerateQuizUseCase";
import { GetTranscriptUseCase } from "./application/use-cases/GetTranscriptUseCase";
import { OpenAIProvider } from "./infra/providers/OpenAIProvider";
import { YoutubeTranscriptProvider } from "./infra/providers/YoutubeTranscriptProvider";
import { QuizController } from "./presentation/controllers/QuizController";

export class App extends Server {
  constructor() {
    super();
    this.app.use(express.json());
    this.setupControllers();
  }

  private setupControllers(): void {
    const transcriptProvider = new YoutubeTranscriptProvider();
    const openAiProvider = new OpenAIProvider();

    const getTranscriptUseCase = new GetTranscriptUseCase(transcriptProvider);
    const generateQuizUseCase = new GenerateQuizUseCase(openAiProvider);

    const quizController = new QuizController(
      getTranscriptUseCase,
      generateQuizUseCase
    );

    super.addControllers([quizController]);
  }
}
