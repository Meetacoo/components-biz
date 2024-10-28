const { createWithRemoteLoader } = remoteLoader;
const { GenerateBill, GenerateProjectBill } = _CandidateBill;
const { Button, Space } = antd;
const { range } = _lodash;
const { default: projectListData } = _projectListData;
const { data: contractData } = _data;
const { CONTRACT_STATE_ENUM } = _ContractSelect;

const { default: userListData } = _userListData;
const { default: positionListData } = _positionListData;
const { data: userList } = userListData;
const { data: positionList } = positionListData;

const { default: paymentData } = _paymentData;
const { default: paymentList } = _paymentList;

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
          bill: {
            save: {
              loader: () => {
                return paymentData;
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
      <Space>
        <GenerateBill>
          {({ modal }) => {
            return (
              <Button
                onClick={() => {
                  modal({
                    title: '生成候选人账单',
                    formProps: [{ onSubmit: async () => {} }, { onSubmit: async () => {} }]
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
                    formProps: [{ onSubmit: async () => {} }, { onSubmit: async () => {} }]
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
