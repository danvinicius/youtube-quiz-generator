import { ITranscriptService } from "../domain/services/ITranscriptService";

export class GetTranscriptUseCase {
  constructor(private transcriptService: ITranscriptService) {}

  async execute(videoUrl: string): Promise<string> {
    return this.transcriptService.getTranscript(videoUrl);
  }
}
