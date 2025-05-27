import { QuizController } from "../QuizController";
import { GetTranscriptUseCase } from "../../../application/use-cases/GetTranscriptUseCase";
import { GenerateQuizUseCase } from "../../../application/use-cases/GenerateQuizUseCase";
import { Request, Response } from "express";

const mockTranscriptService = {
  getTranscript: jest.fn(),
};

const mockQuizService = {
  generateQuiz: jest.fn(),
};

const mockGetTranscriptUseCase = new GetTranscriptUseCase(
  mockTranscriptService as any
);
const mockGenerateQuizUseCase = new GenerateQuizUseCase(mockQuizService as any);

const getTranscriptSpy = jest.spyOn(mockGetTranscriptUseCase, "execute");
const generateQuizSpy = jest.spyOn(mockGenerateQuizUseCase, "execute");

const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

describe("QuizController", () => {
  let quizController: QuizController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    quizController = new QuizController(
      mockGetTranscriptUseCase,
      mockGenerateQuizUseCase
    );

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  describe("generateQuiz", () => {
    describe("Validação de parâmetros", () => {
      it("deve retornar erro 400 quando URL não é fornecida", async () => {
        mockRequest = {
          query: {},
        };

        await quizController.generateQuiz(
          mockRequest as Request,
          mockResponse as Response
        );

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: "URL do vídeo é obrigatória e deve ser uma string.",
        });
        expect(mockGetTranscriptUseCase.execute).not.toHaveBeenCalled();
        expect(mockGenerateQuizUseCase.execute).not.toHaveBeenCalled();
      });

      it("deve retornar erro 400 quando URL é uma string vazia", async () => {
        mockRequest = {
          query: { url: "" },
        };

        await quizController.generateQuiz(
          mockRequest as Request,
          mockResponse as Response
        );

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: "URL do vídeo é obrigatória e deve ser uma string.",
        });
      });

      it("deve retornar erro 400 quando URL não é uma string", async () => {
        mockRequest = {
          query: { url: 123 as any },
        };

        await quizController.generateQuiz(
          mockRequest as Request,
          mockResponse as Response
        );

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: "URL do vídeo é obrigatória e deve ser uma string.",
        });
      });

      it("deve retornar erro 400 quando URL é um array", async () => {
        mockRequest = {
          query: { url: ["url1", "url2"] },
        };

        await quizController.generateQuiz(
          mockRequest as Request,
          mockResponse as Response
        );

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: "URL do vídeo é obrigatória e deve ser uma string.",
        });
      });
    });

    describe("Fluxo de sucesso", () => {
      it("deve gerar quiz com sucesso quando URL válida é fornecida", async () => {
        const validUrl = "https://youtube.com/watch?v=123";
        const mockTranscript = "Este é um texto de transcrição do vídeo";
        const mockQuiz = {
          questions: [
            {
              id: 1,
              question: "Qual é o tema principal do vídeo?",
              options: ["A", "B", "C", "D"],
              correctAnswer: 0,
            },
          ],
        };

        mockRequest = {
          query: { url: validUrl },
        };

        getTranscriptSpy.mockResolvedValue(mockTranscript);
        generateQuizSpy.mockResolvedValue(mockQuiz);

        await quizController.generateQuiz(
          mockRequest as Request,
          mockResponse as Response
        );

        expect(getTranscriptSpy).toHaveBeenCalledWith(validUrl);
        expect(generateQuizSpy).toHaveBeenCalledWith(mockTranscript);
        expect(mockResponse.json).toHaveBeenCalledWith(mockQuiz);
        expect(mockResponse.status).not.toHaveBeenCalled();
      });

      it("deve processar URL com espaços em branco", async () => {
        const urlWithSpaces = "  https://youtube.com/watch?v=123  ";
        const mockTranscript = "Transcrição do vídeo";
        const mockQuiz = { questions: [] };

        mockRequest = {
          query: { url: urlWithSpaces },
        };

        getTranscriptSpy.mockResolvedValue(mockTranscript);
        generateQuizSpy.mockResolvedValue(mockQuiz);

        await quizController.generateQuiz(
          mockRequest as Request,
          mockResponse as Response
        );

        expect(getTranscriptSpy).toHaveBeenCalledWith(urlWithSpaces);
        expect(generateQuizSpy).toHaveBeenCalledWith(mockTranscript);
        expect(mockResponse.json).toHaveBeenCalledWith(mockQuiz);
      });
    });

    describe("Tratamento de erros", () => {
      it("deve retornar erro 500 quando GetTranscriptUseCase falha", async () => {
        const validUrl = "https://youtube.com/watch?v=123";
        const errorMessage = "Erro ao obter transcrição";

        mockRequest = {
          query: { url: validUrl },
        };

        getTranscriptSpy.mockRejectedValue(new Error(errorMessage));

        await quizController.generateQuiz(
          mockRequest as Request,
          mockResponse as Response
        );

        expect(getTranscriptSpy).toHaveBeenCalledWith(validUrl);
        expect(generateQuizSpy).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: errorMessage,
        });
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      });

      it("deve retornar erro 500 quando GenerateQuizUseCase falha", async () => {
        const validUrl = "https://youtube.com/watch?v=123";
        const mockTranscript = "Transcrição do vídeo";
        const errorMessage = "Erro ao gerar quiz";

        mockRequest = {
          query: { url: validUrl },
        };

        getTranscriptSpy.mockResolvedValue(mockTranscript);
        generateQuizSpy.mockRejectedValue(new Error(errorMessage));

        await quizController.generateQuiz(
          mockRequest as Request,
          mockResponse as Response
        );

        expect(getTranscriptSpy).toHaveBeenCalledWith(validUrl);
        expect(generateQuizSpy).toHaveBeenCalledWith(mockTranscript);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: errorMessage,
        });
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      });

      it("deve tratar erro sem message property", async () => {
        const validUrl = "https://youtube.com/watch?v=123";
        const errorWithoutMessage = { code: "UNKNOWN_ERROR" };

        mockRequest = {
          query: { url: validUrl },
        };

        getTranscriptSpy.mockRejectedValue(errorWithoutMessage);

        await quizController.generateQuiz(
          mockRequest as Request,
          mockResponse as Response
        );

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: undefined,
        });
        expect(consoleSpy).toHaveBeenCalledWith(errorWithoutMessage);
      });

      it("deve tratar string como erro", async () => {
        const validUrl = "https://youtube.com/watch?v=123";
        const stringError = "Erro em formato de string";

        mockRequest = {
          query: { url: validUrl },
        };

        getTranscriptSpy.mockRejectedValue(stringError);

        await quizController.generateQuiz(
          mockRequest as Request,
          mockResponse as Response
        );

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
          error: undefined,
        });
        expect(consoleSpy).toHaveBeenCalledWith(stringError);
      });
    });

    describe("Integração entre use cases", () => {
      it("deve passar o resultado do GetTranscriptUseCase para o GenerateQuizUseCase", async () => {
        const validUrl = "https://youtube.com/watch?v=123";
        const specificTranscript =
          "Esta é uma transcrição específica para teste";
        const mockQuiz = { questions: [] };

        mockRequest = {
          query: { url: validUrl },
        };

        getTranscriptSpy.mockResolvedValue(specificTranscript);
        generateQuizSpy.mockResolvedValue(mockQuiz);

        await quizController.generateQuiz(
          mockRequest as Request,
          mockResponse as Response
        );

        expect(generateQuizSpy).toHaveBeenCalledWith(specificTranscript);
      });
    });
  });
});
