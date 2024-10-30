import { CONTRACT_STATE_ENUM } from '@components/ContractSelect';
import { BILL_STATE_ENUM } from '@components/CandidateBill';
import flow from './flow.json';
import range from 'lodash/range';
import projectList from './projectList.json';
import contractDetail from './contractDetail.json';
import contractList from './contractList.json';
import astUserList from './astUserList.json';
import positionList from './positionList.json';
import paymentList from './paymentList.json';
import billList from './billList.json';
import billDetail from './billDetail.json';
import companyData from '../components/BillNotice/doc/mock/companyData.json';
import bankData from '../components/BillNotice/doc/mock/bankData.json';

const preset = {
  ajax: async api => {
    return { data: { code: 0, data: api.loader() } };
  },
  permissions: ['bill:apply:edit', 'bill:apply:export_notice', 'jd:job:look', 'cv:cv:look'],
  enums: {
    BILL_STATE_ENUM,
    CONTRACT_STATE_ENUM,
    invoiceProjectType: [
      { value: 1, description: 'onsite' },
      { value: 2, description: 'mapping' },
      {
        value: 3,
        description: '项目管理'
      },
      { value: 4, description: '项目启动金' },
      { value: 5, description: '内推' },
      {
        value: 6,
        description: '面试到岗'
      },
      { value: 7, description: '入职到岗' },
      { value: 8, description: '其他' }
    ]
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
    candidateBill: {
      getBillList: {
        loader: async () => billList
      },
      getBillDetail: {
        loader: async () => billDetail
      },
      addBill: {
        loader: () => {}
      },
      saveBill: {
        loader: () => {}
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
      getSubjectList: {
        loader: () => {
          return companyData.data;
        }
      },
      getBankData: {
        loader: () => {
          return bankData.data;
        }
      },
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
