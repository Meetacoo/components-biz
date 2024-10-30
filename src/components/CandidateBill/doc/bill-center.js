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
