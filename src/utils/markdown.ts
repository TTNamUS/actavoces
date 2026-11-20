export type InlineNode =
  | { type: 'text' | 'bold' | 'italic' | 'code'; text: string }
  | { type: 'link'; text: string; href: string }
  | { type: 'timestamp'; text: string; seconds: number };

export type BlockNode =
  | { type: 'heading'; level: 1 | 2 | 3 | 4; inlines: InlineNode[] }
  | { type: 'paragraph'; inlines: InlineNode[] }
  | { type: 'quote'; inlines: InlineNode[] }
  | { type: 'list'; ordered: boolean; items: InlineNode[][] }
  | { type: 'code'; text: string };

const INLINE_PATTERN =
  /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\[(\d{1,2}:\d{2}(?::\d{2})?)\](?!\()/g;

const clockSeconds = (clock: string): number =>
  clock.split(':').reduce((total, part) => total * 60 + Number(part), 0);

const inlineFromMatch = (match: RegExpMatchArray): InlineNode => {
  const [, code, bold, italic, linkText, href, clock] = match;

  if (code !== undefined) {
    return { type: 'code', text: code };
  }

  if (bold !== undefined) {
    return { type: 'bold', text: bold };
  }

  if (italic !== undefined) {
    return { type: 'italic', text: italic };
  }

  if (linkText !== undefined && href !== undefined) {
    return { type: 'link', text: linkText, href };
  }

  return { type: 'timestamp', text: clock ?? '', seconds: clockSeconds(clock ?? '0:00') };
};

export const parseInline = (source: string): InlineNode[] => {
  const nodes: InlineNode[] = [];
  let cursor = 0;

  for (const match of source.matchAll(INLINE_PATTERN)) {
    const index = match.index ?? 0;

    if (index > cursor) {
      nodes.push({ type: 'text', text: source.slice(cursor, index) });
    }

    nodes.push(inlineFromMatch(match));
    cursor = index + match[0].length;
  }

  if (cursor < source.length) {
    nodes.push({ type: 'text', text: source.slice(cursor) });
  }

  return nodes;
};

const HEADING = /^(#{1,4})\s+(.*)$/;
const LIST_ITEM = /^\s*(?:([-*])|(\d+)\.)\s+(.*)$/;
const QUOTE = /^>\s?(.*)$/;

const isBlockStart = (line: string): boolean =>
  line.trim() === '' ||
  line.startsWith('```') ||
  HEADING.test(line) ||
  LIST_ITEM.test(line) ||
  QUOTE.test(line);

export const parseMarkdown = (source: string): BlockNode[] => {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: BlockNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line.trim() === '') {
      index += 1;
      continue;
    }

    if (line.startsWith('```')) {
      const code: string[] = [];

      index += 1;
      while (index < lines.length && !lines[index].startsWith('```')) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push({ type: 'code', text: code.join('\n') });
      continue;
    }

    const heading = HEADING.exec(line);

    if (heading) {
      blocks.push({
        type: 'heading',
        level: heading[1].length as 1 | 2 | 3 | 4,
        inlines: parseInline(heading[2])
      });
      index += 1;
      continue;
    }

    const quote = QUOTE.exec(line);

    if (quote) {
      blocks.push({ type: 'quote', inlines: parseInline(quote[1]) });
      index += 1;
      continue;
    }

    const first = LIST_ITEM.exec(line);

    if (first) {
      const ordered = first[2] !== undefined;
      const items: InlineNode[][] = [];

      while (index < lines.length) {
        const item = LIST_ITEM.exec(lines[index]);

        if (!item || (item[2] !== undefined) !== ordered) {
          break;
        }

        items.push(parseInline(item[3]));
        index += 1;
      }

      blocks.push({ type: 'list', ordered, items });
      continue;
    }

    const paragraph: string[] = [];

    while (index < lines.length && !isBlockStart(lines[index])) {
      paragraph.push(lines[index].trim());
      index += 1;
    }

    blocks.push({ type: 'paragraph', inlines: parseInline(paragraph.join(' ')) });
  }

  return blocks;
};
