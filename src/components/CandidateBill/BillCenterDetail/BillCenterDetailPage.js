import { createWithRemoteLoader } from '@kne/remote-loader';
import BillCenterDetail from './BillCenterDetail';
import RightOptions from './RightOptions';

const BillCenterDetailPage = createWithRemoteLoader({
  modules: ['components-core:Layout@Page']
})(({ remoteModules, ...props }) => {
  const [Page] = remoteModules;

  return (
    <BillCenterDetail>
      {({ data, reload, content }) => {
        return (
          <Page {...props} option={<RightOptions data={data} onSuccess={reload} />}>
            {content}
          </Page>
        );
      }}
    </BillCenterDetail>
  );
});

export default BillCenterDetailPage;
