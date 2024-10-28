import get from 'lodash/get';

const getAmount = (formatView, amount) => {
  return amount ? formatView(amount, 'number--100-useGrouping:false') : null;
};

const getUserName = ({ userMap, user, withOrg = true }) => {
  let name = '';
  let org = '';
  if (userMap) {
    name = get(user, 'uid') ? `${get(userMap.get(user.uid), 'englishName', '')} ${get(userMap.get(user.uid), 'name', '')}` : '';
    org = get(user, 'uid') && get(userMap.get(user.uid), 'orgName', '') ? ' - ' + get(userMap.get(user.uid), 'orgName', '') : '';
  } else if (user) {
    name = `${get(user, 'englishName', '')} ${get(user, 'name', '')}`;
    org = `${get(user, 'orgName') ? ' - ' + get(user, 'orgName') : ''}`;
  }
  return withOrg ? name + org : name;
};

const allocationFormat = ({ userMap, item, formatView, billAmount }) => {
  return {
    // uid: get(item,  'uid'),
    uid: { label: getUserName({ userMap, user: item }), value: get(item, 'uid') },
    amount: getAmount(formatView, item.amount),
    amountPercent: item.amount && billAmount ? formatView(item.amount / billAmount, 'number-percent') : null
  };
};

const billTransform = {
  input: (data, formatView) => {
    const bill = get(data, 'bill') || {};
    const userMap = new Map((get(data, 'userInfos') || []).map(item => [item.uid, item]));
    let inputData = Object.assign({}, bill, {
      contractId: { label: get(bill, 'contractName'), value: get(bill, 'contractId') },
      amount: getAmount(formatView, get(bill, 'amount')),
      allocations: (get(data, 'allocations') || []).map(item => allocationFormat({ userMap, item, formatView, billAmount: get(bill, 'amount') })),
      paymentId: { label: get(bill, 'invoiceTitle'), value: get(bill, 'paymentId') },
      projectId: get(bill, 'projectId') ? { label: get(bill, 'projectName'), value: get(bill, 'projectId') } : null
    });
    // 为候选人账单时
    if (get(bill, 'type') === 1) {
      const billItems = (get(data, 'billItems') || []).map(({ billItem, trackingList }) =>
        Object.assign({}, billItem, {
          amount: get(billItem, 'amount') ? getAmount(formatView, billItem.amount) : 0,
          typeId: get(billItem, 'typeId') || 1,
          trackingList
        })
      );
      inputData.billItems = billItems;
    } else {
      inputData.typeId = get(data, 'billItems[0].billItem.typeId');
      inputData.trackingList = get(data, 'billItems[0].trackingList');
    }
    console.log('inputData===', inputData, get(data, 'billItems') || []);
    return inputData;
  },
  getUserName
};

export default billTransform;
