import { Fragment, type ReactNode } from "react";
import { GlossaryTerm } from "./Glossary";
import { glossary } from "../data/glossary";

type Mapping = { pattern: RegExp; termId: keyof typeof glossary };

const mappings: Mapping[] = [
  { pattern: /\bEVA\b/, termId: "eva" },
  { pattern: /allure fondamentale/i, termId: "allure-fondamentale" },
  { pattern: /\bD\+/, termId: "d-plus" },
];

/**
 * Replaces the FIRST occurrence of any known glossary term in `text`
 * with a `<GlossaryTerm>` tooltip. Other occurrences are left as-is to
 * avoid cluttering long bullets with multiple chips.
 */
export function withInlineGlossary(text: string): ReactNode {
  for (const m of mappings) {
    const match = m.pattern.exec(text);
    if (!match) continue;
    const start = match.index;
    const end = start + match[0].length;
    return (
      <Fragment>
        {text.slice(0, start)}
        <GlossaryTerm termId={m.termId}>{match[0]}</GlossaryTerm>
        {text.slice(end)}
      </Fragment>
    );
  }
  return text;
}
