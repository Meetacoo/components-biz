const { createWithRemoteLoader } = remoteLoader;
const { default: BillNotice } = _BillNotice;
const { default: presetMock, billInfo } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return (
    <PureGlobal preset={presetMock}>
      <BillNotice data={billInfo} />
    </PureGlobal>
  );
});

render(<BaseExample />);
