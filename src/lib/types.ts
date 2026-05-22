export type ToeicPart = "part1" | "part2" | "part3" | "part4" | "part5" | "part6" | "part7";

export interface ToeicQuestion {
  id: string;
  part: ToeicPart;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  audioScript?: string;
  passage?: string;
  photoCaption?: string;
  photoPrompt?: string;
  imageUrl?: string;
  choiceAudios?: string[];
  questionAudio?: string;
}

export interface VocabWord {
  id: string;
  word: string;
  meaning: string;
  partOfSpeech: string;
  example: string;
  exampleJp: string;
  level: "basic" | "intermediate" | "advanced";
}

export interface PhraseScene {
  id: string;
  category: string;
  title: string;
  phrases: Phrase[];
}

export interface Phrase {
  en: string;
  jp: string;
  note?: string;
}

export interface StudyRecord {
  date: string;
  durationMinutes: number;
  activity: "toeic" | "vocab" | "phrases" | "chat";
  part?: ToeicPart;
  correctCount?: number;
  totalCount?: number;
}

export interface QuizResult {
  id: string;
  date: string;
  part: ToeicPart | "mock";
  correctCount: number;
  totalCount: number;
  estimatedScore?: number;
}

export interface VocabProgress {
  wordId: string;
  mastery: 0 | 1 | 2 | 3 | 4 | 5;
  lastReviewed: string;
  nextReview: string;
  correctStreak: number;
}

export interface IncorrectQuestion {
  questionId: string;
  part: ToeicPart;
  wrongCount: number;
  lastWrongDate: string;
  resolved?: boolean;
}

export interface StudyGoals {
  dailyMinutesTarget: number;
  targetScore?: number;
  targetDate?: string;
}

export interface UserProgress {
  studyRecords: StudyRecord[];
  quizResults: QuizResult[];
  vocabProgress: Record<string, VocabProgress>;
  incorrectQuestions: Record<string, IncorrectQuestion>;
  goals: StudyGoals;
  currentStreak: number;
  longestStreak: number;
  totalStudyMinutes: number;
  lastStudyDate: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}
