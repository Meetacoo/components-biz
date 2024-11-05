const { createWithRemoteLoader } = remoteLoader;
const { GenerateBillButton, EditBillButton, GenerateProjectBillButton, EditBillProjectButton } = _CandidateBill;
const { Button, Space } = antd;
const { default: presetMock, astUserList } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return (
    <PureGlobal preset={presetMock}>
      <Space>
        <GenerateBillButton client={{ clientId: '123', clientName: '测试客户' }} trackingList={astUserList.data.pageData.data.slice(3, 5)} typeId={6}>
          生成候选人账单
        </GenerateBillButton>
        <EditBillButton id="123">编辑候选人账单</EditBillButton>
        <GenerateProjectBillButton client={{ clientId: '123', clientName: '测试客户' }}>生成项目账单</GenerateProjectBillButton>
        <EditBillProjectButton id="123">编辑项目账单</EditBillProjectButton>
      </Space>
    </PureGlobal>
  );
});

render(<BaseExample />);
