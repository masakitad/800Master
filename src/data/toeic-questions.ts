import { ToeicQuestion } from "@/lib/types";

export const toeicQuestions: ToeicQuestion[] = [
  // ========== Part 1 - Photographs (写真描写) ==========
  {
    id: "p1-1",
    part: "part1",
    question: "音声を聞いて、写真の描写として最も適切なものを選びなさい。",
    photoCaption: "オフィスで女性がノートパソコンに向かってキーボードを打っている。",
    photoPrompt: "A young professional woman sitting at a modern office desk, focused on typing on a laptop computer, natural office lighting, neutral background",
    choices: [
      "A woman is typing on a laptop.",
      "A woman is reading a newspaper.",
      "A woman is talking on the phone.",
      "A woman is writing in a notebook.",
    ],
    choiceAudios: [
      "A woman is typing on a laptop.",
      "A woman is reading a newspaper.",
      "A woman is talking on the phone.",
      "A woman is writing in a notebook.",
    ],
    correctIndex: 0,
    explanation: "写真の動作 (キーボードを打っている) は「typing on a laptop」が最も適切。他は newspaper/phone/notebook と写真にない物の描写です。\n\n【頻出表現】\n- typing on a keyboard/laptop = キーボード/PCで入力する\n- reading a document = 書類を読む",
  },
  {
    id: "p1-2",
    part: "part1",
    question: "音声を聞いて、写真の描写として最も適切なものを選びなさい。",
    photoCaption: "スーパーマーケットの棚に商品がぎっしりと並んでいる。",
    photoPrompt: "Supermarket aisle with fully stocked shelves of colorful product packages, bright store lighting, no people",
    choices: [
      "The shelves are empty.",
      "The shelves are stocked with products.",
      "The shelves are being assembled.",
      "The shelves have been removed.",
    ],
    choiceAudios: [
      "The shelves are empty.",
      "The shelves are stocked with products.",
      "The shelves are being assembled.",
      "The shelves have been removed.",
    ],
    correctIndex: 1,
    explanation: "be stocked with ~ で「~が並べられている」。empty (空の) や being assembled (組み立て中) は写真と矛盾します。\n\n【受動態の状態描写】\n- be stocked with ~ = ~で満たされている\n- be filled with ~ = ~で満ちている",
  },
  {
    id: "p1-3",
    part: "part1",
    question: "音声を聞いて、写真の描写として最も適切なものを選びなさい。",
    photoCaption: "会議室で複数人が机を囲んで資料を見ながら議論している。",
    photoPrompt: "Diverse group of business professionals gathered around a conference table, reviewing documents, engaged in discussion, modern meeting room",
    choices: [
      "People are leaving the room.",
      "People are gathered around a table.",
      "People are watching a movie.",
      "People are eating lunch together.",
    ],
    choiceAudios: [
      "People are leaving the room.",
      "People are gathered around a table.",
      "People are watching a movie.",
      "People are eating lunch together.",
    ],
    correctIndex: 1,
    explanation: "gathered around ~ で「~を囲んで集まっている」。会議シーンの典型的な描写表現です。",
  },
  {
    id: "p1-4",
    part: "part1",
    question: "音声を聞いて、写真の描写として最も適切なものを選びなさい。",
    photoCaption: "工事現場で作業員がヘルメットをかぶり、設計図を確認している。",
    photoPrompt: "Construction worker wearing a hard hat, carefully examining a blueprint at a construction site, daytime outdoor scene",
    choices: [
      "A worker is examining a blueprint.",
      "A worker is operating a forklift.",
      "A worker is painting a wall.",
      "A worker is climbing a ladder.",
    ],
    choiceAudios: [
      "A worker is examining a blueprint.",
      "A worker is operating a forklift.",
      "A worker is painting a wall.",
      "A worker is climbing a ladder.",
    ],
    correctIndex: 0,
    explanation: "examine = 詳しく調べる、blueprint = 設計図。建設・工事関連の頻出語彙です。",
  },
  {
    id: "p1-5",
    part: "part1",
    question: "音声を聞いて、写真の描写として最も適切なものを選びなさい。",
    photoCaption: "屋外のカフェで男性がコーヒーカップを持ち上げて口元に運んでいる。",
    photoPrompt: "Man sitting at an outdoor cafe table, sipping coffee from a cup raised to his mouth, casual relaxed atmosphere",
    choices: [
      "He is pouring coffee into a cup.",
      "He is washing some dishes.",
      "He is sipping from a cup.",
      "He is paying for his order.",
    ],
    choiceAudios: [
      "He is pouring coffee into a cup.",
      "He is washing some dishes.",
      "He is sipping from a cup.",
      "He is paying for his order.",
    ],
    correctIndex: 2,
    explanation: "sip = (飲み物を) ちびちび飲む。pour (注ぐ) は注ぎ込んでいる動作なので不適切。Part 1 では動作の微妙な違いに注意。",
  },
  {
    id: "p1-6",
    part: "part1",
    question: "音声を聞いて、写真の描写として最も適切なものを選びなさい。",
    photoCaption: "空港のチェックインカウンターで職員が乗客のパスポートを受け取って確認している。",
    photoPrompt: "Airline agent at airport check-in counter reviewing a passenger's passport and travel document, professional uniform",
    choices: [
      "Passengers are boarding the plane.",
      "An agent is checking a document.",
      "Luggage is being loaded onto the aircraft.",
      "A flight has just landed.",
    ],
    choiceAudios: [
      "Passengers are boarding the plane.",
      "An agent is checking a document.",
      "Luggage is being loaded onto the aircraft.",
      "A flight has just landed.",
    ],
    correctIndex: 1,
    explanation: "agent = 係員、check a document = 書類を確認する。「人」+「動作」が一致するかを優先して聞き取ります。",
  },
  {
    id: "p1-7",
    part: "part1",
    question: "音声を聞いて、写真の描写として最も適切なものを選びなさい。",
    photoCaption: "公園の歩道に沿って自転車が複数台ずらりと駐輪されている。",
    photoPrompt: "Row of bicycles parked in a line along a park pathway, trees in background, daytime",
    choices: [
      "Bicycles are lined up along the path.",
      "Cyclists are racing on the road.",
      "A bicycle is being repaired.",
      "Bicycles are being delivered.",
    ],
    choiceAudios: [
      "Bicycles are lined up along the path.",
      "Cyclists are racing on the road.",
      "A bicycle is being repaired.",
      "Bicycles are being delivered.",
    ],
    correctIndex: 0,
    explanation: "be lined up = 整列している、along the path = 道沿いに。静的な状態描写と動作描写を区別します。",
  },
  {
    id: "p1-8",
    part: "part1",
    question: "音声を聞いて、写真の描写として最も適切なものを選びなさい。",
    photoCaption: "図書館で人々が本を読んだり、ノートを取ったりしている。",
    photoPrompt: "Library interior with people studying at tables, reading books and taking notes, bookshelves in background, calm atmosphere",
    choices: [
      "Some people are studying at the library.",
      "Books are being returned to the shelf.",
      "Library staff are organizing materials.",
      "Children are playing in the hallway.",
    ],
    choiceAudios: [
      "Some people are studying at the library.",
      "Books are being returned to the shelf.",
      "Library staff are organizing materials.",
      "Children are playing in the hallway.",
    ],
    correctIndex: 0,
    explanation: "study at the library = 図書館で勉強する。全体の状況を簡潔に表現する選択肢を選びます。",
  },

  // ========== Part 2 - Question-Response (応答問題) ==========
  {
    id: "p2-1",
    part: "part2",
    question: "音声の質問に対する最も自然な応答を選びなさい。",
    questionAudio: "Where did you put the meeting agenda?",
    choices: [
      "On your desk, next to the lamp.",
      "At three o'clock.",
      "Yes, I attended it.",
    ],
    choiceAudios: [
      "On your desk, next to the lamp.",
      "At three o'clock.",
      "Yes, I attended it.",
    ],
    correctIndex: 0,
    explanation: "Where (どこ) には場所で応答。on your desk (机の上) が正答。時間や Yes/No は不適切。",
  },
  {
    id: "p2-2",
    part: "part2",
    question: "音声の質問に対する最も自然な応答を選びなさい。",
    questionAudio: "When will the new product be launched?",
    choices: [
      "In the marketing department.",
      "Sometime next month.",
      "It was very successful.",
    ],
    choiceAudios: [
      "In the marketing department.",
      "Sometime next month.",
      "It was very successful.",
    ],
    correctIndex: 1,
    explanation: "When (いつ) には時で応答。sometime next month (来月のいつか) が正答。",
  },
  {
    id: "p2-3",
    part: "part2",
    question: "音声の質問に対する最も自然な応答を選びなさい。",
    questionAudio: "Would you like me to send you the report?",
    choices: [
      "I sent it yesterday.",
      "Yes, that would be great.",
      "It's a quarterly report.",
    ],
    choiceAudios: [
      "I sent it yesterday.",
      "Yes, that would be great.",
      "It's a quarterly report.",
    ],
    correctIndex: 1,
    explanation: "Would you like me to ~? (~しましょうか?) は申し出。自然な応答は Yes/No で受ける。",
  },
  {
    id: "p2-4",
    part: "part2",
    question: "音声の質問に対する最も自然な応答を選びなさい。",
    questionAudio: "How long will the construction take?",
    choices: [
      "About six months.",
      "On Main Street.",
      "The contractor agreed.",
    ],
    choiceAudios: [
      "About six months.",
      "On Main Street.",
      "The contractor agreed.",
    ],
    correctIndex: 0,
    explanation: "How long (どれくらいの期間) には期間で応答。about six months (約6か月) が自然。",
  },
  {
    id: "p2-5",
    part: "part2",
    question: "音声の質問に対する最も自然な応答を選びなさい。",
    questionAudio: "Why was the meeting postponed?",
    choices: [
      "In the conference room.",
      "Because the manager was sick.",
      "Yes, it was very productive.",
    ],
    choiceAudios: [
      "In the conference room.",
      "Because the manager was sick.",
      "Yes, it was very productive.",
    ],
    correctIndex: 1,
    explanation: "Why (なぜ) には Because ~ で理由を答える。postpone = 延期する。",
  },
  {
    id: "p2-6",
    part: "part2",
    question: "音声の質問に対する最も自然な応答を選びなさい。",
    questionAudio: "Who is responsible for the new project?",
    choices: [
      "Ms. Tanaka from accounting.",
      "Next Friday afternoon.",
      "The budget is limited.",
    ],
    choiceAudios: [
      "Ms. Tanaka from accounting.",
      "Next Friday afternoon.",
      "The budget is limited.",
    ],
    correctIndex: 0,
    explanation: "Who (誰) には人名・役職で応答。be responsible for ~ = ~の担当である。",
  },
  {
    id: "p2-7",
    part: "part2",
    question: "音声の質問に対する最も自然な応答を選びなさい。",
    questionAudio: "Have you finished the quarterly report yet?",
    choices: [
      "I'm still working on it.",
      "The report is in English.",
      "Every three months.",
    ],
    choiceAudios: [
      "I'm still working on it.",
      "The report is in English.",
      "Every three months.",
    ],
    correctIndex: 0,
    explanation: "Have you finished ~ yet? (もう~を終えましたか?) → still working on it (まだ取り組んでいる) で答えるのが自然。",
  },
  {
    id: "p2-8",
    part: "part2",
    question: "音声の質問に対する最も自然な応答を選びなさい。",
    questionAudio: "Could you help me with the presentation?",
    choices: [
      "It's at 2 PM.",
      "Of course, what do you need?",
      "I prefer charts.",
    ],
    choiceAudios: [
      "It's at 2 PM.",
      "Of course, what do you need?",
      "I prefer charts.",
    ],
    correctIndex: 1,
    explanation: "Could you help me ~? (~を手伝ってくれますか?) は依頼。Of course (もちろん) + 質問返しが自然。",
  },
  {
    id: "p2-9",
    part: "part2",
    question: "音声の質問に対する最も自然な応答を選びなさい。",
    questionAudio: "Do you prefer the morning or afternoon session?",
    choices: [
      "Yes, I do.",
      "The morning works better for me.",
      "It was educational.",
    ],
    choiceAudios: [
      "Yes, I do.",
      "The morning works better for me.",
      "It was educational.",
    ],
    correctIndex: 1,
    explanation: "or で2択を聞く疑問文には、どちらか一方を選んで答える。Yes/No では応答できない。",
  },
  {
    id: "p2-10",
    part: "part2",
    question: "音声の質問に対する最も自然な応答を選びなさい。",
    questionAudio: "Isn't the new café opening this weekend?",
    choices: [
      "Actually, it opens next Monday.",
      "Coffee, please.",
      "It's near the station.",
    ],
    choiceAudios: [
      "Actually, it opens next Monday.",
      "Coffee, please.",
      "It's near the station.",
    ],
    correctIndex: 0,
    explanation: "否定疑問文 (Isn't ~?) には肯定・否定の内容で応答。Actually (実は) で訂正するパターンに注意。",
  },
  {
    id: "p2-11",
    part: "part2",
    question: "音声の質問に対する最も自然な応答を選びなさい。",
    questionAudio: "What time does the bookstore close?",
    choices: [
      "On the second floor.",
      "At nine in the evening.",
      "It sells textbooks.",
    ],
    choiceAudios: [
      "On the second floor.",
      "At nine in the evening.",
      "It sells textbooks.",
    ],
    correctIndex: 1,
    explanation: "What time (何時) には時刻で応答。at nine in the evening = 夜9時に。",
  },
  {
    id: "p2-12",
    part: "part2",
    question: "音声の質問に対する最も自然な応答を選びなさい。",
    questionAudio: "How was your business trip to Singapore?",
    choices: [
      "It was very productive.",
      "By plane.",
      "Last Tuesday.",
    ],
    choiceAudios: [
      "It was very productive.",
      "By plane.",
      "Last Tuesday.",
    ],
    correctIndex: 0,
    explanation: "How was ~? (~はどうでしたか?) には感想で応答。productive (実りある) は出張への定番表現。",
  },

  // ========== Part 3 - Conversations (会話問題) ==========
  {
    id: "p3-1",
    part: "part3",
    question: "What is the main topic of the conversation?",
    audioScript:
      "W: Hi John, I need to reschedule our 3 PM meeting. Something urgent came up with a client.\nM: No problem. How about tomorrow at 10?\nW: That works perfectly. I'll send you a calendar invite.",
    choices: [
      "A canceled meeting",
      "A delayed flight",
      "A rescheduled appointment",
      "A new business proposal",
    ],
    correctIndex: 2,
    explanation: "reschedule (予定変更) がキーワード。canceled (中止) ではなく rescheduled (再設定) が正確。",
  },
  {
    id: "p3-2",
    part: "part3",
    question: "What will the woman do next?",
    audioScript:
      "W: Hi John, I need to reschedule our 3 PM meeting. Something urgent came up with a client.\nM: No problem. How about tomorrow at 10?\nW: That works perfectly. I'll send you a calendar invite.",
    choices: [
      "Cancel the appointment",
      "Send a calendar invitation",
      "Call the client",
      "Prepare a presentation",
    ],
    correctIndex: 1,
    explanation: "最後の発言「I'll send you a calendar invite」より、次にカレンダー招待を送る。",
  },
  {
    id: "p3-3",
    part: "part3",
    question: "Where most likely is this conversation taking place?",
    audioScript:
      "M: I'd like to return this jacket. I bought it last week but it doesn't fit properly.\nW: Do you have the receipt with you?\nM: Yes, here it is. I'd prefer a refund rather than an exchange.\nW: Sure, I'll process that for you. It will take about 5 business days to appear on your card.",
    choices: [
      "At a restaurant",
      "At a clothing store",
      "At an airport",
      "At a doctor's office",
    ],
    correctIndex: 1,
    explanation: "jacket, return, refund, exchange などの語彙から、衣料品店での会話と判断。",
  },
  {
    id: "p3-4",
    part: "part3",
    question: "What does the man want to do?",
    audioScript:
      "M: I'd like to return this jacket. I bought it last week but it doesn't fit properly.\nW: Do you have the receipt with you?\nM: Yes, here it is. I'd prefer a refund rather than an exchange.\nW: Sure, I'll process that for you. It will take about 5 business days to appear on your card.",
    choices: [
      "Exchange the jacket",
      "Buy a new jacket",
      "Get a refund",
      "File a complaint",
    ],
    correctIndex: 2,
    explanation: "「I'd prefer a refund rather than an exchange」より、返金を希望している。",
  },
  {
    id: "p3-5",
    part: "part3",
    question: "How long will the refund take?",
    audioScript:
      "M: I'd like to return this jacket. I bought it last week but it doesn't fit properly.\nW: Do you have the receipt with you?\nM: Yes, here it is. I'd prefer a refund rather than an exchange.\nW: Sure, I'll process that for you. It will take about 5 business days to appear on your card.",
    choices: [
      "1 business day",
      "3 business days",
      "5 business days",
      "10 business days",
    ],
    correctIndex: 2,
    explanation: "「about 5 business days」と明確に述べられている。数字の聞き取りは頻出。",
  },
  {
    id: "p3-6",
    part: "part3",
    question: "Why is the woman calling?",
    audioScript:
      "W: Hello, this is Sarah from ABC Corporation. I'm calling to confirm our order of 50 office chairs that was placed last Tuesday.\nM: Let me check our system. Yes, I see the order. They should arrive by Friday.\nW: Great. Is there any way to expedite the delivery? We'd like to receive them by Wednesday if possible.\nM: Let me see what I can do. I'll need to charge an extra 15% for express shipping.",
    choices: [
      "To place a new order",
      "To confirm a delivery date",
      "To file a complaint",
      "To cancel an order",
    ],
    correctIndex: 1,
    explanation: "「calling to confirm our order」と冒頭で目的を述べている。",
  },
  {
    id: "p3-7",
    part: "part3",
    question: "What does the woman request?",
    audioScript:
      "W: Hello, this is Sarah from ABC Corporation. I'm calling to confirm our order of 50 office chairs that was placed last Tuesday.\nM: Let me check our system. Yes, I see the order. They should arrive by Friday.\nW: Great. Is there any way to expedite the delivery? We'd like to receive them by Wednesday if possible.\nM: Let me see what I can do. I'll need to charge an extra 15% for express shipping.",
    choices: [
      "A discount",
      "Faster delivery",
      "More chairs",
      "A free sample",
    ],
    correctIndex: 1,
    explanation: "expedite the delivery = 配送を早める。「by Wednesday」と希望日も伝えている。",
  },
  {
    id: "p3-8",
    part: "part3",
    question: "What does the man imply about express shipping?",
    audioScript:
      "W: Hello, this is Sarah from ABC Corporation. I'm calling to confirm our order of 50 office chairs that was placed last Tuesday.\nM: Let me check our system. Yes, I see the order. They should arrive by Friday.\nW: Great. Is there any way to expedite the delivery? We'd like to receive them by Wednesday if possible.\nM: Let me see what I can do. I'll need to charge an extra 15% for express shipping.",
    choices: [
      "It is free of charge.",
      "It is not available.",
      "It comes with additional cost.",
      "It requires advance booking.",
    ],
    correctIndex: 2,
    explanation: "「charge an extra 15%」より追加料金が発生する。imply は「ほのめかす」の意味。",
  },

  // ========== Part 4 - Short Talks (説明文問題) ==========
  {
    id: "p4-1",
    part: "part4",
    question: "Who is the most likely audience for this announcement?",
    audioScript:
      "Attention passengers. Flight 287 to Los Angeles is now boarding at gate B12. Please have your boarding passes and identification ready. We will begin with passengers seated in first class and those needing special assistance.",
    choices: [
      "Airline passengers",
      "Hotel guests",
      "Train commuters",
      "Restaurant customers",
    ],
    correctIndex: 0,
    explanation: "boarding, gate, flight などの語彙から空港でのアナウンスと判断。",
  },
  {
    id: "p4-2",
    part: "part4",
    question: "Who will board first?",
    audioScript:
      "Attention passengers. Flight 287 to Los Angeles is now boarding at gate B12. Please have your boarding passes and identification ready. We will begin with passengers seated in first class and those needing special assistance.",
    choices: [
      "Business class passengers",
      "First class passengers and those needing assistance",
      "Families with young children",
      "All passengers at once",
    ],
    correctIndex: 1,
    explanation: "「begin with passengers seated in first class and those needing special assistance」と明確に述べている。",
  },
  {
    id: "p4-3",
    part: "part4",
    question: "What is the main purpose of this voicemail?",
    audioScript:
      "Hi, this is David from Greenwood Hardware. I'm calling about the custom shelving units you ordered last week. Unfortunately, we're experiencing a delay with our supplier, and your order won't arrive until next Thursday instead of this Friday. We sincerely apologize for the inconvenience. As a gesture of goodwill, we'd like to offer you a 10 percent discount on your next purchase. Please call us back at 555-0123 if you have any questions.",
    choices: [
      "To confirm a delivery time",
      "To apologize for a shipping delay",
      "To request a payment",
      "To announce a sale",
    ],
    correctIndex: 1,
    explanation: "delay (遅延), sincerely apologize (心からお詫び) より、配送遅延の謝罪が主目的。",
  },
  {
    id: "p4-4",
    part: "part4",
    question: "What is being offered as compensation?",
    audioScript:
      "Hi, this is David from Greenwood Hardware. I'm calling about the custom shelving units you ordered last week. Unfortunately, we're experiencing a delay with our supplier, and your order won't arrive until next Thursday instead of this Friday. We sincerely apologize for the inconvenience. As a gesture of goodwill, we'd like to offer you a 10 percent discount on your next purchase. Please call us back at 555-0123 if you have any questions.",
    choices: [
      "A full refund",
      "A 10% discount on next purchase",
      "Free expedited shipping",
      "A replacement product",
    ],
    correctIndex: 1,
    explanation: "「offer you a 10 percent discount on your next purchase」と具体的に述べている。",
  },
  {
    id: "p4-5",
    part: "part4",
    question: "Who is most likely the speaker?",
    audioScript:
      "Good morning, everyone. Thank you for joining today's leadership training workshop. Over the next three hours, we'll be discussing effective communication strategies, conflict resolution, and team motivation techniques. Please feel free to ask questions at any time. We'll have a short break at 10:30, and lunch will be provided at 12:30 in the dining hall.",
    choices: [
      "A new employee",
      "A workshop facilitator",
      "A restaurant manager",
      "A hotel receptionist",
    ],
    correctIndex: 1,
    explanation: "「training workshop」を進行する立場で話している。Trainer/facilitator = ワークショップ進行役。",
  },
  {
    id: "p4-6",
    part: "part4",
    question: "When will the break be?",
    audioScript:
      "Good morning, everyone. Thank you for joining today's leadership training workshop. Over the next three hours, we'll be discussing effective communication strategies, conflict resolution, and team motivation techniques. Please feel free to ask questions at any time. We'll have a short break at 10:30, and lunch will be provided at 12:30 in the dining hall.",
    choices: [
      "9:00",
      "10:30",
      "12:30",
      "3:00",
    ],
    correctIndex: 1,
    explanation: "「a short break at 10:30」と明示。複数の時刻が出てくる場合は質問対象の時刻を選ぶ。",
  },

  // ========== Part 5 - Incomplete Sentences (短文穴埋め) ==========
  {
    id: "p5-1",
    part: "part5",
    question: "The manager ______ all employees to attend the safety training next Monday.",
    choices: ["request", "requests", "requesting", "requested"],
    correctIndex: 3,
    explanation: "文脈から既に決定済みの過去の通達と読める。主語 The manager は単数だが、過去形 requested で時制を合わせる。",
  },
  {
    id: "p5-2",
    part: "part5",
    question: "The new policy will take effect ______ January 1st.",
    choices: ["in", "on", "at", "by"],
    correctIndex: 1,
    explanation: "特定の日付には on を使う。on January 1st = 1月1日に。\n- in + 月/年 (in January, in 2024)\n- on + 日付/曜日 (on Monday, on May 1st)\n- at + 時刻 (at 3 PM)",
  },
  {
    id: "p5-3",
    part: "part5",
    question: "Despite ______ extensive training, the new employee made several mistakes.",
    choices: ["receive", "received", "receiving", "to receive"],
    correctIndex: 2,
    explanation: "前置詞 Despite の後ろは名詞または動名詞 (-ing)。",
  },
  {
    id: "p5-4",
    part: "part5",
    question: "The conference will be held ______ the Hilton Hotel in downtown Tokyo.",
    choices: ["at", "in", "on", "to"],
    correctIndex: 0,
    explanation: "特定の建物・施設には at を使う。at the Hilton Hotel = ヒルトンホテルで。",
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
    explanation: "so + 形容詞 + that 構文。物事を主語にすると -ive 形 (impressive)、人を主語にすると -ed 形 (impressed)。",
  },
  {
    id: "p5-7",
    part: "part5",
    question: "Please ______ the attached document before our next meeting.",
    choices: ["review", "reviews", "reviewing", "reviewed"],
    correctIndex: 0,
    explanation: "Please で始まる命令文は動詞の原形。",
  },
  {
    id: "p5-8",
    part: "part5",
    question: "The CEO ______ a speech at the annual conference last week.",
    choices: ["delivered", "deliver", "delivering", "to deliver"],
    correctIndex: 0,
    explanation: "last week は過去。deliver a speech = 演説する (TOEIC頻出表現)。",
  },
  {
    id: "p5-9",
    part: "part5",
    question: "All applicants must submit their resumes ______ Friday at 5 PM.",
    choices: ["by", "until", "during", "since"],
    correctIndex: 0,
    explanation: "期限の by (~までに) と継続の until (~まで) を区別。提出は瞬間動作なので by。",
  },
  {
    id: "p5-10",
    part: "part5",
    question: "The marketing team is ______ for developing the brand strategy.",
    choices: ["response", "responsible", "responsibly", "responsibility"],
    correctIndex: 1,
    explanation: "be responsible for ~ = ~を担当する。be 動詞 + 形容詞の形。",
  },
  {
    id: "p5-11",
    part: "part5",
    question: "Mr. Yamamoto, ______ has been with the company for 20 years, will retire next month.",
    choices: ["who", "which", "whose", "whom"],
    correctIndex: 0,
    explanation: "人を先行詞とする主格関係代名詞は who。直後に動詞が来る場合は who/which (主格)。",
  },
  {
    id: "p5-12",
    part: "part5",
    question: "The new software is ______ user-friendly than the previous version.",
    choices: ["much", "more", "very", "most"],
    correctIndex: 1,
    explanation: "than があるので比較級。user-friendly は長めの形容詞なので more user-friendly。",
  },
  {
    id: "p5-13",
    part: "part5",
    question: "Employees are required ______ their identification cards at all times.",
    choices: ["wear", "wearing", "to wear", "worn"],
    correctIndex: 2,
    explanation: "be required to do = ~することが求められる。to 不定詞を取る動詞。",
  },
  {
    id: "p5-14",
    part: "part5",
    question: "The training session was ______ informative that I learned many new skills.",
    choices: ["so", "such", "very", "too"],
    correctIndex: 0,
    explanation: "so + 形容詞 + that 構文。such + (a/an +) 形容詞 + 名詞 + that との違いに注意。",
  },
  {
    id: "p5-15",
    part: "part5",
    question: "______ the heavy rain, the outdoor event continued as scheduled.",
    choices: ["Although", "Because", "Despite", "However"],
    correctIndex: 2,
    explanation: "Despite + 名詞 (~にもかかわらず)。Although は接続詞なので後ろに文が必要。",
  },
  {
    id: "p5-16",
    part: "part5",
    question: "The committee will meet ______ to discuss the budget proposal.",
    choices: ["regular", "regularly", "regulation", "regulate"],
    correctIndex: 1,
    explanation: "動詞 meet を修飾するので副詞 regularly (定期的に)。",
  },
  {
    id: "p5-17",
    part: "part5",
    question: "Customers can return any product ______ 30 days of purchase.",
    choices: ["within", "during", "between", "until"],
    correctIndex: 0,
    explanation: "within ~ days = ~日以内に。期限を示す前置詞。",
  },
  {
    id: "p5-18",
    part: "part5",
    question: "The new branch office will open ______ the end of this year.",
    choices: ["in", "by", "on", "of"],
    correctIndex: 1,
    explanation: "by the end of ~ = ~の終わりまでに。期限を示す慣用表現。",
  },
  {
    id: "p5-19",
    part: "part5",
    question: "Please ensure that all reports are submitted ______ to the deadline.",
    choices: ["prior", "before", "advance", "ahead"],
    correctIndex: 0,
    explanation: "prior to ~ = ~より前に。前置詞 to を伴うフォーマル表現。",
  },
  {
    id: "p5-20",
    part: "part5",
    question: "Our company is committed ______ providing excellent customer service.",
    choices: ["to", "for", "with", "in"],
    correctIndex: 0,
    explanation: "be committed to ~ing = ~することに尽力している。この to は前置詞なので動名詞が続く。",
  },

  // ========== Part 6 - Text Completion (長文穴埋め) ==========
  {
    id: "p6-1",
    part: "part6",
    question: "We are pleased to announce that our company has ______ a new partnership with ABC Corporation.",
    choices: ["established", "establishing", "establish", "establishment"],
    correctIndex: 0,
    explanation: "has の後ろは過去分詞。have/has + 過去分詞 (現在完了)。",
    passage:
      "Dear valued customers,\n\nWe are pleased to announce that our company has ______ a new partnership with ABC Corporation. This collaboration will enable us to provide you with even better services and broader product selections.",
  },
  {
    id: "p6-2",
    part: "part6",
    question: "We appreciate your continued ______ and look forward to serving you better.",
    choices: ["support", "supportive", "supporter", "supporting"],
    correctIndex: 0,
    explanation: "continued (形容詞) の後ろは名詞。support は名詞 (支援)。",
    passage:
      "Thank you for being our customer for many years. We appreciate your continued ______ and look forward to serving you better.",
  },
  {
    id: "p6-3",
    part: "part6",
    question: "The renovation will ______ approximately three weeks.",
    choices: ["take", "make", "do", "spend"],
    correctIndex: 0,
    explanation: "take + 時間 = (時間が) かかる。take time の典型構文。",
    passage:
      "Please be advised that the lobby will be temporarily closed for renovation starting next Monday. The renovation will ______ approximately three weeks. We appreciate your patience during this period.",
  },
  {
    id: "p6-4",
    part: "part6",
    question: "Employees are encouraged to use the side entrance ______ this time.",
    choices: ["at", "in", "during", "with"],
    correctIndex: 2,
    explanation: "during this time = この期間中。期間を示す during。",
    passage:
      "Please be advised that the lobby will be temporarily closed for renovation starting next Monday. Employees are encouraged to use the side entrance ______ this time.",
  },
  {
    id: "p6-5",
    part: "part6",
    question: "Applications will be reviewed in the order they are ______.",
    choices: ["receive", "received", "receiving", "to receive"],
    correctIndex: 1,
    explanation: "they are の後ろは受動態を作る過去分詞。「応募が受理された順に」。",
    passage:
      "We are currently accepting applications for the Sales Manager position. The deadline is May 31st. Applications will be reviewed in the order they are ______.",
  },
  {
    id: "p6-6",
    part: "part6",
    question: "Successful candidates will be ______ for an interview by mid-June.",
    choices: ["contact", "contacting", "contacted", "contacts"],
    correctIndex: 2,
    explanation: "be 動詞 + 過去分詞で受動態。「採用候補者は連絡される」。",
    passage:
      "We are currently accepting applications for the Sales Manager position. Successful candidates will be ______ for an interview by mid-June.",
  },

  // ========== Part 7 - Reading Comprehension (読解問題) ==========
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
    explanation: "冒頭「This is to confirm your order」より、注文確認が目的。",
    passage:
      "Dear Mr. Smith,\n\nThis is to confirm your order #12345 placed on May 10th. The total amount is $250, and your items will be shipped within 3 business days. You will receive a tracking number once the package is dispatched.\n\nThank you for choosing our service.\n\nBest regards,\nCustomer Service",
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
    explanation: "「shipped within 3 business days」より、3営業日以内。",
    passage:
      "Dear Mr. Smith,\n\nThis is to confirm your order #12345 placed on May 10th. The total amount is $250, and your items will be shipped within 3 business days. You will receive a tracking number once the package is dispatched.\n\nThank you for choosing our service.\n\nBest regards,\nCustomer Service",
  },
  {
    id: "p7-3",
    part: "part7",
    question: "What event is being announced?",
    choices: [
      "A product launch",
      "A grand opening celebration",
      "A retirement party",
      "An annual conference",
    ],
    correctIndex: 1,
    explanation: "「grand opening of our newest location」より、新店舗のグランドオープン。",
    passage:
      "GRAND OPENING CELEBRATION!\n\nJoin us on Saturday, June 15th, for the grand opening of our newest location at 250 Park Avenue. Doors open at 10:00 AM. The first 100 customers will receive a complimentary gift bag worth over $50. Live music, refreshments, and exclusive discounts of up to 40% off will be available throughout the day. We look forward to welcoming you!",
  },
  {
    id: "p7-4",
    part: "part7",
    question: "How can someone receive a gift bag?",
    choices: [
      "By making a purchase",
      "By being one of the first 100 customers",
      "By signing up online",
      "By bringing a friend",
    ],
    correctIndex: 1,
    explanation: "「The first 100 customers will receive a complimentary gift bag」より、最初の100人に進呈。",
    passage:
      "GRAND OPENING CELEBRATION!\n\nJoin us on Saturday, June 15th, for the grand opening of our newest location at 250 Park Avenue. Doors open at 10:00 AM. The first 100 customers will receive a complimentary gift bag worth over $50. Live music, refreshments, and exclusive discounts of up to 40% off will be available throughout the day. We look forward to welcoming you!",
  },
  {
    id: "p7-5",
    part: "part7",
    question: "Why is Ms. Chen writing to Mr. Park?",
    choices: [
      "To submit a job application",
      "To schedule an interview",
      "To request salary information",
      "To accept a job offer",
    ],
    correctIndex: 3,
    explanation: "「I am pleased to accept the position」より、内定承諾のメール。",
    passage:
      "Dear Mr. Park,\n\nThank you for offering me the position of Marketing Director at Globex Inc. After careful consideration, I am pleased to accept the position under the terms we discussed during our meeting last Friday.\n\nI am excited to start contributing to the team on June 1st, as agreed. Please let me know if there is any paperwork I need to complete before my start date.\n\nThank you again for this wonderful opportunity.\n\nBest regards,\nMin-jung Chen",
  },
  {
    id: "p7-6",
    part: "part7",
    question: "When will Ms. Chen start working?",
    choices: ["May 1st", "June 1st", "Last Friday", "Next Monday"],
    correctIndex: 1,
    explanation: "「start contributing to the team on June 1st」より、6月1日。",
    passage:
      "Dear Mr. Park,\n\nThank you for offering me the position of Marketing Director at Globex Inc. After careful consideration, I am pleased to accept the position under the terms we discussed during our meeting last Friday.\n\nI am excited to start contributing to the team on June 1st, as agreed. Please let me know if there is any paperwork I need to complete before my start date.\n\nThank you again for this wonderful opportunity.\n\nBest regards,\nMin-jung Chen",
  },
  {
    id: "p7-7",
    part: "part7",
    question: "What is included with the monthly subscription?",
    choices: [
      "Unlimited streaming on one device",
      "Streaming on multiple devices and offline downloads",
      "Free hardware",
      "Lifetime access",
    ],
    correctIndex: 1,
    explanation: "「stream on up to 5 devices」「download content for offline viewing」より、複数デバイスとオフライン視聴が含まれる。",
    passage:
      "StreamMax Premium Subscription\n\nFor only $14.99 per month, enjoy unlimited access to thousands of movies and TV shows in 4K Ultra HD. You can stream on up to 5 devices simultaneously and download content for offline viewing. New releases are added every Friday.\n\nCancel anytime — no contracts, no fees.",
  },
  {
    id: "p7-8",
    part: "part7",
    question: "When are new releases added to the service?",
    choices: ["Every Monday", "Every Friday", "Every weekend", "Daily"],
    correctIndex: 1,
    explanation: "「New releases are added every Friday」と明記。",
    passage:
      "StreamMax Premium Subscription\n\nFor only $14.99 per month, enjoy unlimited access to thousands of movies and TV shows in 4K Ultra HD. You can stream on up to 5 devices simultaneously and download content for offline viewing. New releases are added every Friday.\n\nCancel anytime — no contracts, no fees.",
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

export function getMockExamQuestions(): ToeicQuestion[] {
  const parts = ["part1", "part2", "part3", "part4", "part5", "part6", "part7"];
  return parts.flatMap((p) => {
    const pool = getQuestionsByPart(p);
    return [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(3, pool.length));
  });
}

export function estimateToeicScore(correctCount: number, totalCount: number): number {
  if (totalCount === 0) return 0;
  const rate = correctCount / totalCount;
  return Math.round(rate * 990);
}
