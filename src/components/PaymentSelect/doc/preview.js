const { Preview, INVOICE_TYPE_ENUM } = _PaymentSelect;
const { createWithRemoteLoader } = remoteLoader;

const { default: paymentList } = _paymentList;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return (
    <PureGlobal
      preset={{
        apis: {
          payment: {
            getPaymentById: {
              loader: ({ params }) => {
                return paymentList.data.pageData[params.id];
              }
            }
          }
        },
        enums: { INVOICE_TYPE_ENUM }
      }}
    >
      <Preview id={0} />
    </PureGlobal>
  );
});

render(<BaseExample />);
