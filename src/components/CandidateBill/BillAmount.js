import { createWithRemoteLoader } from '@kne/remote-loader';
import { billTransform } from './index';

const BillAmount = createWithRemoteLoader({
  modules: ['components-core:FormInfo@fields', 'components-core:FormInfo@formModule', 'components-core:InfoPage@formatView']
})(({ remoteModules, index }) => {
  const [fields, formModule, formatView] = remoteModules;
  const { useFormContext } = formModule;
  const { formData, openApi } = useFormContext();
  const { MoneyInput } = fields;

  return (
    <MoneyInput
      name="amount"
      label="账单金额"
      rule="REQ"
      onChange={value => {
        const totalAmount =
          index || index === 0
            ? (formData.billItems || []).reduce(
                (pre, cur, currentIndex) => +(pre || 0) + (currentIndex === index ? +(value || 0) : +(cur.amount || 0)),
                0
              )
            : value;
        billTransform.transformAllocation(totalAmount, formatView, formData, openApi);
      }}
    />
  );
});

export default BillAmount;
