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
          <Page
            {...props}
            option={
              [2, 3, 4, 5].indexOf(data.bill?.state) > -1 && <RightOptions data={data.bill} records={data.billCheckRecords} onReload={reload} />
            }
          >
            {content}
          </Page>
        );
      }}
    </BillCenterDetail>
  );
});

export default BillCenterDetailPage;
