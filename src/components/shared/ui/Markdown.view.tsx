import { clsx } from 'clsx';
import type { JSX } from 'preact';
import type { BlockNode, InlineNode } from '../../../utils/markdown';

interface MarkdownProps {
  blocks: BlockNode[];
  class?: string;
  onSeek?: (seconds: number) => void;
}

interface InlinesProps {
  inlines: InlineNode[];
  onSeek?: (seconds: number) => void;
}

const HEADING_CLASS: Record<number, string> = {
  1: 'font-serif text-[28px] leading-tight',
  2: 'font-serif text-[22px] leading-tight',
  3: 'font-semibold text-[15px]',
  4: 'font-semibold text-sm text-ink-2'
};

const Inlines = ({ inlines, onSeek }: InlinesProps): JSX.Element => (
  <>
    {inlines.map((node, index) => {
      const key = `${node.type}-${index}`;

      if (node.type === 'bold') {
        return (
          <strong class='font-semibold' key={key}>
            {node.text}
          </strong>
        );
      }

      if (node.type === 'italic') {
        return <em key={key}>{node.text}</em>;
      }

      if (node.type === 'code') {
        return (
          <code class='rounded-md bg-canvas-3 px-1 font-mono text-[13px]' key={key}>
            {node.text}
          </code>
        );
      }

      if (node.type === 'link') {
        return (
          <a
            class='text-ember underline underline-offset-2'
            href={node.href}
            key={key}
            rel='noreferrer'
            target='_blank'
          >
            {node.text}
          </a>
        );
      }

      if (node.type === 'timestamp') {
        return (
          <button
            class='focus-ring rounded-md bg-canvas-3 px-1 font-mono text-[12px] tabular-nums hover:bg-ember-soft'
            key={key}
            onClick={() => onSeek?.(node.seconds)}
            type='button'
          >
            {node.text}
          </button>
        );
      }

      return <span key={key}>{node.text}</span>;
    })}
  </>
);

export const Markdown = ({ blocks, class: classProp, onSeek }: MarkdownProps): JSX.Element => (
  <div class={clsx('select-text flex flex-col gap-3 text-[15px] leading-relaxed', classProp)}>
    {blocks.map((block, index) => {
      const key = `${block.type}-${index}`;

      if (block.type === 'heading') {
        return (
          <h3 class={HEADING_CLASS[block.level]} key={key}>
            <Inlines inlines={block.inlines} onSeek={onSeek} />
          </h3>
        );
      }

      if (block.type === 'list') {
        const Tag = block.ordered ? 'ol' : 'ul';

        return (
          <Tag
            class={clsx('flex flex-col gap-1.5 pl-5', block.ordered ? 'list-decimal' : 'list-disc')}
            key={key}
          >
            {block.items.map((item, itemIndex) => (
              <li key={`${key}-${itemIndex}`}>
                <Inlines inlines={item} onSeek={onSeek} />
              </li>
            ))}
          </Tag>
        );
      }

      if (block.type === 'quote') {
        return (
          <blockquote class='border-line-2 border-l-2 pl-3 text-ink-2' key={key}>
            <Inlines inlines={block.inlines} onSeek={onSeek} />
          </blockquote>
        );
      }

      if (block.type === 'code') {
        return (
          <pre class='overflow-x-auto rounded-lg bg-canvas-2 p-3 font-mono text-[13px]' key={key}>
            {block.text}
          </pre>
        );
      }

      return (
        <p key={key}>
          <Inlines inlines={block.inlines} onSeek={onSeek} />
        </p>
      );
    })}
  </div>
);
