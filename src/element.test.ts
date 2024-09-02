import { describe, it, expect } from 'vitest';
import { Element } from './element';

describe('Element', () => {
  it('should create an instance', () => {
    const el = new Element('div', { id: 'test' }, []);
    expect(el).toBeInstanceOf(Element);
    expect(el.tagName).toBe('div');
    expect(el.props.id).toBe('test');
    expect(el.children).toEqual([]);
  });
});