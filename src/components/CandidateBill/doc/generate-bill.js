const { createWithRemoteLoader } = remoteLoader;
const { GenerateBill, GenerateProjectBill } = _CandidateBill;
const { Button, Space } = antd;
const { default: presetMock } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return (
    <PureGlobal preset={presetMock}>
      <Space>
        <GenerateBill>
          {({ modal }) => {
            return (
              <Button
                onClick={() => {
                  modal({
                    title: '生成候选人账单',
                    formProps: [
                      {
                        onSubmit: async () => {}
                      },
                      {
                        onSubmit: async () => {}
                      }
                    ]
                  });
                }}
              >
                生成候选人账单
              </Button>
            );
          }}
        </GenerateBill>
        <GenerateProjectBill>
          {({ modal }) => {
            return (
              <Button
                onClick={() => {
                  modal({
                    title: '生成候选人账单',
                    formProps: [
                      {
                        onSubmit: async () => {}
                      },
                      {
                        onSubmit: async () => {}
                      }
                    ]
                  });
                }}
              >
                生成项目账单
              </Button>
            );
          }}
        </GenerateProjectBill>
      </Space>
    </PureGlobal>
  );
});

render(<BaseExample />);
