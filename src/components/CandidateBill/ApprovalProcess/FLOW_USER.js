import get from 'lodash/get';

const FLOW_USER = value => {
  const result = (get(value, 'nodeList') || []).every(item => {
    return item.userId && item.userId.length > 0;
  });

  return {
    result,
    errMsg: '请先完善审批流程信息'
  };
};

export default FLOW_USER;
