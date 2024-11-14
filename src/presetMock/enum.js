export const INVOICE_STATE_ENUM = [
  { value: 1, description: '待提交开票', type: 'info' },
  { value: 2, description: '开票审核中', type: 'progress' },
  { value: 3, description: '撤销开票审核', type: 'default' },
  { value: 4, description: '审核拒绝', type: 'danger' },
  { value: 5, description: '待财务开票', type: 'info' },
  { value: 6, description: '停止开票', type: 'default' },
  { value: 7, description: '已开票待发出', type: 'success' },
  { value: 8, description: '已发出待收款', type: 'success' },
  { value: 9, description: '部分到款', type: 'success' },
  { value: 10, description: '全部到款', type: 'success' },
  { value: 14, description: '退票审核中', type: 'progress' },
  { value: 15, description: '已退票', type: 'success' },
  { value: 16, description: '拒绝退票', type: 'danger' },
  { value: 18, description: '停止开票审核中', type: 'danger' },
  { value: 19, description: '存在部分退票', type: 'danger' }
];
