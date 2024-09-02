export class Element {
  tagName: string;
  props: Record<string, any>;
  children: (Element | string)[];
  key: string | undefined;
  count: number;

  constructor(tagName: string, props: Record<string, any>, children: (Element | string)[]) {
    this.tagName = tagName;
    this.props = props || {};
    this.children = children || [];
    this.key = props.key;
    
    let count = 0;
    this.children.forEach((child) => {
      if (child instanceof Element) {
        count += child.count;
      }
      count++;
    });
    this.count = count;
  }

  render(): HTMLElement {
    const el = document.createElement(this.tagName);
    
    // Set properties
    for (const [key, value] of Object.entries(this.props)) {
      if (key !== 'key') {
        el.setAttribute(key, value);
      }
    }
    
    // Append children
    this.children.forEach((child) => {
      const childEl = child instanceof Element
        ? child.render()
        : document.createTextNode(child as string);
      el.appendChild(childEl);
    });
    
    return el;
  }
}