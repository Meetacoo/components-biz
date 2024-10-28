const { Preview } = _ContractSelect;
const { createWithRemoteLoader } = remoteLoader;
const { data: contractDetail } = _dataDetail;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return (
    <PureGlobal
      preset={{
        apis: {
          oss: {
            loader: () => {
              return 'test.png';
            }
          },
          contract: {
            getContractById: {
              loader: () => {
                return contractDetail;
              }
            }
          }
        }
      }}
    >
      <Preview />
    </PureGlobal>
  );
});

render(<BaseExample />);
