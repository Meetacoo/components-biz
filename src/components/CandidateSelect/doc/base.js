const { default: CandidateSelect } = _CandidateSelect;
const { createWithRemoteLoader } = remoteLoader;
const { default: presetMock } = _presetMock;
const BaseExample = createWithRemoteLoader({
  modules: ['components-core:FormInfo@Form', 'components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [Form, PureGlobal] = remoteModules;
  return (
    <PureGlobal preset={presetMock}>
      <Form>
        <CandidateSelect name="candidate" label="候选人" minLength={1} />
      </Form>
    </PureGlobal>
  );
});

render(<BaseExample />);
