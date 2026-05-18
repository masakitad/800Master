import { ToeicQuestion } from "@/lib/types";

export const toeicQuestions: ToeicQuestion[] = [
  // Part 1 - Photographs (写真描写問題)
  {
    id: "p1-1",
    part: "part1",
    question: "写真の描写として最も適切なものを選びなさい。",
    choices: [
      "A woman is typing on a laptop.",
      "A woman is reading a newspaper.",
      "A woman is talking on the phone.",
      "A woman is writing in a notebook.",
    ],
    correctIndex: 0,
    explanation: "写真描写問題では、人物の動作・状態を正確に聞き取ることが重要です。typing on a laptop = ノートPCで入力している。",
    audioScript: "A woman is typing on a laptop.",
  },
  {
    id: "p1-2",
    part: "part1",
    question: "写真の描写として最も適切なものを選びなさい。",
    choices: [
      "The shelves are empty.",
      "The shelves are stocked with products.",
      "The shelves are being assembled.",
      "The shelves have been removed.",
    ],
    correctIndex: 1,
    explanation: "be stocked with ~ で「~が並べられている/在庫がある」という意味。受動態の状態描写に注意。",
    audioScript: "The shelves are stocked with products.",
  },

  // Part 2 - Question-Response (応答問題)
  {
    id: "p2-1",
    part: "part2",
    question: "Where did you put the meeting agenda?",
    choices: [
      "On your desk, next to the lamp.",
      "At three o'clock.",
      "Yes, I attended it.",
    ],
    correctIndex: 0,
    explanation: "Where (どこ) で始まる疑問文には場所で答えます。on your desk が正答。",
    audioScript: "Where did you put the meeting agenda?",
  },
  {
    id: "p2-2",
    part: "part2",
    question: "When will the new product be launched?",
    choices: [
      "In the marketing department.",
      "Sometime next month.",
      "It was very successful.",
    ],
    correctIndex: 1,
    explanation: "When で始まる疑問文には時を答えます。sometime next month (来月中に) が正答。",
    audioScript: "When will the new product be launched?",
  },
  {
    id: "p2-3",
    part: "part2",
    question: "Would you like me to send you the report?",
    choices: [
      "I sent it yesterday.",
      "Yes, that would be great.",
      "It's a quarterly report.",
    ],
    correctIndex: 1,
    explanation: "Would you like me to ~? (~しましょうか?) という申し出に対する自然な応答は yes/no。",
    audioScript: "Would you like me to send you the report?",
  },

  // Part 3 - Conversations (会話問題)
  {
    id: "p3-1",
    part: "part3",
    question: "What is the main topic of the conversation?",
    choices: [
      "A canceled meeting",
      "A delayed flight",
      "A rescheduled appointment",
      "A new business proposal",
    ],
    correctIndex: 2,
    explanation: "会話全体の主題を問う問題。reschedule (予定変更) というキーワードに注意。",
    audioScript: "W: Hi John, I need to reschedule our 3 PM meeting. Something urgent came up.\nM: No problem. How about tomorrow at 10?\nW: That works perfectly. I'll send you a calendar invite.",
  },
  {
    id: "p3-2",
    part: "part3",
    question: "What will the woman do next?",
    choices: [
      "Cancel the appointment",
      "Send a calendar invitation",
      "Call the client",
      "Prepare a presentation",
    ],
    correctIndex: 1,
    explanation: "会話の最後の発言「I'll send you a calendar invite」から、女性は次にカレンダー招待を送る。",
    audioScript: "W: Hi John, I need to reschedule our 3 PM meeting. Something urgent came up.\nM: No problem. How about tomorrow at 10?\nW: That works perfectly. I'll send you a calendar invite.",
  },

  // Part 4 - Short Talks (説明文問題)
  {
    id: "p4-1",
    part: "part4",
    question: "Who is the most likely audience for this announcement?",
    choices: [
      "Airline passengers",
      "Hotel guests",
      "Train commuters",
      "Restaurant customers",
    ],
    correctIndex: 0,
    explanation: "boarding, gate, flight などの単語から空港でのアナウンスと判断できる。",
    audioScript: "Attention passengers. Flight 287 to Los Angeles is now boarding at gate B12. Please have your boarding passes and identification ready.",
  },

  // Part 5 - Incomplete Sentences (短文穴埋め問題)
  {
    id: "p5-1",
    part: "part5",
    question: "The manager ______ all employees to attend the safety training next Monday.",
    choices: ["request", "requests", "requesting", "requested"],
    correctIndex: 3,
    explanation: "next Monday は未来の予定だが、文全体が過去の決定事項を述べているため過去形 requested が正解。主語 The manager は単数。",
  },
  {
    id: "p5-2",
    part: "part5",
    question: "The new policy will take effect ______ January 1st.",
    choices: ["in", "on", "at", "by"],
    correctIndex: 1,
    explanation: "特定の日付の前置詞は on を使う。on January 1st = 1月1日に。",
  },
  {
    id: "p5-3",
    part: "part5",
    question: "Despite ______ extensive training, the new employee made several mistakes.",
    choices: ["receive", "received", "receiving", "to receive"],
    correctIndex: 2,
    explanation: "前置詞 Despite の後には名詞または動名詞 (-ing) が来る。receiving が正解。",
  },
  {
    id: "p5-4",
    part: "part5",
    question: "The conference will be held ______ the Hilton Hotel in downtown Tokyo.",
    choices: ["at", "in", "on", "to"],
    correctIndex: 0,
    explanation: "特定の建物・場所を指すときは at を使う。at the Hilton Hotel が自然。",
  },
  {
    id: "p5-5",
    part: "part5",
    question: "Sales have increased ______ 15% compared to last quarter.",
    choices: ["by", "in", "for", "to"],
    correctIndex: 0,
    explanation: "増減の幅を示すときは by を使う。increased by 15% = 15%増加した。",
  },
  {
    id: "p5-6",
    part: "part5",
    question: "The presentation was so ______ that everyone gave it a standing ovation.",
    choices: ["impress", "impressive", "impressed", "impression"],
    correctIndex: 1,
    explanation: "so + 形容詞 + that 構文。物事を主語にした形容詞は -ive 形 (impressive)。",
  },
  {
    id: "p5-7",
    part: "part5",
    question: "Please ______ the attached document before our next meeting.",
    choices: ["review", "reviews", "reviewing", "reviewed"],
    correctIndex: 0,
    explanation: "Please で始まる命令文は動詞の原形を使う。review が正解。",
  },
  {
    id: "p5-8",
    part: "part5",
    question: "The CEO ______ a speech at the annual conference last week.",
    choices: ["delivered", "deliver", "delivering", "to deliver"],
    correctIndex: 0,
    explanation: "last week は過去を示す表現。過去形 delivered が正解。deliver a speech = 演説する。",
  },

  // Part 6 - Text Completion (長文穴埋め問題)
  {
    id: "p6-1",
    part: "part6",
    question: "We are pleased to announce that our company has ______ a new partnership with ABC Corporation.",
    choices: ["established", "establishing", "establish", "establishment"],
    correctIndex: 0,
    explanation: "has の後ろは過去分詞。establish の過去分詞は established。",
    passage: "Dear valued customers,\n\nWe are pleased to announce that our company has ______ a new partnership with ABC Corporation. This collaboration will enable us to provide you with even better services.",
  },
  {
    id: "p6-2",
    part: "part6",
    question: "We appreciate your continued ______ and look forward to serving you better.",
    choices: ["support", "supportive", "supporter", "supporting"],
    correctIndex: 0,
    explanation: "your continued の後ろは名詞。support (支援) が文脈に合う。",
    passage: "Thank you for being our customer for many years. We appreciate your continued ______ and look forward to serving you better.",
  },

  // Part 7 - Reading Comprehension (読解問題)
  {
    id: "p7-1",
    part: "part7",
    question: "What is the purpose of this email?",
    choices: [
      "To request a meeting",
      "To announce a new policy",
      "To confirm an order",
      "To apologize for a delay",
    ],
    correctIndex: 2,
    explanation: "メールの冒頭「This is to confirm your order」から、注文確認が目的とわかる。",
    passage: "Dear Mr. Smith,\n\nThis is to confirm your order #12345 placed on May 10th. The total amount is $250, and your items will be shipped within 3 business days. You will receive a tracking number once the package is dispatched.\n\nThank you for choosing our service.\n\nBest regards,\nCustomer Service",
  },
  {
    id: "p7-2",
    part: "part7",
    question: "When will the items be shipped?",
    choices: [
      "Within 24 hours",
      "Within 3 business days",
      "Next week",
      "On May 10th",
    ],
    correctIndex: 1,
    explanation: "本文中「shipped within 3 business days」より、3営業日以内に発送される。",
    passage: "Dear Mr. Smith,\n\nThis is to confirm your order #12345 placed on May 10th. The total amount is $250, and your items will be shipped within 3 business days. You will receive a tracking number once the package is dispatched.\n\nThank you for choosing our service.\n\nBest regards,\nCustomer Service",
  },
];

export function getQuestionsByPart(part: string): ToeicQuestion[] {
  return toeicQuestions.filter((q) => q.part === part);
}

export function getRandomQuestions(count: number, part?: string): ToeicQuestion[] {
  const pool = part ? getQuestionsByPart(part) : toeicQuestions;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function estimateToeicScore(correctCount: number, totalCount: number): number {
  if (totalCount === 0) return 0;
  const rate = correctCount / totalCount;
  return Math.round(rate * 990);
}
