const { Preview } = _PaymentSelect;
const { createWithRemoteLoader } = remoteLoader;
const { default: presetMock } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return (
    <PureGlobal preset={presetMock}>
      <Preview id={0} />
    </PureGlobal>
  );
});

render(<BaseExample />);
