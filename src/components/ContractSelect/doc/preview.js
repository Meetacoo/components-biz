const { Preview } = _ContractSelect;
const { createWithRemoteLoader } = remoteLoader;
const { data: contractData } = _data;
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
            getDetail: {
              loader: () => {
                return contractData;
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
