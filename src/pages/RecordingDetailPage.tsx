import { IconArrowLeft } from '@tabler/icons-react';
import type { JSX } from 'preact';
import { Link } from 'wouter-preact';
import { PageHeader } from '../components/shared/ui/PageHeader.view';

interface RecordingDetailPageProps {
  id: string;
}

export const RecordingDetailPage = ({ id }: RecordingDetailPageProps): JSX.Element => (
  <div class='mx-auto flex max-w-5xl flex-col gap-6 px-8 py-8'>
    <Link class='inline-flex items-center gap-1.5 text-ink-2 text-sm hover:text-ink' to='/'>
      <IconArrowLeft aria-hidden='true' size={14} stroke={1.75} />
      Library
    </Link>
    <PageHeader subtitle={id} title='Recording' />
  </div>
);
