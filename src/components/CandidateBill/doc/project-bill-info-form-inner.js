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
