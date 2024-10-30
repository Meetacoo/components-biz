const { BillCenterPage } = _CandidateBill;
const { createWithRemoteLoader } = remoteLoader;
const { default: presetMock } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:Layout']
})(({ remoteModules }) => {
  const [PureGlobal, Layout] = remoteModules;
  return (
    <PureGlobal preset={presetMock}>
      <Layout navigation={{ isFixed: false }}>
        <BillCenterPage />
      </Layout>
    </PureGlobal>
  );
});

render(<BaseExample />);
