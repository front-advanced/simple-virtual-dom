import { createElement } from "./createElement";
import { diff } from "./diff";
import { Element } from "./element";
import { patch } from "./patch";

// 1. Create initial virtual DOM tree
const tree = createElement("div", { id: "container" }, 
  createElement("h1", { style: "color: blue" }, "Simple Virtual DOM"),
  createElement("p", null, "Hello, virtual-dom"),
  createElement("ul", null, 
    createElement("li")
  )
);

// 2. Generate a real DOM from virtual DOM
const root = (tree as Element).render();
const domRoot = document.getElementById("app") as HTMLDivElement;
domRoot.appendChild(root);

// Wait for 2 seconds before updating
setTimeout(() => {
  // 3. Generate another different virtual DOM tree
  const newTree = createElement("div", { id: "container" }, 
    createElement("h1", { style: "color: red" }, "Simple Virtual DOM"),
    createElement("p", null, "Hello, virtual-dom"),
    createElement("ul", null, 
      createElement("li", null, "Patch 1"),
      createElement("li", null, "Patch 2")
    )
  );

  // 4. Diff two virtual DOM trees and get patches
  const patches = diff(tree as Element, newTree as Element);

  // 5. Apply patches to real DOM
  patch(root, patches);
}, 2000);