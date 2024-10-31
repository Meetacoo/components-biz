const { BillInfoFormInner } = _CandidateBill;
const { createWithRemoteLoader } = remoteLoader;

const { default: presetMock } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:FormInfo@Form', 'components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [Form, PureGlobal] = remoteModules;
  return (
    <PureGlobal preset={presetMock}>
      <Form>
        <BillInfoFormInner client={{ clientName: '测试客户', clientId: '123' }} trackingList={[]} />
      </Form>
    </PureGlobal>
  );
});

render(<BaseExample />);
