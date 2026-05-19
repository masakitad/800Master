import { VocabWord } from "@/lib/types";

export const vocabulary: VocabWord[] = [
  // Basic - TOEIC 500-600
  { id: "v001", word: "achieve", meaning: "達成する", partOfSpeech: "動詞", example: "We achieved our quarterly sales target.", exampleJp: "私たちは四半期の売上目標を達成しました。", level: "basic" },
  { id: "v002", word: "purchase", meaning: "購入する、購入", partOfSpeech: "動詞/名詞", example: "Please retain your receipt as proof of purchase.", exampleJp: "購入の証明としてレシートを保管してください。", level: "basic" },
  { id: "v003", word: "schedule", meaning: "予定、予定する", partOfSpeech: "名詞/動詞", example: "The meeting is scheduled for 3 PM.", exampleJp: "会議は午後3時に予定されています。", level: "basic" },
  { id: "v004", word: "conference", meaning: "会議、協議会", partOfSpeech: "名詞", example: "The annual conference will be held in Tokyo.", exampleJp: "年次会議は東京で開催されます。", level: "basic" },
  { id: "v005", word: "employee", meaning: "従業員", partOfSpeech: "名詞", example: "All employees must attend the safety training.", exampleJp: "全従業員は安全研修に参加しなければなりません。", level: "basic" },
  { id: "v006", word: "deadline", meaning: "締切", partOfSpeech: "名詞", example: "We need to meet the project deadline.", exampleJp: "プロジェクトの締切に間に合わせる必要があります。", level: "basic" },
  { id: "v007", word: "department", meaning: "部門、部署", partOfSpeech: "名詞", example: "She works in the marketing department.", exampleJp: "彼女はマーケティング部で働いています。", level: "basic" },
  { id: "v008", word: "invoice", meaning: "請求書", partOfSpeech: "名詞", example: "Please pay the invoice within 30 days.", exampleJp: "30日以内に請求書をお支払いください。", level: "basic" },
  { id: "v009", word: "negotiate", meaning: "交渉する", partOfSpeech: "動詞", example: "We need to negotiate the terms of the contract.", exampleJp: "契約条件を交渉する必要があります。", level: "basic" },
  { id: "v010", word: "promotion", meaning: "昇進、販売促進", partOfSpeech: "名詞", example: "He received a promotion to senior manager.", exampleJp: "彼はシニアマネージャーへの昇進を得ました。", level: "basic" },

  // Intermediate - TOEIC 600-750
  { id: "v011", word: "implement", meaning: "実施する、導入する", partOfSpeech: "動詞", example: "The company will implement new policies next month.", exampleJp: "会社は来月新しい方針を実施します。", level: "intermediate" },
  { id: "v012", word: "acquire", meaning: "獲得する、買収する", partOfSpeech: "動詞", example: "Our company acquired a smaller competitor.", exampleJp: "当社は小規模な競合他社を買収しました。", level: "intermediate" },
  { id: "v013", word: "revenue", meaning: "収益、収入", partOfSpeech: "名詞", example: "Total revenue increased by 20% this year.", exampleJp: "今年の総収益は20%増加しました。", level: "intermediate" },
  { id: "v014", word: "comprehensive", meaning: "総合的な、包括的な", partOfSpeech: "形容詞", example: "We offer comprehensive insurance coverage.", exampleJp: "総合的な保険補償を提供しています。", level: "intermediate" },
  { id: "v015", word: "facilitate", meaning: "促進する、容易にする", partOfSpeech: "動詞", example: "The new system facilitates communication between teams.", exampleJp: "新システムはチーム間のコミュニケーションを促進します。", level: "intermediate" },
  { id: "v016", word: "anticipate", meaning: "予期する、予想する", partOfSpeech: "動詞", example: "We anticipate strong sales this quarter.", exampleJp: "今四半期の好調な売上を予想しています。", level: "intermediate" },
  { id: "v017", word: "subsequent", meaning: "後続の、その後の", partOfSpeech: "形容詞", example: "Subsequent meetings will be held weekly.", exampleJp: "その後の会議は毎週開催されます。", level: "intermediate" },
  { id: "v018", word: "allocate", meaning: "割り当てる、配分する", partOfSpeech: "動詞", example: "Funds will be allocated to each department.", exampleJp: "資金は各部門に配分されます。", level: "intermediate" },
  { id: "v019", word: "compensate", meaning: "補償する、埋め合わせる", partOfSpeech: "動詞", example: "We will compensate you for any inconvenience.", exampleJp: "ご不便をおかけしたことを補償いたします。", level: "intermediate" },
  { id: "v020", word: "disclose", meaning: "開示する、公開する", partOfSpeech: "動詞", example: "We cannot disclose confidential information.", exampleJp: "機密情報を開示することはできません。", level: "intermediate" },
  { id: "v021", word: "endorse", meaning: "支持する、推薦する", partOfSpeech: "動詞", example: "The celebrity endorsed our new product.", exampleJp: "その有名人は当社の新製品を推薦しました。", level: "intermediate" },
  { id: "v022", word: "tentative", meaning: "暫定的な、仮の", partOfSpeech: "形容詞", example: "We have a tentative agreement on the terms.", exampleJp: "条件について暫定合意しています。", level: "intermediate" },

  // Advanced - TOEIC 750-900
  { id: "v023", word: "contingent", meaning: "~次第の、依存する", partOfSpeech: "形容詞", example: "The deal is contingent upon board approval.", exampleJp: "その取引は取締役会の承認次第です。", level: "advanced" },
  { id: "v024", word: "discrepancy", meaning: "相違、矛盾", partOfSpeech: "名詞", example: "There is a discrepancy in the financial reports.", exampleJp: "財務報告書に矛盾があります。", level: "advanced" },
  { id: "v025", word: "diligent", meaning: "勤勉な、熱心な", partOfSpeech: "形容詞", example: "She is known as a diligent worker.", exampleJp: "彼女は勤勉な労働者として知られています。", level: "advanced" },
  { id: "v026", word: "feasible", meaning: "実現可能な", partOfSpeech: "形容詞", example: "Is this project feasible within the budget?", exampleJp: "このプロジェクトは予算内で実現可能ですか?", level: "advanced" },
  { id: "v027", word: "incentive", meaning: "動機、報奨", partOfSpeech: "名詞", example: "Bonuses serve as an incentive for high performance.", exampleJp: "ボーナスは高業績への動機付けとなります。", level: "advanced" },
  { id: "v028", word: "mandatory", meaning: "必須の、義務的な", partOfSpeech: "形容詞", example: "Attendance at the training is mandatory.", exampleJp: "研修への出席は必須です。", level: "advanced" },
  { id: "v029", word: "preliminary", meaning: "予備の、暫定的な", partOfSpeech: "形容詞", example: "These are the preliminary results of the survey.", exampleJp: "これは調査の予備結果です。", level: "advanced" },
  { id: "v030", word: "proficient", meaning: "熟練した、堪能な", partOfSpeech: "形容詞", example: "He is proficient in three languages.", exampleJp: "彼は3か国語に堪能です。", level: "advanced" },
  { id: "v031", word: "reimburse", meaning: "払い戻す、返済する", partOfSpeech: "動詞", example: "The company will reimburse your travel expenses.", exampleJp: "会社が出張費を払い戻します。", level: "advanced" },
  { id: "v032", word: "stipulate", meaning: "規定する、明記する", partOfSpeech: "動詞", example: "The contract stipulates a one-year warranty.", exampleJp: "契約は1年保証を規定しています。", level: "advanced" },
  { id: "v033", word: "vigilant", meaning: "用心深い、警戒している", partOfSpeech: "形容詞", example: "We must be vigilant against cyber attacks.", exampleJp: "サイバー攻撃に警戒する必要があります。", level: "advanced" },
  { id: "v034", word: "preclude", meaning: "妨げる、排除する", partOfSpeech: "動詞", example: "Bad weather precluded outdoor activities.", exampleJp: "悪天候により屋外活動が中止になりました。", level: "advanced" },
  { id: "v035", word: "lucrative", meaning: "儲かる、利益の多い", partOfSpeech: "形容詞", example: "Real estate can be a lucrative business.", exampleJp: "不動産は儲かるビジネスになり得ます。", level: "advanced" },
  { id: "v036", word: "redundant", meaning: "余剰の、冗長な", partOfSpeech: "形容詞", example: "Some positions became redundant after the merger.", exampleJp: "合併後、いくつかの役職が余剰となりました。", level: "advanced" },
];

export function getVocabByLevel(level: string): VocabWord[] {
  return vocabulary.filter((v) => v.level === level);
}

export function getVocabById(id: string): VocabWord | undefined {
  return vocabulary.find((v) => v.id === id);
}
