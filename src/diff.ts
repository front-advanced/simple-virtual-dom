import { Element } from "./element";
import { listDiff } from "./listDiff";

//  Nodes are different, replace the old with the new
const REPLACE = 'REPLACE';
// List REORDER
const REORDER = 'REORDER';
// Props change
const PROPS = 'PROPS';
// Text change
const TEXT = 'TEXT';

interface Move {
  index: number;
  type: number;
  item?: { key: string } | string | { render: () => Node };
}

export interface Patch {
  type: string;
  node?: string | { render: () => Node };
  moves?: Move[];
  props?: { [key: string]: any };
  content?: string;
}

export interface Patches {
  [key: number]: Patch[];
}

export function diff(oldTree: Element, newTree: Element): Patches {
  const patches: Patches = {};
  let index = 0;
  dfsWalk(oldTree, newTree, index, patches);
  return patches;
}

function dfsWalk(
  oldNode: Element | string,
  newNode: Element | string,
  index: number,
  patches: Patches
): number {
  const currentPatch: Patch[] = [];

  if (newNode === null) {
    // Node was removed
    // We'll handle removes in the parent's childrenDiff
  } else if (typeof oldNode === "string" && typeof newNode === "string") {
    if (oldNode !== newNode) {
      currentPatch.push({ type: TEXT, content: newNode });
    }
  } else if (
    oldNode instanceof Element &&
    newNode instanceof Element &&
    oldNode.tagName === newNode.tagName &&
    oldNode.key === newNode.key
  ) {
    // Nodes are the same, diff props and children
    const propsPatches = diffProps(oldNode, newNode);
    if (Object.keys(propsPatches).length > 0) {
      currentPatch.push({ type: PROPS, props: propsPatches });
    }

    // Diff children
    diffChildren(
      oldNode.children,
      newNode.children,
      index,
      patches,
      currentPatch
    );
  } else {
    // Nodes are different, replace the old with the new
    currentPatch.push({ type: REPLACE, node: newNode });
  }

  if (currentPatch.length > 0) {
    patches[index] = currentPatch;
  }

  return index;
}

function diffProps(oldNode: Element, newNode: Element): Record<string, any> {
  const patches: Record<string, any> = {};

  // Set new properties
  for (const [key, value] of Object.entries(newNode.props)) {
    if (oldNode.props[key] !== value) {
      patches[key] = value;
    }
  }

  // Remove properties that are not in the new node
  for (const key in oldNode.props) {
    if (!(key in newNode.props)) {
      patches[key] = undefined;
    }
  }

  return patches;
}

function diffChildren(
  oldChildren: (Element | string)[],
  newChildren: (Element | string)[],
  index: number,
  patches: Patches,
  currentPatch: Patch[]
): void {
  const diffs = listDiff(oldChildren, newChildren, "key");
  if (diffs.moves.length) {
    currentPatch.push({ type: REORDER, moves: diffs.moves });
  }

  let leftNode: Element | string | null = null;
  let currentNodeIndex = index;
  oldChildren.forEach((child, i) => {
    const newChild = newChildren[i];
    currentNodeIndex =
      leftNode && typeof leftNode !== "string" && leftNode.count
        ? currentNodeIndex + leftNode.count + 1
        : currentNodeIndex + 1;
    dfsWalk(child, newChild, currentNodeIndex, patches);
    leftNode = child;
  });
}
