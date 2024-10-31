const { default: ContractSelect } = _ContractSelect;
const { createWithRemoteLoader } = remoteLoader;
const { default: presetMock, contractList } = _presetMock;
const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:FormInfo@Form']
})(({ remoteModules }) => {
  const [PureGlobal, Form] = remoteModules;
  return (
    <PureGlobal preset={presetMock}>
      <Form
        data={{
          contract2: Object.assign({}, contractList.data.pageData[0], {
            label: contractList.data.pageData[0].name,
            value: contractList.data.pageData[0].id
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
