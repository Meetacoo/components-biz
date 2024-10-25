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
