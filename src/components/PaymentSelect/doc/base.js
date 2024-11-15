const { default: PaymentSelect } = _PaymentSelect;
const { createWithRemoteLoader } = remoteLoader;
const { default: presetMock, paymentList } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:FormInfo@Form']
})(({ remoteModules }) => {
  const [PureGlobal, Form] = remoteModules;
  return (
    <PureGlobal preset={presetMock}>
      <Form
        data={{
          payment2: (() => {
            const value = paymentList.data.pageData[0];
            return {
              value: value.id,
              label: value.invoiceTitle
            };
          })()
        }}
      >
        <PaymentSelect name="payment" label="付款信息" />
        <PaymentSelect name="payment2" label="付款信息(有默认值)" />
        <PaymentSelect name="payment2" label="付款信息(有默认值并禁止修改)" disabled />
      </Form>
    </PureGlobal>
  );
});

render(<BaseExample />);
