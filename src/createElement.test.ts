import { describe, it, expect } from 'vitest';
import { createElement } from './createElement';
import { Element } from './element';

describe('createElement', () => {
  it('should create a simple element', () => {
    const el = createElement('div');
    expect(el).toBeInstanceOf(Element);
    expect(el.tagName).toBe('div');
    expect(el.props).toEqual({});
    expect(el.children).toEqual([]);
  });

  it('should create an element with props', () => {
    const el = createElement('div', { id: 'test', class: 'container' });
    expect(el.props).toEqual({ id: 'test', class: 'container' });
  });

  it('should create an element with children', () => {
    const el = createElement('ul', null,
      createElement('li', null, 'Item 1'),
      createElement('li', null, 'Item 2')
    );
    expect(el.children).toHaveLength(2);
    expect(el.children[0]).toBeInstanceOf(Element);
    expect(el.children[1]).toBeInstanceOf(Element);
    expect((el.children[0] as Element).children[0]).toBe('Item 1');
    expect((el.children[1] as Element).children[0]).toBe('Item 2');
  });

  it('should handle string children', () => {
    const el = createElement('p', null, 'Hello, ', 'World!');
    expect(el.children).toEqual(['Hello, ', 'World!']);
  });

  it('should handle mixed children types', () => {
    const el = createElement('div', null,
      'Text node',
      createElement('span', null, 'Span text')
    );
    expect(el.children).toHaveLength(2);
    expect(el.children[0]).toBe('Text node');
    expect(el.children[1]).toBeInstanceOf(Element);
  });

  it('should handle children passed as an array in second argument', () => {
    const children = [
      createElement('li', null, 'Item 1'),
      createElement('li', null, 'Item 2')
    ];
    const el = createElement('ul', children);
    expect(el.children).toHaveLength(2);
    expect(el.children[0]).toBeInstanceOf(Element);
    expect(el.children[1]).toBeInstanceOf(Element);
  });
});