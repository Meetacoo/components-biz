import { createWithRemoteLoader } from '@kne/remote-loader';
import getColumns from './getColumns';
import { Flex, Space } from 'antd';
import { GenerateProjectBillButton } from '../GenerateProjectBill';
import ListOptions from './ListOptions';
import style from './style.module.scss';

const BillCenterTable = createWithRemoteLoader({
  modules: [
    'components-core:Table@TablePage',
    'components-core:Filter',
    'components-core:Global@usePreset',
    'components-core:InfoPage@formatView',
    'components-core:Permissions@usePermissionsPass'
  ]
})(({ remoteModules, inputData, otherFilterProps, hiddenColumns }) => {
  const [TablePage, Filter, usePreset, formatView, usePermissionsPass] = remoteModules;
  const { apis } = usePreset();
  const { getFilterValue } = Filter;
  const hasBillEditAuth = usePermissionsPass({ request: ['bill:apply:edit'] });

  return (
    <ListOptions
      topOptionsChildren={
        hasBillEditAuth
          ? ({ ref }) => (
              <GenerateProjectBillButton type="primary" inputData={inputData} onReload={ref?.current?.reload}>
                新建账单
              </GenerateProjectBillButton>
            )
          : null
      }
    >
      {({ ref, filter, topOptions, topArea, optionsColumn }) => {
        const filterValue = getFilterValue(filter.value);
        return (
          <Flex vertical gap={16} flex={1}>
            <Space className="space-full" style={{ marginTop: '-8px' }} direction="vertical">
              <Filter {...filter} extra={topOptions} className={style['filter']} />
            </Space>
            {topArea}
            <TablePage
              {...apis.candidateBill.getBillList}
              data={Object.assign({}, filterValue, otherFilterProps)}
              ref={ref}
              pagination={{ paramsType: 'params' }}
              columns={[...getColumns({ formatView }).filter(item => (hiddenColumns || []).indexOf(item.name) === -1), optionsColumn]}
              name="setting-user"
              transformData={data => {
                return Object.assign({}, data, {
                  userMap: new Map((data?.userInfos || []).map(item => [item.uid, item]))
                });
              }}
            />
          </Flex>
        );
      }}
    </ListOptions>
  );
});

export default BillCenterTable;
