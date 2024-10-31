const { GenerateBillDetail, FLOW_USER } = _CandidateBill;
const { createWithRemoteLoader } = remoteLoader;

const { default: presetMock, billInfo } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:FormInfo@Form']
})(({ remoteModules }) => {
  const [PureGlobal, Form] = remoteModules;
  return (
    <PureGlobal preset={presetMock}>
      <Form rules={{ FLOW_USER }}>
        <GenerateBillDetail billDetail={billInfo} />
      </Form>
    </PureGlobal>
  );
});

render(<BaseExample />);
