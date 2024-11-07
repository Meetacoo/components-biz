import { createWithRemoteLoader } from '@kne/remote-loader';
import Fetch from '@kne/react-fetch';
import { Button } from 'antd';
import transform from 'lodash/transform';
import get from 'lodash/get';

const ApprovalProcessField = createWithRemoteLoader({
  modules: [
    'components-core:Global@usePreset',
    'components-core:InfoPage@Flow',
    'components-core:FormInfo@SuperSelect',
    'components-core:Icon',
    'components-core:FormInfo@useFormContext'
  ]
})(({ remoteModules, value, onChange, ...props }) => {
  const [usePreset, Flow, SuperSelect, Icon, useFormContext] = remoteModules;
  const { apis } = usePreset();
  const { formData, openApi } = useFormContext();

  const valueNodeListMap = new Map((get(value, 'nodeList') || []).map(item => [item.nodeId, item]));

  return (
    <Fetch
      {...Object.assign({}, apis.flow.getFlowCondition, {
        data: { businessType: 'BILL' }
      })}
      render={({ data }) => {
        const { flowNo } = data;
        return (
          <Fetch
            {...Object.assign({}, apis.flow.getNodesList, {
              data: { flowNo }
            })}
            render={({ data }) => {
              const { flowNodes } = data;
              return (
                <Flow
                  {...props}
                  progressDot
                  dataSource={flowNodes}
                  columns={[
                    { type: 'title', name: 'flowNodeName' },
                    { name: 'status', getValueOf: () => 'finish' },
                    {
                      type: 'description',
                      name: 'userList',
                      render: (currentValue, { target }) => {
                        if (target.actionType === 1 && target.roleType === 3) {
                          const currentNodeUserId = (() => {
                            const currentNode = valueNodeListMap.get(target.id);
                            if (!(currentNode && currentNode.userId)) {
                              return null;
                            }
                            const currentUser = currentValue.find(item => item.userId === currentNode.userId[0]);
                            if (!currentUser) {
                              return null;
                            }

                            return { value: currentUser.userId, label: currentUser.userName };
                          })();

                          return (
                            <SuperSelect.Field
                              single
                              value={currentNodeUserId}
                              options={currentValue.map(item => {
                                return { value: item.userId, label: item.userName };
                              })}
                              inputRender={(inputProps, { props, value }) => {
                                if (value && value[0]) {
                                  return (
                                    <>
                                      {value[0][props.labelKey]}
                                      <Button type="link" size="small">
                                        <Icon type="bianji" />
                                        编辑
                                      </Button>
                                    </>
                                  );
                                }
                                return (
                                  <>
                                    请添加审批人
                                    <Button type="link" size="small">
                                      <Icon type="tianjia" />
                                      添加
                                    </Button>
                                  </>
                                );
                              }}
                              onChange={currentValue => {
                                onChange(
                                  Object.assign({}, value, {
                                    flowNo,
                                    nodeList: flowNodes.map(flow => {
                                      const userId = (() => {
                                        if (!(flow.actionType === 1 && flow.roleType === 3)) {
                                          return (flow.userList || []).map(item => item.userId);
                                        }
                                        if (flow.id === target.id) {
                                          return currentValue ? [currentValue.value] : null;
                                        }

                                        const currentNode = valueNodeListMap.get(flow.id);
                                        if (!currentNode) {
                                          return null;
                                        }
                                        return currentNode.userId;
                                      })();
                                      return Object.assign(
                                        {},
                                        transform(
                                          ['level', 'order', 'actionType', 'roleType', 'userName', 'auditType'],
                                          (result, name) => {
                                            result[name] = flow[name];
                                          },
                                          {}
                                        ),
                                        { userId, nodeId: flow.id }
                                      );
                                    })
                                  })
                                );
                              }}
                            />
                          );
                        }
                        return currentValue.map(user => user.userName).join(',');
                      }
                    }
                  ]}
                />
              );
            }}
          />
        );
      }}
    />
  );
});

const ApprovalProcess = createWithRemoteLoader({
  modules: ['components-core:FormInfo@hooks']
})(({ remoteModules, ...props }) => {
  const [hooks] = remoteModules;
  const { useOnChange } = hooks;
  const render = useOnChange(Object.assign({}, { placeholder: `请选择${props.label}`, labelHidden: true }, props));
  return render(ApprovalProcessField);
});

ApprovalProcess.Field = ApprovalProcessField;

export default ApprovalProcess;
export { default as FLOW_USER } from './FLOW_USER';
