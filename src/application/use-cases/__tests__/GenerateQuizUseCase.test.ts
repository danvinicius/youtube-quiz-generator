import { GenerateQuizUseCase } from "../GenerateQuizUseCase";
import { IQuizGeneratorService } from "../../domain/services/IQuizGeneratorService";
import { QuizQuestion } from "../../domain/entities/Quiz";

const mockQuizService: jest.Mocked<IQuizGeneratorService> = {
  generateQuiz: jest.fn(),
};

describe("GenerateQuizUseCase", () => {
  let useCase: GenerateQuizUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GenerateQuizUseCase(mockQuizService);
  });

  describe("execute", () => {
    const mockTranscriptText =
      "Este é um texto de transcrição sobre JavaScript e suas funcionalidades.";

    const mockQuizResponse: QuizQuestion[] = [
      {
        question: "O que é JavaScript?",
        options: [
          {
            option: "a",
            text: "Uma linguagem de programação",
            correct: true,
          },
          { option: "b", text: "Um banco de dados", correct: false },
          { option: "c", text: "Um sistema operacional", correct: false },
          { option: "d", text: "Uma inteligência artificial", correct: false },
          {
            option: "e",
            text: "Nenhuma das alternativas anteriores",
            correct: false,
          },
        ],
        explanation:
          "JavaScript é uma linguagem de programação interpretada estruturada.",
      },
      {
        question: "Qual é a principal característica do JavaScript?",
        options: [
          { option: "a", text: "Compilação estática", correct: false },
          { option: "b", text: "Execução no navegador", correct: true },
          { option: "c", text: "Tipagem forte", correct: false },
          {
            option: "d",
            text: "Todas as alternativas anteriores",
            correct: false,
          },
          {
            option: "e",
            text: "Nenhuma das alternativas anteriores",
            correct: false,
          },
        ],
        explanation:
          "JavaScript é principalmente executado em navegadores web.",
      },
    ];

    it("deve gerar quiz com sucesso quando o serviço retorna dados válidos", async () => {
      mockQuizService.generateQuiz.mockResolvedValue(mockQuizResponse);

      const result = await useCase.execute(mockTranscriptText);

      expect(result).toEqual(mockQuizResponse);
      expect(mockQuizService.generateQuiz).toHaveBeenCalledWith(
        mockTranscriptText
      );
      expect(mockQuizService.generateQuiz).toHaveBeenCalledTimes(1);
    });

    it("deve retornar array vazio quando o serviço retorna array vazio", async () => {
      mockQuizService.generateQuiz.mockResolvedValue([]);

      const result = await useCase.execute(mockTranscriptText);

      expect(result).toEqual([]);
      expect(mockQuizService.generateQuiz).toHaveBeenCalledWith(
        mockTranscriptText
      );
    });

    it("deve passar o texto da transcrição exatamente como recebido", async () => {
      const complexTranscriptText = `
        Esta é uma transcrição mais complexa com:
        - Quebras de linha
        - Caracteres especiais: áéíóú, ñ, ç
        - Números: 123, 456.78
        - Símbolos: @#$%&*()
        E muito mais conteúdo educacional sobre programação.
      `;

      mockQuizService.generateQuiz.mockResolvedValue(mockQuizResponse);

      await useCase.execute(complexTranscriptText);

      expect(mockQuizService.generateQuiz).toHaveBeenCalledWith(
        complexTranscriptText
      );
    });

    it("deve propagar erro quando o serviço falha", async () => {
      const serviceError = new Error("Erro ao gerar quiz");
      mockQuizService.generateQuiz.mockRejectedValue(serviceError);

      await expect(useCase.execute(mockTranscriptText)).rejects.toThrow(
        "Erro ao gerar quiz"
      );
      expect(mockQuizService.generateQuiz).toHaveBeenCalledWith(
        mockTranscriptText
      );
    });

    it("deve propagar erro de API quando o serviço falha com erro específico", async () => {
      const apiError = new Error("API rate limit exceeded");
      mockQuizService.generateQuiz.mockRejectedValue(apiError);

      await expect(useCase.execute(mockTranscriptText)).rejects.toThrow(
        "API rate limit exceeded"
      );
    });

    it("deve lidar com string vazia como entrada", async () => {
      const emptyText = "";
      mockQuizService.generateQuiz.mockResolvedValue([]);

      const result = await useCase.execute(emptyText);

      expect(result).toEqual([]);
      expect(mockQuizService.generateQuiz).toHaveBeenCalledWith(emptyText);
    });

    it("deve lidar com texto muito longo", async () => {
      const longText = "Esta é uma transcrição muito longa. ".repeat(1000);
      mockQuizService.generateQuiz.mockResolvedValue(mockQuizResponse);

      const result = await useCase.execute(longText);

      expect(result).toEqual(mockQuizResponse);
      expect(mockQuizService.generateQuiz).toHaveBeenCalledWith(longText);
    });

    it("deve lidar com resposta null do serviço", async () => {
      mockQuizService.generateQuiz.mockResolvedValue(null as any);

      const result = await useCase.execute(mockTranscriptText);

      expect(result).toBeNull();
      expect(mockQuizService.generateQuiz).toHaveBeenCalledWith(
        mockTranscriptText
      );
    });

    it("deve lidar com resposta undefined do serviço", async () => {
      mockQuizService.generateQuiz.mockResolvedValue(undefined as any);

      const result = await useCase.execute(mockTranscriptText);

      expect(result).toBeUndefined();
      expect(mockQuizService.generateQuiz).toHaveBeenCalledWith(
        mockTranscriptText
      );
    });

    it("deve lidar com quiz contendo apenas uma question", async () => {
      const singleQuestionResponse: QuizQuestion[] = [
        {
          question: "Pergunta única sobre o conteúdo",
          options: [
            { option: "a", text: "Resposta A", correct: false },
            { option: "b", text: "Resposta B", correct: true },
            { option: "c", text: "Resposta C", correct: false },
          ],
          explanation: "Esta é a explicação da resposta correta.",
        },
      ];

      mockQuizService.generateQuiz.mockResolvedValue(singleQuestionResponse);

      const result = await useCase.execute(mockTranscriptText);

      expect(result).toEqual(singleQuestionResponse);
      expect(result).toHaveLength(1);
    });

    it("deve manter a estrutura exata retornada pelo serviço", async () => {
      const complexQuizResponse = [
        {
          question: "Pergunta com estrutura complexa?",
          options: [
            {
              option: "a",
              text: 'Opção com "aspas" e caracteres especiais',
              correct: false,
            },
            {
              option: "b",
              text: "Opção com números: 123 e símbolos @#$",
              correct: true,
            },
            {
              option: "c",
              text: "Opção\ncom\nquebras\nde\nlinha",
              correct: false,
            },
          ],
          explanation:
            "Explicação detalhada com múltiplas linhas.\nSegunda linha da explicação.\nTerceira linha com mais detalhes.",
        },
      ];

      mockQuizService.generateQuiz.mockResolvedValue(complexQuizResponse);

      const result = await useCase.execute(mockTranscriptText);

      expect(result).toEqual(complexQuizResponse);
      expect(result[0].question).toContain("estrutura complexa");
      expect(result[0].options[1].text).toContain("números: 123");
      expect(result[0].explanation).toContain("múltiplas linhas");
    });
  });

  describe("construtor", () => {
    it("deve inicializar corretamente com o serviço fornecido", () => {
      const newUseCase = new GenerateQuizUseCase(mockQuizService);

      expect(newUseCase).toBeInstanceOf(GenerateQuizUseCase);
    });

    it("deve aceitar diferentes implementações do serviço", () => {
      const alternativeService: IQuizGeneratorService = {
        generateQuiz: jest.fn().mockResolvedValue([]),
      };

      const newUseCase = new GenerateQuizUseCase(alternativeService);

      expect(newUseCase).toBeInstanceOf(GenerateQuizUseCase);
    });
  });
});
