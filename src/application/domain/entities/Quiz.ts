export enum Option {
  A = "a",
  B = "b",
  C = "c",
  D = "d",
  E = "e",
}

export interface QuizAlternative {
  option: string;
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizAlternative[];
  explanation: string;
}
