const { default: PaymentSelect, INVOICE_TYPE_ENUM } = _PaymentSelect;
const { createWithRemoteLoader } = remoteLoader;

const { default: paymentList } = _paymentList;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:FormInfo@Form']
})(({ remoteModules }) => {
  const [PureGlobal, Form] = remoteModules;
  return (
    <PureGlobal
      preset={{
        apis: {
          payment: {
            getPaymentList: {
              loader: () => {
                return paymentList.data;
              }
            }
          }
        },
        enums: { INVOICE_TYPE_ENUM }
      }}
    >
      <Form>
        <PaymentSelect name="payment" label="付款信息" />
      </Form>
    </PureGlobal>
  );
});

render(<BaseExample />);
