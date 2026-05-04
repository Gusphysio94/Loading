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
  followUp?: string;
  /** Optional badge such as a "temporal jump" warning. */
  temporalNote?: string;
  choices: Choice[];
};

export type RelatedContent = {
  title: string;
  url: string;
};

export type RecommendationNode = BaseNode & {
  kind: "recommendation";
  severity: Severity;
  message: string;
  cta?: string;
  relatedContent?: RelatedContent[];
};

export type DecisionNode =
  | QuestionNode
  | ModulationNode
  | RecommendationNode
  | EVANode;

export type Tree = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  startId: string;
  nodes: Record<string, DecisionNode>;
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
