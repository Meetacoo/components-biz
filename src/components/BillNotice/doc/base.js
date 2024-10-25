const { default: BillNotice } = _BillNotice;
const { default: paymentData } = _paymentData;
const BaseExample = () => {
  return <BillNotice data={paymentData} />;
};

render(<BaseExample />);
