import { IconAlertTriangle, IconArrowLeft } from '@tabler/icons-react';
import type { JSX } from 'preact';
import { Card } from '../../shared/ui/Card.view';
import { ConfirmDeleteDialog } from '../../shared/ui/ConfirmDeleteDialog.view';
import { Tabs } from '../../shared/ui/Tabs.view';
import type { RecordingDetailModel } from '../hooks/useRecordingDetail.hook';
import { AudioPlayer } from './AudioPlayer.view';
import { FilesPanel } from './FilesPanel.view';
import { PipelinePanel } from './PipelinePanel.view';
import { RecordingHeader } from './RecordingHeader.view';
import { SpeakerChips } from './SpeakerChips.view';
import { SpeakersPanel } from './SpeakersPanel.view';
import { SummaryView } from './SummaryView.view';
import { TranscriptView } from './TranscriptView.view';

interface RecordingDetailViewProps {
  detail: RecordingDetailModel;
}

const TAB_ITEMS = [
  { value: 'transcript', label: 'Transcript' },
  { value: 'summary', label: 'Summary' },
  { value: 'chat', label: 'Chat', disabled: true, title: 'Coming soon' }
];

const MODE_ITEMS = [
  { value: 'speaker', label: 'Speakers' },
  { value: 'raw', label: 'Raw' }
];

export const RecordingDetailView = ({ detail }: RecordingDetailViewProps): JSX.Element => (
  <div class='mx-auto flex max-w-5xl flex-col gap-6 px-8 py-6'>
    <button
      class='focus-ring inline-flex w-fit items-center gap-1.5 rounded-md text-ink-2 text-sm hover:text-ink'
      onClick={detail.actions.onBack}
      type='button'
    >
      <IconArrowLeft aria-hidden='true' size={14} stroke={1.75} />
      Library
    </button>

    {detail.data.recording === null ? (
      <p class='py-16 text-center text-ink-2'>This recording no longer exists.</p>
    ) : (
      <>
        <RecordingHeader detail={detail} title={detail.data.recording.title} />
        <SpeakerChips detail={detail} />

        {detail.data.recording.captureErrors.map((error) => (
          <p
            class='flex items-center gap-2 rounded-lg bg-amber-soft px-3 py-2 text-[13px]'
            key={`${error.source}-${error.message}`}
          >
            <IconAlertTriangle aria-hidden='true' className='shrink-0' size={16} stroke={1.75} />
            {error.source === 'system' ? 'System audio' : 'Microphone'} not captured:{' '}
            {error.message}
          </p>
        ))}

        <div class='grid grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] items-start gap-8'>
          <Card class='sticky top-6 flex flex-col gap-6 p-5'>
            <AudioPlayer detail={detail} />
            <PipelinePanel detail={detail} />
            <SpeakersPanel detail={detail} />
            <FilesPanel detail={detail} />
          </Card>

          <div class='flex min-w-0 flex-col gap-5'>
            <div class='flex flex-wrap items-center justify-between gap-3'>
              <Tabs
                items={TAB_ITEMS}
                onValueChange={detail.actions.onTab}
                value={detail.data.tab}
              />
              {detail.data.tab === 'transcript' ? (
                <Tabs
                  items={MODE_ITEMS}
                  onValueChange={detail.actions.onMode}
                  value={detail.data.mode}
                />
              ) : null}
            </div>
            {detail.status.contentError === null ? null : (
              <p class='text-ember text-sm'>{detail.status.contentError}</p>
            )}
            {detail.data.tab === 'transcript' ? (
              <TranscriptView detail={detail} />
            ) : (
              <SummaryView detail={detail} />
            )}
          </div>
        </div>
      </>
    )}

    <ConfirmDeleteDialog
      onCancel={detail.actions.onCancelDelete}
      onConfirm={detail.actions.onConfirmDelete}
      title={detail.data.deleteTitle}
    />
  </div>
);
