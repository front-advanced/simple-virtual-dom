import { Patches, Patch, Move } from './diff';

export function patch(node: Node, patches: Patches): void {
  const walker = { index: 0 };
  dfsWalk(node, walker, patches);
}

function dfsWalk(node: Node, walker: { index: number }, patches: Patches): void {
  const currentPatches = patches[walker.index];

  const len = node.childNodes ? node.childNodes.length : 0;
  for (let i = 0; i < len; i++) {
    const child = node.childNodes[i];
    walker.index++;
    dfsWalk(child, walker, patches);
  }

  if (currentPatches) {
    applyPatches(node, currentPatches);
  }
}

function applyPatches(node: Node, currentPatches: Patch[]): void {
  currentPatches.forEach((patch) => {
    switch (patch.type) {
      case 'REPLACE':
        const newNode =
          typeof patch.node === "string"
            ? document.createTextNode(patch.node)
            : (patch.node as { render: () => Node }).render();
        node.parentNode!.replaceChild(newNode, node);
        break;
      case 'REORDER':
        reorderChildren(node as unknown as Element, patch.moves!);
        break;
      case 'PROPS':
        setProps(node as Element, patch.props!);
        break;
      case 'TEXT':
        node.textContent = patch.content!;
        break;
    }
  });
}

function reorderChildren(node: Element, moves: Move[]): void {
  const staticNodeList = Array.from(node.childNodes);
  const maps: { [key: string]: Node } = {};

  staticNodeList.forEach((node) => {
    if (node.nodeType === 1) {
      const key = (node as Element).getAttribute("key");
      if (key) {
        maps[key] = node;
      }
    }
  });

  moves.forEach((move) => {
    const index = move.index;
    if (move.type === 0) {
      // remove item
      if (staticNodeList[index] === node.childNodes[index]) {
        // maybe have been removed for inserting
        node.removeChild(node.childNodes[index]);
      }
      staticNodeList.splice(index, 1);
    } else if (move.type === 1) {
      // insert item
      let insertNode: Node;
      if(!move.item) {
        return;
      }
      if (typeof move.item === "string") {
        insertNode = document.createTextNode(move.item);
      } else if ("key" in move.item && maps[move.item.key]) {
        insertNode = maps[move.item.key].cloneNode(true); // reuse old item
      } else {
        insertNode = (move.item as { render: () => Node }).render();
      }
      staticNodeList.splice(index, 0, insertNode as ChildNode);
      node.insertBefore(insertNode, node.childNodes[index] || null);
    }
  });
}

function setProps(node: Element, props: Record<string, any>): void {
  for (const [key, value] of Object.entries(props)) {
    if (key === 'style' && typeof value === 'object') {
      Object.assign((node as HTMLElement).style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.slice(2).toLowerCase();
      (node as HTMLElement).addEventListener(eventName, value);
    } else if (value === undefined) {
      node.removeAttribute(key);
    } else {
      node.setAttribute(key, value.toString());
    }
  }
}