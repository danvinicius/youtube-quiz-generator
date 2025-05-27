import { OpenAIProvider } from "../OpenAIProvider";
import { OpenAI } from "openai";

jest.mock("openai");
const MockedOpenAI = OpenAI as jest.MockedClass<typeof OpenAI>;

jest.mock("../../../config/env", () => ({
  env: {
    openAiApiKey: "test-api-key",
  },
}));

describe("OpenAIProvider", () => {
  let provider: OpenAIProvider;
  let mockOpenAI: jest.Mocked<OpenAI>;
  let mockChatCompletions: jest.Mocked<OpenAI.Chat.Completions>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockChatCompletions = {
      create: jest.fn(),
    } as any;

    mockOpenAI = {
      chat: {
        completions: mockChatCompletions,
      },
    } as any;

    MockedOpenAI.mockImplementation(() => mockOpenAI);

    provider = new OpenAIProvider();
  });

  describe("constructor", () => {
    it("deve inicializar o OpenAI com a API key do ambiente", () => {
      expect(MockedOpenAI).toHaveBeenCalledWith({ apiKey: "test-api-key" });
    });
  });

  describe("generateQuiz", () => {
    const mockTranscriptText =
      "Este é um texto de transcrição de uma aula sobre JavaScript.";

    const mockValidResponse = [
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
        explanation: "JavaScript é uma linguagem de programação interpretada.",
      },
    ];

    it("deve gerar um quiz com sucesso quando a resposta da API é válida", async () => {
      const mockAPIResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify(mockValidResponse),
            },
          },
        ],
      };

      mockChatCompletions.create.mockResolvedValue(mockAPIResponse as any);

      const result = await provider.generateQuiz(mockTranscriptText);

      expect(result).toEqual(mockValidResponse);
      expect(mockChatCompletions.create).toHaveBeenCalledWith({
        model: "gpt-4o-mini",
        store: true,
        messages: [
          {
            role: "system",
            content:
              "Você é um gerador de quizzes educacionais em formato JSON.",
          },
          {
            role: "user",
            content: expect.stringContaining(mockTranscriptText),
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });
    });

    it("deve processar resposta com markdown code block", async () => {
      const responseWithMarkdown = `\`\`\`json
${JSON.stringify(mockValidResponse)}
\`\`\``;

      const mockAPIResponse = {
        choices: [
          {
            message: {
              content: responseWithMarkdown,
            },
          },
        ],
      };

      mockChatCompletions.create.mockResolvedValue(mockAPIResponse as any);

      const result = await provider.generateQuiz(mockTranscriptText);

      expect(result).toEqual(mockValidResponse);
    });

    it("deve processar resposta com markdown code block sem especificação de linguagem", async () => {
      const responseWithMarkdown = `\`\`\`
${JSON.stringify(mockValidResponse)}
\`\`\``;

      const mockAPIResponse = {
        choices: [
          {
            message: {
              content: responseWithMarkdown,
            },
          },
        ],
      };

      mockChatCompletions.create.mockResolvedValue(mockAPIResponse as any);

      const result = await provider.generateQuiz(mockTranscriptText);

      expect(result).toEqual(mockValidResponse);
    });

    it("deve lançar erro quando a resposta não é um JSON válido", async () => {
      const mockAPIResponse = {
        choices: [
          {
            message: {
              content: "resposta inválida que não é JSON",
            },
          },
        ],
      };

      mockChatCompletions.create.mockResolvedValue(mockAPIResponse as any);
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await expect(provider.generateQuiz(mockTranscriptText)).rejects.toThrow(
        "A resposta da IA não está no formato JSON esperado."
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erro ao parsear JSON:",
        expect.any(SyntaxError)
      );

      consoleErrorSpy.mockRestore();
    });

    it("deve lançar erro quando a resposta da API não tem conteúdo", async () => {
      const mockAPIResponse = {
        choices: [
          {
            message: {
              content: null,
            },
          },
        ],
      };

      mockChatCompletions.create.mockResolvedValue(mockAPIResponse as any);
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      await expect(provider.generateQuiz(mockTranscriptText)).rejects.toThrow(
        "A resposta da IA não está no formato JSON esperado."
      );

      consoleErrorSpy.mockRestore();
    });

    it("deve lançar erro quando a API falha", async () => {
      const apiError = new Error("API Error");
      mockChatCompletions.create.mockRejectedValue(apiError);

      await expect(provider.generateQuiz(mockTranscriptText)).rejects.toThrow(
        "API Error"
      );
    });

    it("deve incluir o texto da transcrição no prompt", async () => {
      const mockAPIResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify(mockValidResponse),
            },
          },
        ],
      };

      mockChatCompletions.create.mockResolvedValue(mockAPIResponse as any);

      await provider.generateQuiz(mockTranscriptText);

      const callArguments = mockChatCompletions.create.mock.calls[0][0];
      const userMessage = callArguments.messages.find(
        (msg) => msg.role === "user"
      );

      expect(userMessage?.content).toContain(mockTranscriptText);
      expect(userMessage?.content).toContain(
        "O seguinte texto é uma transcrição de uma aula educativa"
      );
    });

    it("deve usar os parâmetros corretos na chamada da API", async () => {
      const mockAPIResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify(mockValidResponse),
            },
          },
        ],
      };

      mockChatCompletions.create.mockResolvedValue(mockAPIResponse as any);

      await provider.generateQuiz(mockTranscriptText);

      expect(mockChatCompletions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "gpt-4o-mini",
          store: true,
          temperature: 0.7,
          max_tokens: 4000,
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: "system",
              content:
                "Você é um gerador de quizzes educacionais em formato JSON.",
            }),
            expect.objectContaining({
              role: "user",
              content: expect.any(String),
            }),
          ]),
        })
      );
    });

    it("deve retornar array vazio quando a API retorna array vazio válido", async () => {
      const mockAPIResponse = {
        choices: [
          {
            message: {
              content: "[]",
            },
          },
        ],
      };

      mockChatCompletions.create.mockResolvedValue(mockAPIResponse as any);

      const result = await provider.generateQuiz(mockTranscriptText);

      expect(result).toEqual([]);
    });
  });
});
