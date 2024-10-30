
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

- ApprovalProcess
- 流程配置
- _CandidateBill(@components/CandidateBill),remoteLoader(@kne/remote-loader),_flowData(@components/CandidateBill/doc/mock/flow.json)

```jsx
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

```

- 生成账单
- 生成账单
- remoteLoader(@kne/remote-loader),antd(antd),_CandidateBill(@components/CandidateBill),_projectListData(@components/ProjectSelect/doc/projectList.json),_ContractSelect(@components/ContractSelect),_data(@components/ContractSelect/doc/contractListData.json),_userListData(@components/CandidateSelect/doc/userListData.json),_positionListData(@components/CandidateSelect/doc/positionListData.json),_paymentData(@components/BillNotice/doc/paymentData.json),_paymentList(@components/PaymentSelect/doc/paymentList.json),_flowData(@components/CandidateBill/doc/mock/flow.json),_billNoticeMock(@components/BillNotice/doc/mock),_lodash(lodash)

```jsx
const { createWithRemoteLoader } = remoteLoader;
const { GenerateBill, GenerateProjectBill } = _CandidateBill;
const { Button, Space } = antd;
const { range, merge } = _lodash;
const { default: projectListData } = _projectListData;
const { data: contractData } = _data;
const { CONTRACT_STATE_ENUM } = _ContractSelect;

const { default: userListData } = _userListData;
const { default: positionListData } = _positionListData;
const { data: userList } = userListData;
const { data: positionList } = positionListData;

const { default: paymentData } = _paymentData;
const { default: paymentList } = _paymentList;

const { default: flowData } = _flowData;

const { default: billNoticeMock } = _billNoticeMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return (<PureGlobal
    preset={{
      ajax: async api => {
        return { data: { code: 0, data: api.loader() } };
      }, enums: {
        CONTRACT_STATE_ENUM
      }, apis: merge({}, billNoticeMock, {
        flow: {
          getFlowCondition: {
            loader: () => {
              return {
                conditions: [{
                  columnName: 'withoutContractType'
                }], flowNo: '1004'
              };
            }
          }, getNodesList: {
            loader: () => {
              return flowData.data;
            }
          }
        }, user: {
          getUserList: {
            loader: ({ data }) => {
              const params = Object.assign({
                perPage: 20, currentPage: 1
              }, data);
              return new Promise(resolve => {
                const start = (params.currentPage - 1) * params.perPage;
                resolve({
                  totalCount: 100, pageData: range(start, start + params.perPage).map(key => {
                    return {
                      name: `用户${key + 1}`, id: key + 1, uid: key + 1, englishName: `User${key + 1}`
                    };
                  })
                });
              });
            }
          }
        }, client: {}, project: {
          getList: {
            loader: () => {
              return projectListData.data;
            }
          }, getDetail: {
            loader: () => {
              return projectListData.data.projectList[0];
            }
          }
        }, contract: {
          getContractList: {
            loader: () => {
              return contractData;
            }
          }, getContractById: {
            loader: () => {
              return contractData.pageData[0];
            }
          }
        }, ats: {
          getTrackingList: {
            loader: () => {
              return userList;
            }
          }
        }, position: {
          getMyList: {
            loader: () => {
              return positionList;
            }
          }
        }, bill: {
          save: {
            loader: () => {
              return paymentData;
            }
          }
        }, payment: {
          getPaymentList: {
            loader: () => {
              return paymentList.data;
            }
          }, getPaymentById: {
            loader: ({ params }) => {
              return paymentList.data.pageData[params.id];
            }
          }
        }
      })
    }}
  >
    <Space>
      <GenerateBill>
        {({ modal }) => {
          return (<Button
            onClick={() => {
              modal({
                title: '生成候选人账单', formProps: [{
                  onSubmit: async () => {
                  }
                }, {
                  onSubmit: async () => {
                  }
                }]
              });
            }}
          >
            生成候选人账单
          </Button>);
        }}
      </GenerateBill>
      <GenerateProjectBill>
        {({ modal }) => {
          return (<Button
            onClick={() => {
              modal({
                title: '生成候选人账单', formProps: [{
                  onSubmit: async () => {
                  }
                }, {
                  onSubmit: async () => {
                  }
                }]
              });
            }}
          >
            生成项目账单
          </Button>);
        }}
      </GenerateProjectBill>
    </Space>
  </PureGlobal>);
});

render(<BaseExample />);

```

- GenerateBillDetail
- 生成账单详情
- _CandidateBill(@components/CandidateBill),remoteLoader(@kne/remote-loader),_flowData(@components/CandidateBill/doc/mock/flow.json),_billNoticeMock(@components/BillNotice/doc/mock)

```jsx
const { GenerateBillDetail, FLOW_USER } = _CandidateBill;
const { createWithRemoteLoader } = remoteLoader;
const { default: billNoticeMock } = _billNoticeMock;
const { default: flowData } = _flowData;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:FormInfo@Form']
})(({ remoteModules }) => {
  const [PureGlobal, Form] = remoteModules;
  return (<PureGlobal
    preset={{
      ajax: async api => {
        return { data: { code: 0, data: api.loader() } };
      },
      apis: {
        flow: {
          getFlowCondition: {
            loader: () => {
              return {
                conditions: [{
                  columnName: 'withoutContractType'
                }], flowNo: '1004'
              };
            }
          }, getNodesList: {
            loader: () => {
              return flowData.data;
            }
          }
        }, ...billNoticeMock
      }
    }}
  >
    <Form rules={{ FLOW_USER }}>
      <GenerateBillDetail billDetail={{
        bankInfoOperation: 'xxxx',
        totalAmount: '1000',
        projects: [{
          id: 223,
          noticeId: 122,
          projectTypeId: 7,
          projectType: '入职到岗',
          costType: 1,
          amount: 1900000,
          num: null,
          projectAttachments: null
        }, {
          id: 223,
          noticeId: 122,
          projectTypeId: 7,
          projectType: '入职到岗',
          costType: 1,
          amount: 1900000,
          num: null,
          projectAttachments: null
        }],
        clientName: '华威股份有限公司',
        clientNum: '666666',
        clientNameChinese: '华威股份有限公司',
        clientNameEnglish: 'FA Talent Human Resources Service Co.',
        clientAddress: '北京市朝阳区东三环北路嘉铭中心B座15层',
        contact: '19829288292',
        consultant: '张三',
        attention: '张三',
        date: '2023-07-21',
        team: 'FAT',
        userInfo: {
          email: 'fuling@165.com',
          phone: '13988882221',
          name: '福玲',
          englishName: '福玲',
          gender: 'M',
          createdAt: '2022-11-18T08:22:56.000+00:00',
          updatedAt: '2023-02-28T02:22:43.000+00:00'
        }
      }} />
    </Form>
  </PureGlobal>);
});

render(<BaseExample />);

```

- 生成候选人账单表单
- 生成候选人账单表单
- remoteLoader(@kne/remote-loader),_CandidateBill(@components/CandidateBill),_projectListData(@components/ProjectSelect/doc/projectList.json),_ContractSelect(@components/ContractSelect),_data(@components/ContractSelect/doc/contractListData.json),_userListData(@components/CandidateSelect/doc/userListData.json),_positionListData(@components/CandidateSelect/doc/positionListData.json),_paymentList(@components/PaymentSelect/doc/paymentList.json),_flowData(@components/CandidateBill/doc/mock/flow.json),_lodash(lodash)

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
const { data: paymentList } = _paymentList;
const { range } = _lodash;
const { default: flowData } = _flowData;

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
          },
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
            getContractList: {
              loader: () => {
                return contractData;
              }
            },
            getContractById: {
              loader: () => {
                return contractData.pageData[0];
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
          payment: {
            getPaymentList: {
              loader: () => {
                return paymentList;
              }
            },
            getPaymentById: {
              loader: ({ params }) => {
                return paymentList.pageData[params.id];
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
- remoteLoader(@kne/remote-loader),_CandidateBill(@components/CandidateBill),_projectListData(@components/ProjectSelect/doc/projectList.json),_ContractSelect(@components/ContractSelect),_data(@components/ContractSelect/doc/contractListData.json),_userListData(@components/CandidateSelect/doc/userListData.json),_positionListData(@components/CandidateSelect/doc/positionListData.json),_paymentList(@components/PaymentSelect/doc/paymentList.json),_flowData(@components/CandidateBill/doc/mock/flow.json),_lodash(lodash)

```jsx
const { ProjectBillInfoFormInner } = _CandidateBill;
const { createWithRemoteLoader } = remoteLoader;
const { default: projectListData } = _projectListData;
const { data: contractData } = _data;
const { CONTRACT_STATE_ENUM } = _ContractSelect;
const { range } = _lodash;

const { default: userListData } = _userListData;
const { default: positionListData } = _positionListData;
const { data: userList } = userListData;
const { data: positionList } = positionListData;
const { default: paymentList } = _paymentList;

const { default: flowData } = _flowData;

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
          },
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
            getContractList: {
              loader: () => {
                return contractData;
              }
            },
            getContractById: {
              loader: () => {
                return contractData.pageData[0];
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
          payment: {
            getPaymentList: {
              loader: () => {
                return paymentList.data;
              }
            },
            getPaymentById: {
              loader: ({ params }) => {
                return paymentList.data.pageData[params.id];
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
- remoteLoader(@kne/remote-loader),_CandidateBill(@components/CandidateBill),mockData(@components/CandidateBill/doc/mock),_lodash(lodash),_paymentList(@components/PaymentSelect/doc/paymentList.json),_flowData(@components/CandidateBill/doc/mock/flow.json),_contractList(@components/ContractSelect/doc/contractListData.json),_ContractSelect(@components/ContractSelect),_projectListData(@components/ProjectSelect/doc/projectList.json)

```jsx
const { BillCenterPage, BILL_STATE_ENUM } = _CandidateBill;
const { createWithRemoteLoader } = remoteLoader;
const { listData, detailData } = mockData;
const { range } = _lodash;
const { data: paymentList } = _paymentList;
const { data: contractData } = _contractList;
const { default: flowData } = _flowData;
const { CONTRACT_STATE_ENUM } = _ContractSelect;
const { default: projectListData } = _projectListData;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:Layout']
})(({ remoteModules }) => {
  const [PureGlobal, Layout] = remoteModules;
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
          },
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
            getContractList: {
              loader: () => {
                return contractData;
              }
            },
            getContractById: {
              loader: () => {
                return contractData.pageData[0];
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
              loader: async () => detailData
            },
            addBill: {
              loader: () => {}
            },
            saveBill: {
              loader: () => {}
            }
          },
          payment: {
            getPaymentList: {
              loader: () => {
                return paymentList;
              }
            },
            getPaymentById: {
              loader: ({ params }) => {
                return paymentList.pageData[params.id];
              }
            }
          }
        },
        enums: {
          BILL_STATE_ENUM,
          CONTRACT_STATE_ENUM,
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
        },
        permissions: ['bill:apply:edit', 'bill:apply:export_notice', 'jd:job:look', 'cv:cv:look']
      }}
    >
      <Layout navigation={{ isFixed: false }}>
        <BillCenterPage />
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
const { default: flowData } = _flowData;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:Layout']
})(({ remoteModules }) => {
  const [PureGlobal, Layout] = remoteModules;
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
          },
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

