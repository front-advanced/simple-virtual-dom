import { Element } from './element';

export function createElement(
  tagName: string,
  props?: Record<string, any> | null,
  ...children: (Element | string)[]
): Element {
  // If props is null or undefined, initialize it as an empty object
  props = props || {};

  // If children is passed as an array in the second argument, use that
  if (Array.isArray(props)) {
    children = props;
    props = {};
  }

  // Filter out undefined children
  children = children.filter(child => child !== undefined && child !== null);

  return new Element(tagName, props, children);
}