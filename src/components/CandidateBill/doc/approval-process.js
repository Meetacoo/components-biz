const { ApprovalProcess, FLOW_USER } = _CandidateBill;
const { createWithRemoteLoader } = remoteLoader;
const { default: presetMock } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:FormInfo@Form']
})(({ remoteModules }) => {
  const [PureGlobal, Form] = remoteModules;
  return (
    <PureGlobal preset={presetMock}>
      <Form rules={{ FLOW_USER }}>
        <ApprovalProcess label="账单审批流程" name="flowRequest" rule="REQ FLOW_USER" />
      </Form>
    </PureGlobal>
  );
});

render(<BaseExample />);
