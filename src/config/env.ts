import "dotenv/config";

export const env = {
  openAiApiKey: process.env.OPENAI_API_KEY as string,
  port: Number(process.env.PORT) || 3000,
};
