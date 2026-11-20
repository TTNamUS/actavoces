import { describe, expect, it } from 'vitest';
import { parseInline, parseMarkdown } from '../utils/markdown';

describe('parseInline', () => {
  it('parses bold, italic and code spans', () => {
    expect(parseInline('a **b** *c* `d`')).toEqual([
      { type: 'text', text: 'a ' },
      { type: 'bold', text: 'b' },
      { type: 'text', text: ' ' },
      { type: 'italic', text: 'c' },
      { type: 'text', text: ' ' },
      { type: 'code', text: 'd' }
    ]);
  });

  it('turns [mm:ss] into timestamp nodes with seconds', () => {
    expect(parseInline('see [1:05] and [1:02:03]')).toEqual([
      { type: 'text', text: 'see ' },
      { type: 'timestamp', text: '1:05', seconds: 65 },
      { type: 'text', text: ' and ' },
      { type: 'timestamp', text: '1:02:03', seconds: 3723 }
    ]);
  });

  it('only keeps http(s) links and never emits raw html', () => {
    expect(parseInline('[ok](https://example.com)')).toEqual([
      { type: 'link', text: 'ok', href: 'https://example.com' }
    ]);
    expect(parseInline('[bad](javascript:alert(1))')).toEqual([
      { type: 'text', text: '[bad](javascript:alert(1))' }
    ]);
    expect(parseInline('<img src=x onerror=alert(1)>')).toEqual([
      { type: 'text', text: '<img src=x onerror=alert(1)>' }
    ]);
  });
});

describe('parseMarkdown', () => {
  it('parses headings, paragraphs, lists, quotes and fenced code', () => {
    const blocks = parseMarkdown(
      [
        '# Title',
        '',
        'line one',
        'line two',
        '',
        '- a',
        '- b',
        '',
        '1. x',
        '2. y',
        '',
        '> quote',
        '',
        '```',
        'code',
        '```'
      ].join('\n')
    );

    expect(blocks.map((block) => block.type)).toEqual([
      'heading',
      'paragraph',
      'list',
      'list',
      'quote',
      'code'
    ]);
    expect(blocks[0]).toMatchObject({ type: 'heading', level: 1 });
    expect(blocks[1]).toMatchObject({
      type: 'paragraph',
      inlines: [{ type: 'text', text: 'line one line two' }]
    });
    expect(blocks[2]).toMatchObject({ type: 'list', ordered: false });
    expect((blocks[2] as { items: unknown[] }).items).toHaveLength(2);
    expect(blocks[3]).toMatchObject({ type: 'list', ordered: true });
    expect(blocks[5]).toEqual({ type: 'code', text: 'code' });
  });

  it('returns no blocks for empty input', () => {
    expect(parseMarkdown('  \n\n')).toEqual([]);
  });
});
