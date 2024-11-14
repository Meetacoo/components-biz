import { EditBillProjectButton } from './GenerateProjectBill';
import { EditBillButton } from './GenerateBill';
import merge from 'lodash/merge';
import get from 'lodash/get';
import downloadBlobFile from '@hkyhy/customize-file-retrieval/downloadBlobFile';

const cantEditInvoiceState = [2, 5, 7, 8, 9, 10, 14, 18];

const getButtonList = ({ bill, hasBillEditAuth, hasBillExportAuth, ajax, apis, onSuccess, message }) => {
  // 账单未开票时，账单状态为<待提交审核>、<审核拒绝>、<撤销审核>时，可【编辑账单】
  const notEditState = !(!get(bill, 'invoiceList.length') && [2, 5].indexOf(get(bill, 'state')) < 0);
  // 当账单审核通过时，开票状态为<开票审核中>、<待财务开票>、<已开票待发出>、<已发出待收款>、<部分到款>、<全部到款>、<停止开票审核中>、<退票审核中>时不可编辑账单
  const notEditInvoiceState =
    get(bill, 'state') === 5 && (get(bill, 'invoiceList') || []).some(({ state }) => cantEditInvoiceState.indexOf(state) > -1);
  const editDisabled = !hasBillEditAuth || notEditState || notEditInvoiceState;
  const isInReviewState = get(bill, 'state') === 2;
  const notDownloadState = get(bill, 'state') !== 5;
  const downloadDisabled = !hasBillEditAuth || notDownloadState;

  return [
    {
      type: 'primary',
      buttonComponent: get(bill, 'type') === 1 ? EditBillProjectButton : EditBillButton,
      children: '编辑账单',
      id: get(bill, 'id'),
      /**
       * TODO 结算中心拿账单是否开票、预提及其状态
       * 不能编辑账单：
       * 1. 无账单编辑权限
       * 2. 账单未开票时，账单状态为审核中、已通过 notEditState
       * 3. 当账单审核通过时，账单可编辑的前置条件取决于开票状态（不考虑预提状态）
       *    a. 一次性开票：开票状态：<开票审核中>、<待财务开票>、<已开票待发出>、<已发出待收款>、<部分到款>、<全部到款>、<停止开票审核中>、<退票审核中>
       *    b. 分期开票：任一期开票状态为<开票审核中>、<待财务开票>、<已开票待发出>、<已发出待收款>、<部分到款>、<全部到款>、<停止开票审核中>、<退票审核中>
       */
      disabled: editDisabled,
      tooltipProps: editDisabled
        ? {
            title: !hasBillExportAuth ? '没有编辑账单权限' : notEditInvoiceState ? '账单已开票，不可编辑' : '账单状态不可编辑'
          }
        : null,
      onSuccess,
      // 审核中不展示编辑
      hidden: isInReviewState
    },
    {
      children: '撤销审核',
      confirm: true,
      isDelete: false,
      message: '您确定要撤销审核吗？',
      // 无账单编辑权限、账单状态不为审核中时不能编辑账单
      hidden: !hasBillEditAuth || !isInReviewState,
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
      disabled: downloadDisabled,
      tooltipProps: downloadDisabled
        ? {
            title: !hasBillExportAuth ? '没有下载账单权限' : notDownloadState ? '账单审核通过后可下载账单，当前状态不可下载' : null
          }
        : null,
      onClick: async () => {
        if (get(bill, 'pdfAttachment.id')) {
          const { data: urlData } = await ajax(merge({}, apis.oss, { params: { id: get(bill, 'pdfAttachment.id') } }));
          downloadBlobFile(urlData?.data, `${get(bill, 'pdfAttachment.originalName')}`);
        }
      }
    }
  ];
};

export default getButtonList;
