export class Element {
  tagName: string;
  props: Record<string, any>;
  children: Element[];

  constructor(tagName: string, props: Record<string, any>, children: Element[]) {
    this.tagName = tagName;
    this.props = props;
    this.children = children;
  }
}
