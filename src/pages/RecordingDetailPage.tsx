import type { JSX } from 'preact';
import { RecordingDetailContainer } from '../components/recording-detail/containers/RecordingDetail.container';

interface RecordingDetailPageProps {
  id: string;
}

export const RecordingDetailPage = ({ id }: RecordingDetailPageProps): JSX.Element => (
  <RecordingDetailContainer id={id} />
);
