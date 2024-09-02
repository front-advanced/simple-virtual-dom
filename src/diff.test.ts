import { describe, it, expect } from 'vitest';
import { diff } from './diff';
import { Element } from './element';

describe('diff', () => {
  it('should detect replaced nodes', () => {
    const oldTree = new Element('div', {}, [new Element('span', {}, ['Hello'])]);
    const newTree = new Element('div', {}, [new Element('p', {}, ['Hello'])]);
    const patches = diff(oldTree, newTree);
    expect(patches[1]).toBeDefined();
    expect(patches[1][0].type).toBe('REPLACE');
  });

  it('should detect text changes', () => {
    const oldTree = new Element('div', {}, ['Hello']);
    const newTree = new Element('div', {}, ['World']);
    const patches = diff(oldTree, newTree);
    expect(patches[1]).toBeDefined();
    expect(patches[1][0].type).toBe('TEXT');
    expect(patches[1][0].content).toBe('World');
  });

  it('should detect prop changes', () => {
    const oldTree = new Element('div', { id: 'old', class: 'btn' }, []);
    const newTree = new Element('div', { id: 'new', class: 'btn' }, []);
    const patches = diff(oldTree, newTree);
    expect(patches[0]).toBeDefined();
    expect(patches[0][0].type).toBe('PROPS');
    expect(patches[0][0].props).toEqual({ id: 'new' });
  });

  it('should detect reordered children', () => {
    const oldTree = new Element('ul', {}, [
      new Element('li', { key: 'a' }, ['A']),
      new Element('li', { key: 'b' }, ['B']),
      new Element('li', { key: 'c' }, ['C'])
    ]);
    const newTree = new Element('ul', {}, [
      new Element('li', { key: 'c' }, ['C']),
      new Element('li', { key: 'a' }, ['A']),
      new Element('li', { key: 'b' }, ['B'])
    ]);
    const patches = diff(oldTree, newTree);
    expect(patches[0]).toBeDefined();
    expect(patches[0][0].type).toBe('REORDER');
    expect(patches[0][0].moves).toBeDefined();
    expect(patches[0][0].moves!.length).toBeGreaterThan(0);
  });
});