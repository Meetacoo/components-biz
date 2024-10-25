const { default: ContractSelect, CONTRACT_STATE_ENUM } = _ContractSelect;
const { createWithRemoteLoader } = remoteLoader;
const { data: contractData } = _data;
const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:FormInfo@Form']
})(({ remoteModules }) => {
  const [PureGlobal, Form] = remoteModules;
  return (
    <PureGlobal
      preset={{
        enums: {
          CONTRACT_STATE_ENUM
        },
        apis: {
          oss: {
            loader: () => {
              return 'test.png';
            }
          },
          contract: {
            getList: {
              loader: () => {
                return contractData;
              }
            }
          }
        }
      }}
    >
      <Form
        data={{
          contract2: Object.assign({}, contractData.pageData[0], {
            label: contractData.pageData[0].name,
            value: contractData.pageData[0].id
          })
        }}
      >
        <ContractSelect name="contract" label="合同" />
        <ContractSelect name="contract2" label="合同只读" disabled />
      </Form>
    </PureGlobal>
  );
});

render(<BaseExample />);
