export type Severity = "success" | "warning" | "danger" | "neutral";

export type Choice = {
  label: string;
  next: string;
  variant?: "yes" | "no" | "neutral";
};

export type BaseNode = {
  id: string;
  title: string;
  subtitle?: string;
  hint?: string;
  /** Short label used in the answer recap. Falls back to title. */
  recap?: string;
};

export type QuestionNode = BaseNode & {
  kind: "question";
  choices: Choice[];
};

export type EVANode = BaseNode & {
  kind: "eva";
  /** Threshold value (exclusive) — value > threshold routes to `above`. */
  threshold: number;
  /** Routing for value <= threshold. */
  belowOrEqual: { next: string };
  /** Routing for value > threshold. */
  above: { next: string };
  minLabel?: string;
  maxLabel?: string;
};

export type ModulationNode = BaseNode & {
  kind: "modulation";
  bullets: string[];
  /** Optional richer bullets when concrete session inputs are provided.
   * Imported lazily where computeBullets is bound (we keep the function
   * reference in the data file). */
  computeBulletsKey?: string;
  followUp?: string;
  /** Optional badge such as a "temporal jump" warning. */
  temporalNote?: string;
  choices: Choice[];
};

export type RelatedContent = {
  title: string;
  url: string;
};

export type BehaviorAdvice = {
  /** What the patient should do until the next session. Imperative phrases. */
  toDo?: string[];
  /** What to avoid. */
  toAvoid?: string[];
  /** Symptoms that should trigger an earlier consultation. */
  alertSigns?: string[];
  /** Free-text self-care note (e.g. analgesic guidance). */
  selfCare?: string;
};

export type RecommendationNode = BaseNode & {
  kind: "recommendation";
  severity: Severity;
  message: string;
  cta?: string;
  relatedContent?: RelatedContent[];
  /** Concrete behavioral guidance for the period until the next session. */
  behavior?: BehaviorAdvice;
  /** A short paragraph the kiné can read or paraphrase to the patient (in "tu"). */
  patientScript?: string;
};

export type DecisionNode =
  | QuestionNode
  | ModulationNode
  | RecommendationNode
  | EVANode;

/**
 * "Moment de décision" du kiné — sert au regroupement visuel de la home.
 * - in-session : pendant ou juste après une séance (le kiné est avec le patient)
 * - between-sessions : entre deux RDV (patient à distance, texte/appel)
 */
export type DecisionPhase = "in-session" | "between-sessions";

export type Tree = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  startId: string;
  nodes: Record<string, DecisionNode>;
  /** When set, the app shows an optional "Inputs séance" screen before the tree starts. */
  inputsSchema?: "exercise" | "running" | "sport";
  /** Used to group the cards on the home screen by clinical decision moment. */
  phase?: DecisionPhase;
};

export type RecapEntry = {
  /** Short label of the question / step. */
  label: string;
  /** Answer chosen — formatted text (e.g. "OUI", "6/10"). */
  answer: string;
  /** Optional list of bullets that were displayed (for modulation nodes). */
  bullets?: string[];
  /** Node kind, useful to format display. */
  kind: "question" | "modulation" | "eva";
};
