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
            },
            getPaymentById: {
              loader: () => {
                return paymentList.data.pageData[0];
              }
            }
          }
        },
        enums: { INVOICE_TYPE_ENUM }
      }}
    >
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
      </Form>
    </PureGlobal>
  );
});

render(<BaseExample />);
