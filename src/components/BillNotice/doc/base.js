const { createWithRemoteLoader } = remoteLoader;
const { default: BillNotice } = _BillNotice;
const { default: mockApis, billInfo } = _mock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return (
    <PureGlobal
      preset={{
        apis: mockApis,
        ajax: async api => {
          return { data: { code: 0, data: api.loader() } };
        }
      }}
    >
      <BillNotice data={billInfo} />
    </PureGlobal>
  );
});

render(<BaseExample />);
