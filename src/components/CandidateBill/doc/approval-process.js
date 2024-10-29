const { ApprovalProcess, FLOW_USER } = _CandidateBill;
const { createWithRemoteLoader } = remoteLoader;
const { default: flowData } = _flowData;
const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:FormInfo@Form']
})(({ remoteModules }) => {
  const [PureGlobal, Form] = remoteModules;
  return (
    <PureGlobal
      preset={{
        apis: {
          flow: {
            getFlowCondition: {
              loader: () => {
                return {
                  conditions: [
                    {
                      columnName: 'withoutContractType'
                    }
                  ],
                  flowNo: '1004'
                };
              }
            },
            getNodesList: {
              loader: () => {
                return flowData.data;
              }
            }
          }
        }
      }}
    >
      <Form rules={{ FLOW_USER }}>
        <ApprovalProcess label="账单审批流程" name="flowRequest" rule="REQ FLOW_USER" />
      </Form>
    </PureGlobal>
  );
});

render(<BaseExample />);
