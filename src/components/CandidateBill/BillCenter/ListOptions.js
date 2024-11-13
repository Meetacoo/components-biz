import { createWithRemoteLoader } from '@kne/remote-loader';
import { useMemo, useRef, useState } from 'react';
import { App, Flex, Space } from 'antd';
import get from 'lodash/get';
import getButtonList from '../getButtonList';

const ListOptions = createWithRemoteLoader({
  modules: [
    'components-core:Filter',
    'components-core:Global@usePreset',
    'components-core:StateBar',
    'components-core:Enum',
    'components-core:Permissions@usePermissionsPass'
  ]
})(({ remoteModules, topOptionsChildren, children }) => {
  const [Filter, usePreset, StateBar, Enum, usePermissionsPass] = remoteModules;
  const ref = useRef(null);
  const { apis, ajax } = usePreset();
  const { message } = App.useApp();
  const { SearchInput, getFilterValue, fields: filterFields } = Filter;
  const { AdvancedSelectFilterItem, UserFilterItem } = filterFields;

  const [filter, setFilter] = useState([]);
  const hasBillEditAuth = usePermissionsPass({ request: ['bill:apply:edit'] });
  const hasBillExportAuth = usePermissionsPass({ request: ['bill:apply:export_notice'] });

  const filterValue = useMemo(() => getFilterValue(filter), [filter]);

  return (
    <Enum moduleName={['BILL_STATE_ENUM', 'invoiceProjectType']}>
      {([billStateEnum, invoiceProjectType]) => {
        const stateOption = [{ tab: '全部', key: 'all' }, ...billStateEnum.map(({ value, description }) => ({ tab: description, key: value }))];
        return children({
          ref,
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
          topOptions: (
            <Space>
              <Flex>
                <SearchInput name="cvName" label="候选人姓名" />
              </Flex>
              {topOptionsChildren ? topOptionsChildren({ ref }) : null}
            </Space>
          ),
          topArea: (
            <StateBar
              type="radio"
              size="small"
              activeKey={get(filterValue, 'state') || 'all'}
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
          ),
          optionsColumn: {
            name: 'options',
            title: '操作',
            type: 'options',
            fixed: 'right',
            valueOf: bill =>
              getButtonList({
                bill,
                hasBillEditAuth,
                hasBillExportAuth,
                ajax,
                apis,
                onSuccess: ref?.current?.reload,
                message
              })
          }
        });
      }}
    </Enum>
  );
});

export default ListOptions;
