import get from 'lodash/get';
import { billTransform } from '../index';
import CandidatesTooltip from './CandidatesTooltip';

const getColumns = ({ formatView, hasPositionAuth, hasTalentAuth }) => {
  return [
    {
      name: 'serialNumber',
      title: '账单编号',
      type: 'serialNumber',
      primary: true,
      hover: true,
      fixed: 'left',
      onClick: ({ colItem }) => {
        window.open(`/bill-center/${get(colItem, 'id')}`, '_blank');
      }
    },
    {
      name: 'typeNames',
      title: '账单类目',
      type: 'otherSmall',
      valueOf: ({ typeNames }) => (typeNames ? typeNames.join('，') : null)
    },
    {
      name: 'amount',
      title: '账单总金额',
      type: 'other',
      valueOf: ({ amount }) => formatView(amount, 'number--100')
    },
    {
      name: 'state',
      title: '账单状态',
      type: 'tag',
      valueOf: ({ state }) => ({
        isEnum: true,
        name: state,
        moduleName: 'BILL_STATE_ENUM'
      })
    },
    {
      name: 'candidates',
      title: '候选人',
      type: 'mainInfo',
      valueOf: ({ candidates }) => (candidates?.length ? <CandidatesTooltip dataSource={candidates} {...{ hasPositionAuth, hasTalentAuth }} /> : '')
    },
    {
      name: 'clientName',
      title: '客户',
      type: 'mainInfo',
      onClick: ({ colItem }) => {
        window.open(`/client/${get(colItem, 'clientId')}`, '_blank');
      }
    },
    {
      name: 'preInvoiceAmount',
      title: '已预提金额',
      type: 'serialNumberShort',
      valueOf: ({ preInvoiceAmount }) => formatView(preInvoiceAmount, 'number--100')
    },
    {
      name: 'invoicedAmount',
      title: '已开票金额',
      type: 'serialNumberShort',
      valueOf: ({ invoicedAmount }) => formatView(invoicedAmount, 'number--100')
    },
    {
      name: 'paidAmount',
      title: '已到款金额',
      type: 'serialNumberShort',
      valueOf: ({ paidAmount }) => formatView(paidAmount, 'number--100')
    },
    {
      name: 'uid',
      title: '添加人',
      type: 'user',
      render: ({ data }) => ({
        valueOf: ({ uid }) => {
          return billTransform.getUserName({ userMap: get(data, 'userMap'), user: { uid }, withOrg: false });
        }
      })
    },
    {
      title: '添加时间',
      groupName: '其他',
      name: 'createdAt',
      type: 'datetime'
    }
  ];
};

export default getColumns;
