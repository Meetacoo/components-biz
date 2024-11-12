import { createWithRemoteLoader } from '@kne/remote-loader';
import BillCenterDetail from './BillCenterDetail';
import RightOptions from './RightOptions';
import { Space } from 'antd';
import get from 'lodash/get';

const BillCenterDetailPage = createWithRemoteLoader({
  modules: ['components-core:Layout@Page', 'components-core:Enum', 'components-core:StateTag', 'components-view:PageHeader']
})(({ remoteModules, ...props }) => {
  const [Page, Enum, StateTag, PageHeader] = remoteModules;
  return (
    <BillCenterDetail>
      {({ data, reload, content }) => {
        return (
          <Page
            {...props}
            header={
              <PageHeader
                title={'账单详情'}
                info={
                  <Space size={[24, 8]}>
                    <span>{get(data, 'bill.serialNumber')}</span>
                  </Space>
                }
                buttonOptionsMaxWidth="220px"
                buttonOptions={{
                  list: []
                }}
                tags={[
                  <Enum moduleName="BILL_STATE_ENUM" name={get(data, 'bill.state')}>
                    {({ type, description }) => <StateTag type={type} text={description} />}
                  </Enum>
                ]}
              />
            }
            option={
              [2, 3, 4, 5].indexOf(get(data, 'bill.state')) > -1 && (
                <RightOptions data={get(data, 'bill')} records={get(data, 'bill.billCheckRecords')} onReload={reload} />
              )
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
