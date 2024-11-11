import { createWithRemoteLoader } from '@kne/remote-loader';
import { get } from 'lodash';
import { billTransform } from '../index';

const BillAllocationForm = createWithRemoteLoader({
  modules: ['components-core:FormInfo', 'components-core:Global@usePreset', 'components-core:StateTag', 'components-core:InfoPage@formatView']
})(({ remoteModules, type }) => {
  const [FormInfo, usePreset, StateTag, formatView] = remoteModules;
  const { TableList } = FormInfo;
  const { InputNumber, MoneyInput, SuperSelectUser } = FormInfo.fields;
  const { apis } = usePreset();
  const debounced = (amount, amountPercent, allocationIndex, formData, openApi) => {
    openApi.setFields([
      {
        name: 'amount',
        value: amount,
        groupName: 'allocations',
        groupIndex: allocationIndex,
        runValidate: true
      },
      {
        name: 'amountPercent',
        value: amountPercent,
        groupName: 'allocations',
        groupIndex: allocationIndex,
        runValidate: true
      }
    ]);
    (formData.allocations || []).forEach((item, index) => {
      if (index !== allocationIndex) {
        openApi.setFieldValidate({
          name: 'amount',
          groupName: 'allocations',
          groupIndex: index,
          validate: { status: 1 }
        });
        openApi.setFieldValidate({
          name: 'amountPercent',
          groupName: 'allocations',
          groupIndex: index,
          validate: { status: 1 }
        });
      }
    });
  };

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
              const userMap = new Map((pageData || []).map(item => [item.uid, item]));
              return {
                list: (pageData || []).map(item => ({
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
          <MoneyInput
            name="amount"
            label="分配金额"
            rule={(formData.allocations || []).length - 1 === allocationIndex ? `REQ BILL_ALLOCATIONS_SUMMARY-${type ? 'project' : ''}` : 'REQ'}
            min="0"
            max="20000000"
            precision={2}
            step="0.01"
            addonAfter={'元'}
            onChange={(value, { formData, openApi }) => {
              const totalAmount = type === 1 ? formData.billItems.reduce((prev, cur) => +(prev || 0) + +(cur.amount || 0), 0) : +formData.amount;
              const amountPercent = (value || 0) / (totalAmount || 0);
              debounced(value, amountPercent, allocationIndex, formData, openApi);
            }}
          />,
          <InputNumber
            name="amountPercent"
            label="分配比例"
            rule="REQ"
            min="0"
            max="100"
            precision={2}
            step="0.01"
            addonAfter={'%'}
            onChange={(value, { formData, openApi }) => {
              const totalAmount = type === 1 ? formData.billItems.reduce((prev, cur) => +(prev || 0) + +(cur.amount || 0), 0) : +formData.amount;
              const amount = formatView((totalAmount || 0) * (value || 0), 'number--100-useGrouping:false');
              debounced(amount, value, allocationIndex, formData, openApi);
            }}
          />
        ];
      }}
    />
  );
});

export default BillAllocationForm;
