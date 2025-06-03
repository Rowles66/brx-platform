import { Suspense } from 'react';
import { Layout } from '@/components/layout';
import { Program } from '@/components/programs/Program';

interface Props {
  params: { id: string };
}

function ProgramDetailsPage(props: Props) {
  return (
    <Layout>
      <Suspense fallback={<div className="p-6">Loading program...</div>}>
        <Program id={props.params.id} />
      </Suspense>
    </Layout>
  );
}

export default ProgramDetailsPage;
