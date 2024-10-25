import { createWithRemoteLoader } from '@kne/remote-loader';
import getColumns from './getColumns';
import { useRef, useState } from 'react';
import { Space } from 'antd';
import get from 'lodash/get';
import { EditBillButton } from '../GenerateBill';

const BillCenter = createWithRemoteLoader({
  modules: [
    'components-core:Layout@TablePage',
    'components-core:Filter',
    'components-core:Global@usePreset',
    'components-core:StateBar',
    'components-core:Enum',
    'components-core:InfoPage@formatView'
  ]
})(({ remoteModules }) => {
  const [TablePage, Filter, usePreset, StateBar, Enum, formatView] = remoteModules;
  const { apis } = usePreset();
  const { SearchInput, getFilterValue, fields: filterFields } = Filter;
  const { AdvancedSelectFilterItem, UserFilterItem } = filterFields;
  const ref = useRef(null);
  const [filter, setFilter] = useState([]);
  const filterValue = getFilterValue(filter);

  return (
    <Enum moduleName={['BILL_STATE_ENUM', 'invoiceProjectType']}>
      {([billStateEnum, invoiceProjectType]) => {
        const stateOption = [{ tab: '全部', key: 'all' }, ...billStateEnum.map(({ value, description }) => ({ tab: description, key: value }))];
        return (
          <TablePage
            ref={ref}
            {...apis.candidateBill.getBillList}
            data={filterValue}
            name="candidateBillCenter"
            topArea={
              <StateBar
                type="radio"
                size="small"
                stateOption={stateOption}
                onChange={val => {
                  const _val =
                    val === 'all'
                      ? null
                      : {
                          value: val,
                          label: get(
                            stateOption.find(x => x.key === val),
                            'tab'
                          )
                        };
                  setFilter([
                    ...filter.filter(item => item?.name !== 'state'),
                    {
                      name: 'state',
                      label: '状态',
                      value: _val
                    }
                  ]);
                }}
              />
            }
            page={{
              filter: {
                value: filter,
                onChange: setFilter,
                list: [
                  [
                    <AdvancedSelectFilterItem
                      name="typeIds"
                      label="账单类目"
                      api={{
                        loader: () => {
                          const pageData = invoiceProjectType.map(({ value, description }) => ({ value, label: description }));
                          return {
                            pageData: pageData,
                            totalCount: pageData.length
                          };
                        }
                      }}
                      isPopup
                    />,
                    <UserFilterItem
                      name="addIds"
                      label="添加人"
                      api={apis.user.getUserList}
                      getSearchProps={value => ({ data: { userName: value } })}
                      dataFormat={({ pageData = [], totalCount }) => {
                        return {
                          list: pageData.map(item => ({
                            ...item,
                            label: `${get(item, 'englishName', '')} ${get(item, 'name', '')} ${get(item, 'orgName') ? ' - ' + get(item, 'orgName') : ''}`,
                            value: get(item, 'uid')
                          })),
                          total: totalCount
                        };
                      }}
                      isPopup
                    />
                  ]
                ]
              },
              titleExtra: (
                <Space align="center">
                  <SearchInput name="cvName" label="候选人姓名" />
                </Space>
              )
            }}
            columns={[
              ...getColumns({ formatView }),
              {
                name: 'options',
                title: '操作',
                type: 'options',
                fixed: 'right',
                valueOf: ({}) => {
                  return [
                    {
                      buttonComponent: EditBillButton,
                      children: '编辑账单',
                      modalProps: {}
                    },
                    {
                      children: '前往结算中心'
                    },
                    {
                      children: '下载账单',
                      disabled: true
                    }
                  ];
                }
              }
            ]}
            transformData={data => {
              return Object.assign({}, data, {
                userMap: new Map((data?.userInfos || []).map(item => [item.uid, item]))
              });
            }}
          />
        );
      }}
    </Enum>
  );
});

export default BillCenter;
