import { EditBillProjectButton } from './GenerateProjectBill';
import { EditBillButton } from './GenerateBill';
import merge from 'lodash/merge';
import get from 'lodash/get';

const getButtonList = ({ bill, hasBillEditAuth, hasBillExportAuth, ajax, apis, onSuccess, message }) => {
  return [
    {
      type: 'primary',
      buttonComponent: get(bill, 'type') === 1 ? EditBillProjectButton : EditBillButton,
      children: '编辑账单',
      id: get(bill, 'id'),
      // 无账单编辑权限、账单状态为审核中、已通过时，不能编辑账单
      disabled: !hasBillEditAuth || [2, 5].indexOf(get(bill, 'state')) > -1,
      onSuccess: onSuccess
    },
    {
      children: '撤销审核',
      confirm: true,
      isDelete: false,
      message: '您确定要撤销审核吗？',
      // 无账单编辑权限、账单状态不为审核中时不能编辑账单
      disabled: !hasBillEditAuth || get(bill, 'state') !== 2,
      onClick: async () => {
        const { data: resData } = await ajax(merge({}, apis.flow.approvalAudit, { data: { processId: get(bill, 'flowInstanceId'), result: 4 } }));
        if (resData.code !== 0) {
          return false;
        }
        message.success('撤销审核成功');
        onSuccess?.();
      }
    },
    {
      children: '前往结算中心'
    },
    {
      children: '下载账单',
      // 无账单下载权限、账单状态为除审核通过外的其他状态时，不能下载账单
      disabled: !hasBillExportAuth || get(bill, 'state') !== 5
    }
  ];
};

export default getButtonList;
