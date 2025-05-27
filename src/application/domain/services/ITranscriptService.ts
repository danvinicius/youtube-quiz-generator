export interface ITranscriptService {
  getTranscript(videoUrl: string): Promise<string>;
}
