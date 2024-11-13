import { createWithRemoteLoader } from '@kne/remote-loader';
import BillCenterDetail from './BillCenterDetail';
import RightOptions from './RightOptions';
import { App, Space } from 'antd';
import get from 'lodash/get';
import getButtonList from '../getButtonList';

const BillCenterDetailPage = createWithRemoteLoader({
  modules: [
    'components-core:Layout@Page',
    'components-core:Global@usePreset',
    'components-core:Enum',
    'components-core:StateTag',
    'components-view:PageHeader',
    'components-core:Permissions@usePermissionsPass'
  ]
})(({ remoteModules, ...props }) => {
  const [Page, usePreset, Enum, StateTag, PageHeader, usePermissionsPass] = remoteModules;
  const { apis, ajax } = usePreset();
  const { message } = App.useApp();

  const hasBillEditAuth = usePermissionsPass({ request: ['bill:apply:edit'] });
  const hasBillExportAuth = usePermissionsPass({ request: ['bill:apply:export_notice'] });

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
                  list: getButtonList({
                    bill: get(data, 'bill'),
                    hasBillEditAuth,
                    hasBillExportAuth,
                    ajax,
                    apis,
                    onSuccess: reload,
                    message
                  })
                }}
                tags={[
                  <Enum moduleName="BILL_STATE_ENUM" name={get(data, 'bill.state')}>
                    {({ type, description }) => <StateTag type={type} text={description} />}
                  </Enum>
                ]}
              />
            }
            option={
              [2, 3, 4, 5].indexOf(get(data, 'bill.state')) > -1 &&
              get(data, 'bill.billCheckRecords.length') && (
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
