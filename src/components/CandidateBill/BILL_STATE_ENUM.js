const BILL_STATE_ENUM = [
  { value: 1, description: '待提交', type: 'info' },
  { value: 2, description: '审核中', type: 'progress' },
  { value: 3, description: '已撤销', type: 'default' },
  { value: 4, description: '审核拒绝', type: 'danger' },
  { value: 5, description: '审核通过', type: 'success' }
];

export default BILL_STATE_ENUM;
