import type { TriageZone } from "./triage";

/**
 * Évaluation approfondie — aide au raisonnement clinique kinésithérapique.
 *
 * IMPORTANT — cadre légal et déontologique :
 *  - Cet outil est conçu comme une AIDE au raisonnement clinique du kiné.
 *  - Il ne pose pas de diagnostic médical.
 *  - Les hypothèses pathologiques sont des suggestions à confronter à
 *    l'examen clinique du praticien.
 *  - Le diagnostic médical reste de la responsabilité du médecin.
 *  - Les recommandations d'imagerie sont des pistes à discuter avec le
 *    médecin si le kiné estime nécessaire d'orienter le patient.
 *
 * Sources : Décary 2017 (raisonnement diagnostique kiné), Cook 2018,
 *  Sackett (probabilité pré/post-test), recommandations Choosing Wisely,
 *  Ottawa Knee Rules (Stiell 1996), NICE NG226 (genou).
 */

export type AnamnesisCategory =
  | "onset"
  | "mechanism"
  | "character"
  | "modifiers"
  | "history";

export const anamnesisCategoryLabels: Record<AnamnesisCategory, string> = {
  onset: "Apparition",
  mechanism: "Mécanisme",
  character: "Caractère de la douleur",
  modifiers: "Modulateurs",
  history: "Contexte / antécédents",
};

export type AnamnesisChoice = {
  id: string;
  label: string;
  /** Optional short hint shown under the choice. */
  hint?: string;
};

export type AnamnesisQuestion = {
  id: string;
  category: AnamnesisCategory;
  prompt: string;
  /** Indicates if multiple choices can be selected. */
  multi?: boolean;
  choices: AnamnesisChoice[];
  /** How discriminative — used for UI weighting and confidence display. */
  importance?: 1 | 2 | 3;
  /** Optional: question only shown if previous answers match this predicate. */
  showIf?: { questionId: string; valueIn: string[] };
};

export type ClinicalTestResult = "positive" | "negative" | "untested";

export type ClinicalTest = {
  id: string;
  name: string;
  /** Short description of how to perform / interpret. */
  procedure: string;
  /** What a positive sign suggests. */
  positiveMeans: string;
  /** Sensitivity / specificity hint when known. */
  diagnosticAccuracy?: string;
};

export type Prevalence = "common" | "moderate" | "rare";

export const prevalenceLabels: Record<Prevalence, string> = {
  common: "Fréquent",
  moderate: "Modéré",
  rare: "Rare",
};

/**
 * Score weight for a given (question, choice) or (test, result) pair against
 * a pathology. Scale :
 *  +3 très évocateur, +2 évocateur, +1 compatible, 0 neutre,
 *  -1 peu compatible, -2 exclut, -3 incompatible (élimine).
 */
export type SignatureWeight = -3 | -2 | -1 | 0 | 1 | 2 | 3;

/** Per-question signature : choiceId → weight. */
export type QuestionSignature = Record<string, SignatureWeight>;

/** Per-test signature : result ('positive' | 'negative') → weight. */
export type TestSignature = Partial<Record<"positive" | "negative", SignatureWeight>>;

export type ImagingRecommendation = {
  modality: string;
  urgency: "routine" | "soonish" | "urgent" | "rare";
  rationale: string;
};

export type ManagementPlan = {
  /** Conservative care points (kiné first-line). */
  conservative: string[];
  /** When/how to refer if needed. */
  referral?: string;
  /** When imaging would actually change management. */
  imaging?: ImagingRecommendation;
  /** Watch-and-wait / re-evaluation timing. */
  followUp?: string;
};

export type PathologyCandidate = {
  id: string;
  name: string;
  shortName: string;
  prevalence: Prevalence;
  /** Plain-language summary of the entity. */
  summary: string;
  /** Key clinical features — bullet list. */
  hallmarks: string[];
  /** Per-question signature : qId → choiceId → weight. */
  questionSignatures: Record<string, QuestionSignature>;
  /** Per-test signature : testId → testSignature. */
  testSignatures: Record<string, TestSignature>;
  /** Management plan once hypothesis is most likely. */
  management: ManagementPlan;
  /** Optional patient-facing communication script. */
  patientScript?: string;
};

export type DeepAssessmentModule = {
  zone: TriageZone;
  title: string;
  /** Plain-language scope of the module. */
  scope: string;
  questions: AnamnesisQuestion[];
  tests: ClinicalTest[];
  pathologies: PathologyCandidate[];
};

/** Confidence label assigned to the top-ranked hypothesis. */
export type Confidence = "low" | "moderate" | "high";

export const confidenceLabels: Record<Confidence, string> = {
  low: "Faible",
  moderate: "Modérée",
  high: "Forte",
};

export type Ranking = {
  pathologyId: string;
  /** Normalized score in [0,1] across the candidate set. */
  score: number;
  /** Raw weighted sum (for debugging / transparency). */
  rawScore: number;
  /** Top contributing signals : '[catégorie] libellé court'. */
  contributors: string[];
};

export type DeepAssessmentResult = {
  rankings: Ranking[];
  topConfidence: Confidence;
  /** True if no answer/test was provided ⇒ no real signal. */
  insufficientData: boolean;
  /** Heuristic flag : top 2 are within 10% of each other → mention coexistence. */
  ambiguous: boolean;
};

export type DeepAssessmentAnswers = {
  /** questionId → choiceId(s) chosen. */
  questions: Record<string, string[]>;
  /** testId → result. */
  tests: Record<string, ClinicalTestResult>;
};
