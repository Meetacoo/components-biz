import { CONTRACT_STATE_ENUM } from '@components/ContractSelect';
import flow from './flow.json';
import range from 'lodash/range';
import projectList from './projectList.json';
import contractDetail from './contractDetail.json';
import contractList from './contractList.json';
import astUserList from './astUserList.json';
import positionList from './positionList.json';
import paymentList from './paymentList.json';

const preset = {
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
          return flow.data;
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
          return projectList.data;
        }
      },
      getDetail: {
        loader: () => {
          return projectList.data.projectList[0];
        }
      }
    },
    contract: {
      getContractList: {
        loader: () => {
          return contractList.data;
        }
      },
      getContractById: {
        loader: () => {
          return contractList.data.pageData[0];
        }
      }
    },
    ats: {
      getTrackingList: {
        loader: () => {
          return astUserList.data;
        }
      }
    },
    position: {
      getMyList: {
        loader: () => {
          return positionList.data;
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
};

export default preset;
