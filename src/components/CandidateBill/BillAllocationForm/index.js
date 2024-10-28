import { createWithRemoteLoader } from '@kne/remote-loader';
import { get } from 'lodash';
import { useMemo } from 'react';
import { billTransform } from '../index';

const BillAllocationForm = createWithRemoteLoader({
  modules: ['components-core:FormInfo', 'components-core:Global@usePreset', 'components-core:StateTag']
})(({ remoteModules, record }) => {
  const [FormInfo, usePreset, StateTag] = remoteModules;
  const { TableList } = FormInfo;
  const { Input, MoneyInput, SuperSelectUser } = FormInfo.fields;
  const { apis } = usePreset();

  const userMap = useMemo(() => new Map((get(record, 'userInfos') || []).map(item => [item.uid, item])), [record]);
  return (
    <TableList
      title="业绩分配"
      name="allocations"
      list={(groupArgs, { index: allocationIndex }, { formData }) => {
        return [
          <SuperSelectUser
            name="uid"
            label="分配用户"
            isPopup={false}
            rule="REQ"
            single
            labelWrap={false}
            api={apis.user.getUserList}
            getSearchProps={({ searchText }) => ({ userName: searchText })}
            dataFormat={({ pageData = [], totalCount }) => {
              const currentUid = get(formData, `allocations[${allocationIndex}].uid`);
              const selectedUids = (formData.allocations || []).filter(x => x.uid && x.uid.value !== currentUid).map(item => item.uid.value);
              return {
                list: pageData.map(item => ({
                  ...item,
                  label: billTransform.getUserName({ userMap, user: item }),
                  value: get(item, 'uid'),
                  disabled: selectedUids.some(x => x === get(item, 'uid')),
                  description: item?.state === 1 ? <StateTag text="账号已关闭" /> : null
                })),
                total: totalCount
              };
            }}
          />,
          <MoneyInput name="amount" label="分配金额" rule="REQ" />,
          <Input name="amountPercent" label="分配比例" rule="REQ" />
        ];
      }}
    />
  );
});

export default BillAllocationForm;
