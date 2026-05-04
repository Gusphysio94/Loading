import type { Tree } from "../types/tree";

/**
 * Number of nodes (inclusive) on the longest path from `fromId` to a recommendation leaf.
 * Tracks visited nodes per-path to handle potential cycles safely.
 */
export function maxDepth(
  tree: Tree,
  fromId: string,
  path: ReadonlySet<string> = new Set(),
): number {
  if (path.has(fromId)) return 0;
  const node = tree.nodes[fromId];
  if (!node) return 0;
  if (node.kind === "recommendation") return 1;

  const newPath = new Set(path);
  newPath.add(fromId);

  const nextIds: string[] =
    node.kind === "eva"
      ? [node.belowOrEqual.next, node.above.next]
      : node.choices.map((c) => c.next);

  if (nextIds.length === 0) return 1;
  let best = 0;
  for (const id of nextIds) {
    const d = maxDepth(tree, id, newPath);
    if (d > best) best = d;
  }
  return 1 + best;
}
