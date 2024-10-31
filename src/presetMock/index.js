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
import companyData from './companyData.json';
import bankData from './bankData.json';

const billInfo = {
  bankInfoOperation: 'xxxx',
  totalAmount: '1000',
  projects: [
    {
      id: 223,
      noticeId: 122,
      projectTypeId: 7,
      projectType: '入职到岗',
      costType: 1,
      amount: 1900000,
      num: null,
      projectAttachments: null
    },
    {
      id: 223,
      noticeId: 122,
      projectTypeId: 7,
      projectType: '入职到岗',
      costType: 1,
      amount: 1900000,
      num: null,
      projectAttachments: null
    }
  ],
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
};

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
        loader: () => {
          return billInfo;
        }
      },
      saveBill: {
        loader: () => {
          return billInfo;
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
          return paymentList.data.pageData[0];
        }
      }
    }
  }
};

export { projectList, contractDetail, contractList, astUserList, positionList, paymentList, billList, billDetail, companyData, bankData, billInfo };

export default preset;
