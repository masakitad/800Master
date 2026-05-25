import { UserProgress, StudyRecord, QuizResult, VocabProgress, IncorrectQuestion, StudyGoals, ToeicPart } from "./types";

const STORAGE_KEY = "800master_progress";

const defaultProgress: UserProgress = {
  studyRecords: [],
  quizResults: [],
  vocabProgress: {},
  incorrectQuestions: {},
  goals: { dailyMinutesTarget: 20 },
  currentStreak: 0,
  longestStreak: 0,
  totalStudyMinutes: 0,
  lastStudyDate: "",
};

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw) as UserProgress;
    return { ...defaultProgress, ...parsed };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a).getTime();
  const db = new Date(b).getTime();
  return Math.round((db - da) / (24 * 60 * 60 * 1000));
}

export function addStudyRecord(record: Omit<StudyRecord, "date"> & { date?: string }): UserProgress {
  const progress = loadProgress();
  const date = record.date ?? todayIso();
  const newRecord: StudyRecord = { ...record, date };
  progress.studyRecords.push(newRecord);
  progress.totalStudyMinutes += record.durationMinutes;

  if (progress.lastStudyDate === "") {
    progress.currentStreak = 1;
  } else if (progress.lastStudyDate === date) {
    // same day, no change
  } else {
    const diff = daysBetween(progress.lastStudyDate, date);
    if (diff === 1) progress.currentStreak += 1;
    else if (diff > 1) progress.currentStreak = 1;
  }
  progress.longestStreak = Math.max(progress.longestStreak, progress.currentStreak);
  progress.lastStudyDate = date;

  saveProgress(progress);
  return progress;
}

export function addQuizResult(result: Omit<QuizResult, "id" | "date">): UserProgress {
  const progress = loadProgress();
  const quizResult: QuizResult = {
    ...result,
    id: `quiz_${Date.now()}`,
    date: new Date().toISOString(),
  };
  progress.quizResults.push(quizResult);
  saveProgress(progress);
  return progress;
}

export function updateVocabProgress(wordId: string, correct: boolean): UserProgress {
  const progress = loadProgress();
  const existing = progress.vocabProgress[wordId];
  const now = new Date();

  let mastery: VocabProgress["mastery"] = existing?.mastery ?? 0;
  let correctStreak = existing?.correctStreak ?? 0;

  if (correct) {
    correctStreak += 1;
    if (correctStreak >= 2 && mastery < 5) {
      mastery = (mastery + 1) as VocabProgress["mastery"];
    }
  } else {
    correctStreak = 0;
    mastery = Math.max(0, mastery - 1) as VocabProgress["mastery"];
  }

  const intervals = [1, 1, 2, 4, 7, 14, 30];
  const nextDays = intervals[mastery] ?? 30;
  const next = new Date(now);
  next.setDate(now.getDate() + nextDays);

  progress.vocabProgress[wordId] = {
    wordId,
    mastery,
    lastReviewed: now.toISOString(),
    nextReview: next.toISOString(),
    correctStreak,
  };

  saveProgress(progress);
  return progress;
}

export function getDueWords(allWordIds: string[]): string[] {
  const progress = loadProgress();
  const now = new Date();
  return allWordIds.filter((id) => {
    const p = progress.vocabProgress[id];
    if (!p) return true;
    return new Date(p.nextReview) <= now;
  });
}

export function recordIncorrectAnswer(questionId: string, part: ToeicPart): UserProgress {
  const progress = loadProgress();
  const existing = progress.incorrectQuestions[questionId];
  progress.incorrectQuestions[questionId] = {
    questionId,
    part,
    wrongCount: (existing?.wrongCount ?? 0) + 1,
    lastWrongDate: new Date().toISOString(),
    resolved: false,
  };
  saveProgress(progress);
  return progress;
}

export function markQuestionResolved(questionId: string): UserProgress {
  const progress = loadProgress();
  const existing = progress.incorrectQuestions[questionId];
  if (existing) {
    progress.incorrectQuestions[questionId] = { ...existing, resolved: true };
    saveProgress(progress);
  }
  return progress;
}

export function listIncorrectQuestions(opts?: { onlyUnresolved?: boolean }): IncorrectQuestion[] {
  const progress = loadProgress();
  const all = Object.values(progress.incorrectQuestions);
  return opts?.onlyUnresolved ? all.filter((q) => !q.resolved) : all;
}

export function setGoals(goals: Partial<StudyGoals>): UserProgress {
  const progress = loadProgress();
  progress.goals = { ...progress.goals, ...goals };
  saveProgress(progress);
  return progress;
}

export function getTodayMinutes(): number {
  const progress = loadProgress();
  const today = todayIso();
  return progress.studyRecords
    .filter((r) => r.date === today)
    .reduce((sum, r) => sum + r.durationMinutes, 0);
}
