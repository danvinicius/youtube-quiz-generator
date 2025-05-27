import { OpenAI } from "openai";
import { IQuizGeneratorService } from "../../application/domain/services/IQuizGeneratorService";
import { env } from "../../config/env";
import { QuizQuestion } from "../../application/domain/entities/Quiz";

export class OpenAIProvider implements IQuizGeneratorService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: env.openAiApiKey });
  }

  async generateQuiz(transcriptText: string): Promise<QuizQuestion[]> {
    const prompt = `
      O seguinte texto é uma transcrição de uma aula educativa.
      Com base nesse conteúdo, elabore 5 perguntas sobre o conteúdo que foi ensinado na aula com alternativas (a, b, c, d, e), indicando qual a correta e explicando o motivo.

      Responda estritamente no seguinte formato JSON:

      [
        {
          "question": "Texto da pergunta",
          "options": [
            {"option": "a", "text": "Texto", "correct": false},
            {"option": "b", "text": "Texto", "correct": true},
            {"option": "c", "text": "Texto", "correct": false}
            {"option": "d", "text": "Texto", "correct": false}
            {"option": "e", "text": "Texto", "correct": false}
          ],
          "explanation": "Texto da explicação da resposta correta"
        },
        ...
      ]

      Aqui está o conteúdo:

      "${transcriptText}"
    `;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {
          role: "system",
          content: "Você é um gerador de quizzes educacionais em formato JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    let content = completion.choices[0].message.content || "";

    content = content.replace(/```(?:json)?\n?([\s\S]*?)```/, "$1");

    try {
      return JSON.parse(content);
    } catch (err) {
      console.error("Erro ao parsear JSON:", err);
      throw new Error("A resposta da IA não está no formato JSON esperado.");
    }
  }
}
