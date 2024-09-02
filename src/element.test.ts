import { describe, it, expect, beforeEach } from 'vitest';
import { Element } from './element';
import { createElement } from './createElement';

describe('Element', () => {
  let root: Element;
  
  beforeEach(() => {
    root = createElement('div', { id: 'root' },
      createElement('span', { className: 'greeting' }, 'Hello'),
      createElement('ul', null,
        createElement('li', null, 'Item 1'),
        createElement('li', null, 'Item 2')
      )
    );
  });

  it('should create an instance with correct properties', () => {
    expect(root).toBeInstanceOf(Element);
    expect(root.tagName).toBe('div');
    expect(root.props.id).toBe('root');
    expect(root.children).toHaveLength(2);
    expect(root.key).toBeUndefined();
    expect(root.count).toBe(7);
  });

  it('should create an instance with a key', () => {
    const el = createElement('div', { key: 'test-key' });
    expect(el.key).toBe('test-key');
  });

  it('should render to an HTMLElement', () => {
    const rendered = root.render();
    expect(rendered).toBeInstanceOf(HTMLElement);
    expect(rendered.tagName).toBe('DIV');
    expect(rendered.id).toBe('root');
    expect(rendered.children).toHaveLength(2);
    
    const [span, ul] = rendered.children;
    expect(span.tagName).toBe('SPAN');
    expect(span.className).toBe('greeting');
    expect(span.textContent).toBe('Hello');
    
    expect(ul.tagName).toBe('UL');
    expect(ul.children).toHaveLength(2);
    expect(ul.children[0].tagName).toBe('LI');
    expect(ul.children[0].textContent).toBe('Item 1');
    expect(ul.children[1].tagName).toBe('LI');
    expect(ul.children[1].textContent).toBe('Item 2');
  });

  it('should handle style objects', () => {
    const el = createElement('div', { style: { color: 'red', fontSize: '14px' } });
    const rendered = el.render();
    expect(rendered.style.color).toBe('red');
    expect(rendered.style.fontSize).toBe('14px');
  });
});