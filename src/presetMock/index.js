import { CONTRACT_STATE_ENUM } from '@components/ContractSelect';
import { BILL_STATE_ENUM, BILL_EVENT_ENUM, INVOICE_STATE_ENUM } from '@components/CandidateBill';
import { getPublicPath } from '@kne/remote-loader';
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
import trackingBillState from './trackingBillState.json';
import addBill from './addBill.json';
import accountInfo from './accountInfo.json';
import projectDetailInfo from './projectDetailInfo.json';

const noticeInfo = addBill.data.notice;

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
  accountInfo: {
    email: 'fuling@165.com',
    phone: '18888888888',
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
    BILL_EVENT_ENUM,
    CONTRACT_STATE_ENUM,
    INVOICE_STATE_ENUM,
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
    oss: {
      loader: async ({ params }) => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(getPublicPath('components-biz') + '/mock/xasdXsdgszxq-Zsdsrw.png');
          }, 1000);
        });
      }
    },
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
      },
      // 撤销审批
      approvalRepeal: {
        loader: () => {}
      },
      // 审批操作
      approvalAudit: {
        loader: () => {}
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
          return addBill.data;
        }
      },
      updateBill: {
        loader: () => {
          return addBill.data;
        }
      },
      saveBillNotice: {
        loader: () => {}
      },
      getTrackingBillState: {
        loader: () => trackingBillState
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
      getContractProjectList: {
        loader: () => {
          return projectList.data;
        }
      },
      getContractProjectDetail: {
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
      getList: {
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
  },
  global: {
    accountInfo
  },
  formInfo: {
    rules: {
      BILL_ALLOCATIONS_SUMMARY: (value, type, { data: formData }) => {
        const format = val => {
          return new Intl.NumberFormat(
            {},
            {
              maximumFractionDigits: 2,
              useGrouping: false
            }
          ).format(val);
        };
        const sum = (formData.allocations || []).reduce((prev, item) => +(prev || 0) + +(item.amount || 0), 0);
        const totalAmount =
          type === 'project' ? formData.billItems.reduce((prev, cur) => +(prev || 0) + +(cur.amount || 0), 0) : +(formData.amount || 0);
        if (sum !== totalAmount) {
          return {
            result: false,
            errMsg: sum > totalAmount ? `分配金额合计不可超过${totalAmount}` : `还剩${format(totalAmount - sum)}金额未分配`
          };
        }
        return {
          result: true
        };
      }
    }
  }
};

export {
  projectList,
  contractDetail,
  contractList,
  astUserList,
  positionList,
  paymentList,
  billList,
  billDetail,
  companyData,
  bankData,
  billInfo,
  noticeInfo,
  projectDetailInfo
};

export default preset;
