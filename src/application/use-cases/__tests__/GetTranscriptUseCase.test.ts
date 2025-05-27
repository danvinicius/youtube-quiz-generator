import { GetTranscriptUseCase } from "../GetTranscriptUseCase";
import { ITranscriptService } from "../../domain/services/ITranscriptService";

export const mockTranscriptService: jest.Mocked<ITranscriptService> = {
  getTranscript: jest.fn(),
};

describe("GetTranscriptUseCase", () => {
  let useCase: GetTranscriptUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetTranscriptUseCase(mockTranscriptService);
  });

  describe("execute", () => {
    const validVideoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

    it("deve retornar transcrição quando o serviço é bem-sucedido", async () => {
      const expectedTranscript =
        "Esta é uma transcrição de exemplo do vídeo sobre programação JavaScript.";
      mockTranscriptService.getTranscript.mockResolvedValue(expectedTranscript);

      const result = await useCase.execute(validVideoUrl);

      expect(result).toBe(expectedTranscript);
      expect(mockTranscriptService.getTranscript).toHaveBeenCalledWith(
        validVideoUrl
      );
      expect(mockTranscriptService.getTranscript).toHaveBeenCalledTimes(1);
    });

    it("deve retornar string vazia quando o serviço retorna string vazia", async () => {
      mockTranscriptService.getTranscript.mockResolvedValue("");

      const result = await useCase.execute(validVideoUrl);

      expect(result).toBe("");
      expect(mockTranscriptService.getTranscript).toHaveBeenCalledWith(
        validVideoUrl
      );
    });

    it("deve passar a URL do vídeo exatamente como recebida", async () => {
      const youtubeUrl = "https://www.youtube.com/watch?v=abc123XYZ_-";
      const youtubeEmbedUrl = "https://www.youtube.com/embed/abc123XYZ_-";
      const youtubeShortUrl = "https://youtu.be/abc123XYZ_-";
      const urlWithParams =
        "https://www.youtube.com/watch?v=abc123XYZ_-&t=120s&list=PLtest";

      const mockTranscript = "Transcrição do vídeo";
      mockTranscriptService.getTranscript.mockResolvedValue(mockTranscript);

      await useCase.execute(youtubeUrl);
      expect(mockTranscriptService.getTranscript).toHaveBeenCalledWith(
        youtubeUrl
      );

      await useCase.execute(youtubeEmbedUrl);
      expect(mockTranscriptService.getTranscript).toHaveBeenCalledWith(
        youtubeEmbedUrl
      );

      await useCase.execute(youtubeShortUrl);
      expect(mockTranscriptService.getTranscript).toHaveBeenCalledWith(
        youtubeShortUrl
      );

      await useCase.execute(urlWithParams);
      expect(mockTranscriptService.getTranscript).toHaveBeenCalledWith(
        urlWithParams
      );
    });

    it("deve propagar erro quando o serviço falha", async () => {
      const serviceError = new Error("Erro ao obter transcrição");
      mockTranscriptService.getTranscript.mockRejectedValue(serviceError);

      await expect(useCase.execute(validVideoUrl)).rejects.toThrow(
        "Erro ao obter transcrição"
      );
      expect(mockTranscriptService.getTranscript).toHaveBeenCalledWith(
        validVideoUrl
      );
    });

    it("deve propagar erro de URL inválida", async () => {
      const invalidUrlError = new Error("ID de vídeo inválido!");
      const invalidUrl = "https://www.example.com/invalid-video";
      mockTranscriptService.getTranscript.mockRejectedValue(invalidUrlError);

      await expect(useCase.execute(invalidUrl)).rejects.toThrow(
        "ID de vídeo inválido!"
      );
      expect(mockTranscriptService.getTranscript).toHaveBeenCalledWith(
        invalidUrl
      );
    });

    it("deve propagar erro de vídeo não encontrado", async () => {
      const notFoundError = new Error("Video not found");
      mockTranscriptService.getTranscript.mockRejectedValue(notFoundError);

      await expect(useCase.execute(validVideoUrl)).rejects.toThrow(
        "Video not found"
      );
    });

    it("deve propagar erro de transcrição não disponível", async () => {
      const transcriptUnavailableError = new Error("Transcript not available");
      mockTranscriptService.getTranscript.mockRejectedValue(
        transcriptUnavailableError
      );

      await expect(useCase.execute(validVideoUrl)).rejects.toThrow(
        "Transcript not available"
      );
    });

    it("deve lidar com transcrição muito longa", async () => {
      const longTranscript =
        "Esta é uma transcrição muito longa de um vídeo educacional. ".repeat(
          1000
        );
      mockTranscriptService.getTranscript.mockResolvedValue(longTranscript);

      const result = await useCase.execute(validVideoUrl);

      expect(result).toBe(longTranscript);
      expect(result.length).toBeGreaterThan(50000);
    });

    it("deve lidar com transcrição contendo caracteres especiais", async () => {
      const specialCharTranscript = `
        Olá! Este é um vídeo sobre programação em JavaScript.
        Vamos aprender sobre variáveis, funções e objetos.
        ¿Hablas español? Oui, nous parlons français aussi!
        Símbolos: @#$%&*()[]{}|\\:;"'<>,.?/~\`
        Números: 123.456.789,00 R$ 1.000,50
        Emojis podem aparecer: 🚀 💻 📚
      `;
      mockTranscriptService.getTranscript.mockResolvedValue(
        specialCharTranscript
      );

      const result = await useCase.execute(validVideoUrl);

      expect(result).toBe(specialCharTranscript);
      expect(result).toContain("JavaScript");
      expect(result).toContain("¿Hablas español?");
      expect(result).toContain("🚀");
    });

    it("deve lidar com transcrição contendo quebras de linha", async () => {
      const multilineTranscript = `Primeira linha da transcrição.
Segunda linha com mais conteúdo.
Terceira linha com informações adicionais.

Linha após quebra dupla.
      `;
      mockTranscriptService.getTranscript.mockResolvedValue(
        multilineTranscript
      );

      const result = await useCase.execute(validVideoUrl);

      expect(result).toBe(multilineTranscript);
      expect(result.split("\n")).toHaveLength(6);
    });

    it("deve lidar com URL contendo caracteres especiais", async () => {
      const urlWithSpecialChars =
        "https://www.youtube.com/watch?v=abc-123_XYZ&feature=youtu.be";
      const transcript = "Transcrição obtida com sucesso";
      mockTranscriptService.getTranscript.mockResolvedValue(transcript);

      const result = await useCase.execute(urlWithSpecialChars);

      expect(result).toBe(transcript);
      expect(mockTranscriptService.getTranscript).toHaveBeenCalledWith(
        urlWithSpecialChars
      );
    });

    it("deve retornar exatamente o que o serviço retorna", async () => {
      const exactTranscript = "   Transcrição com espaços no início e fim   ";
      mockTranscriptService.getTranscript.mockResolvedValue(exactTranscript);

      const result = await useCase.execute(validVideoUrl);

      expect(result).toBe(exactTranscript);
      expect(result).toMatch(/^   /);
      expect(result).toMatch(/   $/);
    });

    it("deve funcionar com URLs de diferentes domínios do YouTube", async () => {
      const mobileUrl = "https://m.youtube.com/watch?v=dQw4w9WgXcQ";
      const transcript = "Transcrição mobile";
      mockTranscriptService.getTranscript.mockResolvedValue(transcript);

      const result = await useCase.execute(mobileUrl);

      expect(result).toBe(transcript);
      expect(mockTranscriptService.getTranscript).toHaveBeenCalledWith(
        mobileUrl
      );
    });
  });

  describe("construtor", () => {
    it("deve inicializar corretamente com o serviço fornecido", () => {
      const newUseCase = new GetTranscriptUseCase(mockTranscriptService);

      expect(newUseCase).toBeInstanceOf(GetTranscriptUseCase);
    });

    it("deve aceitar diferentes implementações do serviço", () => {
      const alternativeService: ITranscriptService = {
        getTranscript: jest.fn().mockResolvedValue("transcrição option"),
      };

      const newUseCase = new GetTranscriptUseCase(alternativeService);

      expect(newUseCase).toBeInstanceOf(GetTranscriptUseCase);
    });
  });
});
