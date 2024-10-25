import dayjs from 'dayjs';

const getFormData = ({ paymentNoticePro, paymentPdf }) => {
  return {
    clientName: {
      className: 'selected-client-name',
      default: paymentPdf.clientName || '请输入客户名称',
      type: 'Input',
      width: '300px',
      height: '32px',
      canEdit: false,
      canDelete: true
    },
    clientNum: {
      className: 'selected-client-num',
      default: paymentPdf.clientNum || '请输入客户号',
      type: 'TextArea',
      width: '200px',
      typeProps: () => ({
        maxLength: 20
      })
    },
    clientNameChinese: {
      className: 'selected-client-name-chinese',
      default: paymentPdf.clientName || '请输入客户中文名',
      type: 'TextArea',
      width: '200px'
    },
    clientNameEnglish: {
      className: 'selected-client-name-english',
      default: paymentPdf.clientName || '请输入客户英文名',
      type: 'Input',
      width: '300px',
      height: '32px'
    },
    date: {
      className: 'selected-date',
      type: 'DatePicker',
      typeProps: ({ isActive, blur }) => ({
        bordered: false,
        open: isActive,
        format: 'YYYY-MM-DD',
        onChange: () => {
          blur();
        }
      }),
      width: '200px',
      render: value => {
        return value ? dayjs(value).format('YYYY-MM-DD') : '请选择日期';
      }
    },
    bankInfoOperation: {
      className: 'selected-bank-info-operation',
      default: (paymentNoticePro.bankInfo || []).length ? paymentNoticePro.bankInfo[0].bankNo : '',
      type: 'Select',
      width: '320px',
      canEdit: false,
      options: paymentNoticePro.bankInfo || [],
      fieldNames: { label: 'bankName', value: 'bankNo' },
      typeProps: ({ formApi }) => ({
        onChange: value => {
          const { openApi } = formApi;
          openApi.setField({
            name: 'bankInfo',
            value: paymentNoticePro.bankInfo.find(item => item.bankNo === value)
          });
        }
      })
    },
    bankInfo: {
      className: 'selected-bank-info',
      default: paymentNoticePro.bankInfo[0],
      type: 'Input',
      canEdit: false
    },
    attention: {
      className: 'selected-attention',
      default: '',
      type: 'Select',
      width: '100px',
      options: [
        { label: '1', value: 1 },
        { label: '2', value: 2 }
      ],
      render: value => (value ? `${value}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` : '请选择Attention')
    },
    remark: {
      className: 'selected-remark',
      default: paymentPdf.remark || '',
      type: 'TextArea',
      width: '130px',
      typeProps: () => ({
        maxLength: 200,
        autocomplete: 'off'
      }),
      render: value => value || '请添加备注'
    },
    onboardDate: {
      className: 'selected-onboard-date',
      type: 'DatePicker',
      isArray: true,
      default: paymentPdf.noticeDate || '',
      typeProps: ({ isActive, blur }) => ({
        bordered: false,
        open: isActive,
        format: 'YYYY-MM-DD',
        onChange: () => {
          blur();
        }
      }),
      width: '120px',
      render: value => {
        return value ? value.map(item => (item ? dayjs(item).format('YYYY-MM-DD') : '请选择日期')) : [];
      }
    }
  };
};

export default getFormData;
