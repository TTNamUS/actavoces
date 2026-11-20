import { IconExternalLink } from '@tabler/icons-react';
import type { JSX } from 'preact';
import { SectionTitle } from '../../shared/ui/SectionTitle.view';
import type { RecordingDetailModel } from '../hooks/useRecordingDetail.hook';

interface FilesPanelProps {
  detail: RecordingDetailModel;
}

export const FilesPanel = ({ detail }: FilesPanelProps): JSX.Element | null =>
  detail.data.files.length === 0 ? null : (
    <section class='flex flex-col gap-3'>
      <SectionTitle>Files</SectionTitle>
      <ul class='flex flex-col gap-1'>
        {detail.data.files.map((file) => (
          <li key={file.path}>
            <button
              class='focus-ring flex w-full items-center justify-between gap-2 rounded-md px-2 py-1 text-left text-[13px] hover:bg-canvas-2'
              onClick={file.onOpen}
              type='button'
            >
              <span class='truncate'>{file.label}</span>
              <IconExternalLink
                aria-hidden='true'
                className='shrink-0 text-ink-3'
                size={14}
                stroke={1.75}
              />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
