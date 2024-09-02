import { describe, it, expect, beforeEach } from 'vitest';
import { Element } from './element';

describe('Element', () => {
  let root: Element;
  
  beforeEach(() => {
    root = new Element('div', { id: 'root' }, [
      new Element('span', { class: 'greeting' }, ['Hello']),
      new Element('ul', {}, [
        new Element('li', {}, ['Item 1']),
        new Element('li', {}, ['Item 2']),
      ]),
    ]);
  });

  it('should create an instance with correct properties', () => {
    expect(root).toBeInstanceOf(Element);
    expect(root.tagName).toBe('div');
    expect(root.props.id).toBe('root');
    expect(root.children).toHaveLength(2);
    expect(root.key).toBeUndefined();
    console.log('root',root)
    expect(root.count).toBe(7);
  });

  it('should create an instance with a key', () => {
    const el = new Element('div', { key: 'test-key' }, []);
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
});