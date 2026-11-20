import { IconActivity } from '@tabler/icons-react';
import type { JSX } from 'preact';
import { EmptyState } from '../../shared/ui/EmptyState.view';
import { PageHeader } from '../../shared/ui/PageHeader.view';
import { SectionTitle } from '../../shared/ui/SectionTitle.view';
import type { ActivityModel } from '../hooks/useActivity.hook';
import { CurrentPipelineCard } from './CurrentPipelineCard.view';
import { JobGroupCard } from './JobGroupCard.view';

interface ActivityViewProps {
  activity: ActivityModel;
}

export const ActivityView = ({ activity }: ActivityViewProps): JSX.Element => (
  <div class='mx-auto flex max-w-4xl flex-col gap-8 px-8 py-8'>
    <PageHeader subtitle='Processing starts automatically after capture stops.' title='Activity' />

    {activity.data.current === null ? (
      <EmptyState
        body='Pipeline progress and job history appear here after your first recording.'
        icon={<IconActivity aria-hidden='true' size={22} stroke={1.75} />}
        title='No activity yet'
      />
    ) : (
      <CurrentPipelineCard busy={activity.status.busy} current={activity.data.current} />
    )}

    {activity.data.groups.length === 0 ? null : (
      <section class='flex flex-col gap-3'>
        <SectionTitle>Jobs</SectionTitle>
        {activity.data.groups.map((group) => (
          <JobGroupCard busy={activity.status.busy} group={group} key={group.id} />
        ))}
      </section>
    )}
  </div>
);
