
# CandidateBill


### 概述

候选人账单


### 示例(全屏)

#### 示例代码

- 这里填写示例标题
- 这里填写示例说明
- _CandidateBill(@components/CandidateBill)

```jsx
const { default: CandidateBill } = _CandidateBill;
const BaseExample = () => {
  return <CandidateBill />;
};

render(<BaseExample />);

```

- 生成账单
- 生成账单
- remoteLoader(@kne/remote-loader),antd(antd),_CandidateBill(@components/CandidateBill),_projectListData(@components/ProjectSelect/doc/projectList.json),_ContractSelect(@components/ContractSelect),_data(@components/ContractSelect/doc/contractListData.json),_userListData(@components/CandidateSelect/doc/userListData.json),_positionListData(@components/CandidateSelect/doc/positionListData.json),_paymentData(@components/BillNotice/doc/paymentData.json)

```jsx
const { createWithRemoteLoader } = remoteLoader;
const { GenerateBill, GenerateProjectBill } = _CandidateBill;
const { Button, Space } = antd;
const { default: projectListData } = _projectListData;
const { data: contractData } = _data;
const { CONTRACT_STATE_ENUM } = _ContractSelect;

const { default: userListData } = _userListData;
const { default: positionListData } = _positionListData;
const { data: userList } = userListData;
const { data: positionList } = positionListData;

const { default: paymentData } = _paymentData;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return (
    <PureGlobal
      preset={{
        enums: {
          CONTRACT_STATE_ENUM
        },
        apis: {
          client: {},
          project: {
            getList: {
              loader: () => {
                return projectListData.data;
              }
            },
            getDetail: {
              loader: () => {
                return projectListData.data.projectList[0];
              }
            }
          },
          contract: {
            getList: {
              loader: () => {
                return contractData;
              }
            }
          },
          ats: {
            getTrackingList: {
              loader: () => {
                return userList;
              }
            }
          },
          position: {
            getMyList: {
              loader: () => {
                return positionList;
              }
            }
          },
          bill: {
            save: {
              loader: () => {
                return paymentData;
              }
            }
          }
        }
      }}
    >
      <Space>
        <GenerateBill>
          {({ modal }) => {
            return (
              <Button
                onClick={() => {
                  modal();
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
                  modal();
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

```

- 生成候选人账单表单
- 生成候选人账单表单
- remoteLoader(@kne/remote-loader),_CandidateBill(@components/CandidateBill),_projectListData(@components/ProjectSelect/doc/projectList.json),_ContractSelect(@components/ContractSelect),_data(@components/ContractSelect/doc/contractListData.json),_userListData(@components/CandidateSelect/doc/userListData.json),_positionListData(@components/CandidateSelect/doc/positionListData.json)

```jsx
const { BillInfoFormInner } = _CandidateBill;
const { createWithRemoteLoader } = remoteLoader;
const { default: projectListData } = _projectListData;
const { data: contractData } = _data;
const { CONTRACT_STATE_ENUM } = _ContractSelect;
const { default: userListData } = _userListData;
const { default: positionListData } = _positionListData;
const { data: userList } = userListData;
const { data: positionList } = positionListData;
const BaseExample = createWithRemoteLoader({
  modules: ['components-core:FormInfo@Form', 'components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [Form, PureGlobal] = remoteModules;
  return (
    <PureGlobal
      preset={{
        enums: {
          CONTRACT_STATE_ENUM
        },
        apis: {
          client: {},
          project: {
            getList: {
              loader: () => {
                return projectListData.data;
              }
            },
            getDetail: {
              loader: () => {
                return projectListData.data.projectList[0];
              }
            }
          },
          contract: {
            getList: {
              loader: () => {
                return contractData;
              }
            }
          },
          ats: {
            getTrackingList: {
              loader: () => {
                return userList;
              }
            }
          },
          position: {
            getMyList: {
              loader: () => {
                return positionList;
              }
            }
          }
        }
      }}
    >
      <Form>
        <BillInfoFormInner />
      </Form>
    </PureGlobal>
  );
});

render(<BaseExample />);

```

- 生成项目账单表单
- 生成项目账单表单
- remoteLoader(@kne/remote-loader),_CandidateBill(@components/CandidateBill),_projectListData(@components/ProjectSelect/doc/projectList.json),_ContractSelect(@components/ContractSelect),_data(@components/ContractSelect/doc/contractListData.json),_userListData(@components/CandidateSelect/doc/userListData.json),_positionListData(@components/CandidateSelect/doc/positionListData.json)

```jsx
const { ProjectBillInfoFormInner } = _CandidateBill;
const { createWithRemoteLoader } = remoteLoader;
const { default: projectListData } = _projectListData;
const { data: contractData } = _data;
const { CONTRACT_STATE_ENUM } = _ContractSelect;

const { default: userListData } = _userListData;
const { default: positionListData } = _positionListData;
const { data: userList } = userListData;
const { data: positionList } = positionListData;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:FormInfo@Form', 'components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [Form, PureGlobal] = remoteModules;
  return (
    <PureGlobal
      preset={{
        enums: {
          CONTRACT_STATE_ENUM
        },
        apis: {
          client: {},
          project: {
            getList: {
              loader: () => {
                return projectListData.data;
              }
            },
            getDetail: {
              loader: () => {
                return projectListData.data.projectList[0];
              }
            }
          },
          contract: {
            getList: {
              loader: () => {
                return contractData;
              }
            }
          },
          ats: {
            getTrackingList: {
              loader: () => {
                return userList;
              }
            }
          },
          position: {
            getMyList: {
              loader: () => {
                return positionList;
              }
            }
          }
        }
      }}
    >
      <Form>
        <ProjectBillInfoFormInner />
      </Form>
    </PureGlobal>
  );
});

render(<BaseExample />);

```

- 账单中心
- 账单中心
- remoteLoader(@kne/remote-loader),_CandidateBill(@components/CandidateBill),mockData(@components/CandidateBill/doc/mock),_lodash(lodash)

```jsx
const { BillCenter, BILL_STATE_ENUM } = _CandidateBill;
const { createWithRemoteLoader } = remoteLoader;
const { listData } = mockData;
const { range } = _lodash;
const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:Layout']
})(({ remoteModules }) => {
  const [PureGlobal, Layout] = remoteModules;
  return (
    <PureGlobal
      preset={{
        apis: {
          client: {},
          user: {
            getUserList: {
              loader: ({ data }) => {
                const params = Object.assign(
                  {
                    perPage: 20,
                    currentPage: 1
                  },
                  data
                );
                return new Promise(resolve => {
                  const start = (params.currentPage - 1) * params.perPage;
                  resolve({
                    totalCount: 100,
                    pageData: range(start, start + params.perPage).map(key => {
                      return {
                        name: `用户${key + 1}`,
                        id: key + 1,
                        uid: key + 1,
                        englishName: `User${key + 1}`
                      };
                    })
                  });
                });
              }
            }
          },
          project: {
            getList: {
              loader: () => {
                return projectListData.data;
              }
            },
            getDetail: {
              loader: () => {
                return projectListData.data.projectList[0];
              }
            }
          },
          contract: {
            getList: {
              loader: () => {
                return contractData;
              }
            }
          },
          ats: {
            getTrackingList: {
              loader: () => {
                return userList;
              }
            }
          },
          position: {
            getMyList: {
              loader: () => {
                return positionList;
              }
            }
          },
          candidateBill: {
            getBillList: {
              loader: async () => listData
            },
            getBillDetail: {
              loader: async () => listData.data[0]
            },
            saveBill: {
              loader: () => {}
            }
          }
        },
        enums: {
          BILL_STATE_ENUM,
          invoiceProjectType: [
            { value: 1, description: 'onsite' },
            { value: 2, description: 'mapping' },
            { value: 3, description: '项目管理' },
            { value: 4, description: '项目启动金' },
            { value: 5, description: '内推' },
            { value: 6, description: '面试到岗' },
            { value: 7, description: '入职到岗' },
            { value: 8, description: '其他' }
          ]
        }
      }}
    >
      <Layout navigation={{ isFixed: false }}>
        <BillCenter />
      </Layout>
    </PureGlobal>
  );
});

render(<BaseExample />);

```

- 账单详情
- 账单详情
- remoteLoader(@kne/remote-loader),_CandidateBill(@components/CandidateBill),mockData(@components/CandidateBill/doc/mock)

```jsx
const { BillCenterDetail } = _CandidateBill;
const { createWithRemoteLoader } = remoteLoader;
const { detailData } = mockData;
const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:Layout']
})(({ remoteModules }) => {
  const [PureGlobal, Layout] = remoteModules;
  return (
    <PureGlobal
      preset={{
        apis: {
          candidateBill: {
            getBillDetail: {
              loader: () => detailData
            }
          }
        },
        enums: {
          CONTRACT_STATE_ENUM: [
            { value: 1, description: '待提交审核', type: 'info' },
            { value: 2, description: '审核中', type: 'progress' },
            { value: 3, description: '已撤销', type: 'default' },
            { value: 4, description: '审核拒绝', type: 'danger' },
            { value: 5, description: '审核通过', type: 'success' },
            { value: 6, description: '审核拒绝合同副本', type: 'danger' },
            { value: 7, description: '已过期' },
            { value: 8, description: '续签审核中', type: 'progress' },
            { value: 9, description: '续签审核拒绝', type: 'danger' },
            { value: 10, description: '续签审核通过', type: 'success' }
          ]
        }
      }}
    >
      <Layout navigation={{ isFixed: false }}>
        <BillCenterDetail optionFixed={false} />
      </Layout>
    </PureGlobal>
  );
});

render(<BaseExample />);

```


### API

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |

