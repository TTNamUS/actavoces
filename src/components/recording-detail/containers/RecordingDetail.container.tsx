import type { JSX } from 'preact';
import { useRecordingDetail } from '../hooks/useRecordingDetail.hook';
import { RecordingDetailView } from '../ui/RecordingDetail.view';

interface RecordingDetailContainerProps {
  id: string;
}

export const RecordingDetailContainer = ({ id }: RecordingDetailContainerProps): JSX.Element => (
  <RecordingDetailView detail={useRecordingDetail(id)} />
);
