import { YoutubeTranscript } from "youtube-transcript";
import { ITranscriptService } from "../../application/domain/services/ITranscriptService";

export class YoutubeTranscriptProvider implements ITranscriptService {
  private extractVideoID(url: string): string | null {
    const regex = /(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  async getTranscript(videoUrl: string): Promise<string> {
    const videoId = this.extractVideoID(videoUrl);
    if (!videoId) throw new Error("ID de vídeo inválido!");
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    return transcript.map((line) => line.text).join(" ");
  }
}
