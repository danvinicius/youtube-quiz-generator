import { YoutubeTranscriptProvider } from "../YoutubeTranscriptProvider";
import { YoutubeTranscript } from "youtube-transcript";

jest.mock("youtube-transcript");
const MockedYoutubeTranscript = YoutubeTranscript as jest.Mocked<
  typeof YoutubeTranscript
>;

describe("YoutubeTranscriptProvider", () => {
  let provider: YoutubeTranscriptProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new YoutubeTranscriptProvider();
  });

  describe("extractVideoID", () => {
    it("deve extrair ID de URL padrão do YouTube", async () => {
      const validUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      const mockTranscript = [
        { text: "Hello", duration: 1000, offset: 0 },
        { text: "World", duration: 1000, offset: 1000 },
      ];

      MockedYoutubeTranscript.fetchTranscript.mockResolvedValue(
        mockTranscript as any
      );

      await provider.getTranscript(validUrl);

      expect(MockedYoutubeTranscript.fetchTranscript).toHaveBeenCalledWith(
        "dQw4w9WgXcQ"
      );
    });

    it("deve extrair ID de URL embed do YouTube", async () => {
      const embedUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";
      const mockTranscript = [{ text: "Test", duration: 1000, offset: 0 }];

      MockedYoutubeTranscript.fetchTranscript.mockResolvedValue(
        mockTranscript as any
      );

      await provider.getTranscript(embedUrl);

      expect(MockedYoutubeTranscript.fetchTranscript).toHaveBeenCalledWith(
        "dQw4w9WgXcQ"
      );
    });

    it("deve extrair ID de URL youtu.be", async () => {
      const shortUrl = "https://youtu.be/dQw4w9WgXcQ";
      const mockTranscript = [{ text: "Test", duration: 1000, offset: 0 }];

      MockedYoutubeTranscript.fetchTranscript.mockResolvedValue(
        mockTranscript as any
      );

      await provider.getTranscript(shortUrl);

      expect(MockedYoutubeTranscript.fetchTranscript).toHaveBeenCalledWith(
        "dQw4w9WgXcQ"
      );
    });

    it("deve extrair ID de URL com parâmetros adicionais", async () => {
      const urlWithParams =
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120s&list=PLTest";
      const mockTranscript = [{ text: "Test", duration: 1000, offset: 0 }];

      MockedYoutubeTranscript.fetchTranscript.mockResolvedValue(
        mockTranscript as any
      );

      await provider.getTranscript(urlWithParams);

      expect(MockedYoutubeTranscript.fetchTranscript).toHaveBeenCalledWith(
        "dQw4w9WgXcQ"
      );
    });

    it("deve lidar com IDs de vídeo com caracteres especiais válidos", async () => {
      const urlWithSpecialChars = "https://www.youtube.com/watch?v=aB3_cD4-eF5";
      const mockTranscript = [{ text: "Test", duration: 1000, offset: 0 }];

      MockedYoutubeTranscript.fetchTranscript.mockResolvedValue(
        mockTranscript as any
      );

      await provider.getTranscript(urlWithSpecialChars);

      expect(MockedYoutubeTranscript.fetchTranscript).toHaveBeenCalledWith(
        "aB3_cD4-eF5"
      );
    });
  });

  describe("getTranscript", () => {
    const validVideoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

    it("deve retornar transcrição concatenada quando bem-sucedido", async () => {
      const mockTranscript = [
        { text: "Hello", duration: 1000, offset: 0 },
        { text: "world,", duration: 1000, offset: 1000 },
        { text: "this", duration: 1000, offset: 2000 },
        { text: "is", duration: 1000, offset: 3000 },
        { text: "a", duration: 1000, offset: 4000 },
        { text: "test.", duration: 1000, offset: 5000 },
      ];

      MockedYoutubeTranscript.fetchTranscript.mockResolvedValue(
        mockTranscript as any
      );

      const result = await provider.getTranscript(validVideoUrl);

      expect(result).toBe("Hello world, this is a test.");
      expect(MockedYoutubeTranscript.fetchTranscript).toHaveBeenCalledWith(
        "dQw4w9WgXcQ"
      );
    });

    it("deve retornar string vazia quando não há transcrição", async () => {
      MockedYoutubeTranscript.fetchTranscript.mockResolvedValue([] as any);

      const result = await provider.getTranscript(validVideoUrl);

      expect(result).toBe("");
    });

    it("deve lidar com transcrição de uma única linha", async () => {
      const mockTranscript = [
        { text: "Single line transcript", duration: 1000, offset: 0 },
      ];

      MockedYoutubeTranscript.fetchTranscript.mockResolvedValue(
        mockTranscript as any
      );

      const result = await provider.getTranscript(validVideoUrl);

      expect(result).toBe("Single line transcript");
    });

    it("deve lançar erro para URL inválida sem ID de vídeo", async () => {
      const invalidUrl = "https://www.example.com/invalid-url";

      await expect(provider.getTranscript(invalidUrl)).rejects.toThrow(
        "ID de vídeo inválido!"
      );
      expect(MockedYoutubeTranscript.fetchTranscript).not.toHaveBeenCalled();
    });

    it("deve lançar erro para URL vazia", async () => {
      const emptyUrl = "";

      await expect(provider.getTranscript(emptyUrl)).rejects.toThrow(
        "ID de vídeo inválido!"
      );
      expect(MockedYoutubeTranscript.fetchTranscript).not.toHaveBeenCalled();
    });

    it("deve lançar erro para URL com ID de vídeo muito curto", async () => {
      const shortIdUrl = "https://www.youtube.com/watch?v=short";

      await expect(provider.getTranscript(shortIdUrl)).rejects.toThrow(
        "ID de vídeo inválido!"
      );
      expect(MockedYoutubeTranscript.fetchTranscript).not.toHaveBeenCalled();
    });

    it("deve lançar erro para URL com ID de vídeo muito longo", async () => {
      const longIdUrl =
        "https://www.youtube.com/watch?v=dQw4w9WgXcQextralongid";
      const mockTranscript = [
        { text: "Single line transcript", duration: 1000, offset: 0 },
      ];
      MockedYoutubeTranscript.fetchTranscript.mockResolvedValue(
        mockTranscript as any
      );

      const result = await provider.getTranscript(longIdUrl);

      expect(result).toBe("Single line transcript");
      expect(MockedYoutubeTranscript.fetchTranscript).toHaveBeenCalledWith(
        "dQw4w9WgXcQ"
      );
    });

    it("deve propagar erros do YoutubeTranscript.fetchTranscript", async () => {
      const transcriptError = new Error("Transcript not available");
      MockedYoutubeTranscript.fetchTranscript.mockRejectedValue(
        transcriptError
      );

      await expect(provider.getTranscript(validVideoUrl)).rejects.toThrow(
        "Transcript not available"
      );
      expect(MockedYoutubeTranscript.fetchTranscript).toHaveBeenCalledWith(
        "dQw4w9WgXcQ"
      );
    });

    it("deve lidar com caracteres especiais na transcrição", async () => {
      const mockTranscript = [
        { text: "Olá,", duration: 1000, offset: 0 },
        { text: "como", duration: 1000, offset: 1000 },
        { text: "está?", duration: 1000, offset: 2000 },
        { text: "¿Hablas", duration: 1000, offset: 3000 },
        { text: "español?", duration: 1000, offset: 4000 },
      ];

      MockedYoutubeTranscript.fetchTranscript.mockResolvedValue(
        mockTranscript as any
      );

      const result = await provider.getTranscript(validVideoUrl);

      expect(result).toBe("Olá, como está? ¿Hablas español?");
    });

    it("deve lidar com espaços em branco extras na transcrição", async () => {
      const mockTranscript = [
        { text: "  Hello  ", duration: 1000, offset: 0 },
        { text: " world ", duration: 1000, offset: 1000 },
        { text: "  test  ", duration: 1000, offset: 2000 },
      ];

      MockedYoutubeTranscript.fetchTranscript.mockResolvedValue(
        mockTranscript as any
      );

      const result = await provider.getTranscript(validVideoUrl);

      expect(result).toBe("  Hello    world    test  ");
    });

    it("deve lidar com diferentes formatos de URL do YouTube mobile", async () => {
      const mobileUrl = "https://m.youtube.com/watch?v=dQw4w9WgXcQ";
      const mockTranscript = [
        { text: "Mobile test", duration: 1000, offset: 0 },
      ];

      MockedYoutubeTranscript.fetchTranscript.mockResolvedValue(
        mockTranscript as any
      );

      const result = await provider.getTranscript(mobileUrl);

      expect(result).toBe("Mobile test");
      expect(MockedYoutubeTranscript.fetchTranscript).toHaveBeenCalledWith(
        "dQw4w9WgXcQ"
      );
    });
  });
});
