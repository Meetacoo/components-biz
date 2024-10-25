const CONTRACT_STATE_ENUM = [
  { value: 1, description: '待提交审核', type: 'info' },
  {
    value: 2,
    description: '审核中',
    type: 'progress'
  },
  { value: 3, description: '已撤销', type: 'default' },
  {
    value: 4,
    description: '审核拒绝',
    type: 'danger'
  },
  { value: 5, description: '审核通过', type: 'success' },
  {
    value: 6,
    description: '审核拒绝合同副本',
    type: 'danger'
  },
  { value: 7, description: '已过期', type: 'default' },
  {
    value: 8,
    description: '续签审核中',
    type: 'progress'
  },
  { value: 9, description: '续签审核拒绝', type: 'danger' },
  {
    value: 10,
    description: '续签审核通过',
    type: 'success'
  }
];

export default CONTRACT_STATE_ENUM;
