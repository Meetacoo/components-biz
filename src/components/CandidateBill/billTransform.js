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
    uid: { label: getUserName({ userMap, user: item }), value: get(item, 'uid') },
    amount: getAmount(formatView, item.amount),
    amountPercent: item.amount && billAmount ? formatView(item.amount / billAmount, 'number-percent').replace('%', '') : null
  };
};

const transformAllocation = (totalAmount, formatView, formData, openApi) => {
  let allocations = formData.allocations || [];
  if (allocations.length > 0) {
    allocations.forEach((item, index) => {
      if (item.amountPercent > 0) {
        item.amount = formatView((totalAmount || 0) * (item.amountPercent || 0), 'number--100-useGrouping:false');
      } else if (item.amount > 0) {
        item.amountPercent = formatView((item.amount || 0) / (totalAmount || 0), 'number-percent-useGrouping:false');
      }
      openApi.setFields([
        {
          name: 'amount',
          value: item.amount,
          groupName: 'allocations',
          groupIndex: index,
          runValidate: true
        },
        {
          name: 'amountPercent',
          value: item.amountPercent,
          groupName: 'allocations',
          groupIndex: index,
          runValidate: true
        }
      ]);
    });
  }
};

const transformTrackingList = trackingList => {
  return (trackingList || []).map(item =>
    Object.assign({}, item, {
      candidateName: get(item, 'cvName'),
      deliveryPosition: get(item, 'jdName'),
      projectInfo: get(item, 'projectId')
        ? {
            projectId: get(item, 'projectId'),
            projectName: get(item, 'projectName'),
            projectSerialNum: get(item, 'projectSerialNum'),
            projectPrice: get(item, 'projectPrice')
          }
        : null
    })
  );
};

const billTransform = {
  input: (data, formatView) => {
    const bill = get(data, 'bill') || {};
    const userMap = new Map((get(data, 'userInfos') || []).map(item => [item.uid, item]));
    let inputData = Object.assign({}, bill, {
      clientId: { label: get(bill, 'clientName'), value: get(bill, 'clientId') },
      contractId: { label: get(bill, 'contractName'), value: get(bill, 'contractId') },
      amount: getAmount(formatView, get(bill, 'amount')),
      allocations: (get(data, 'allocations') || []).map(item => allocationFormat({ userMap, item, formatView, billAmount: get(bill, 'amount') })),
      paymentId: { label: get(bill, 'invoiceTitle'), value: get(bill, 'paymentId') },
      projectId: get(bill, 'projectId')
        ? { projectName: get(bill, 'projectName'), projectId: get(bill, 'projectId'), projectSerialNum: get(bill, 'projectSerialNum') }
        : null
    });
    // 为项目账单时
    if (get(bill, 'type') === 1) {
      const billItems = (get(data, 'billItems') || []).map(({ billItem, trackingList }) =>
        Object.assign({}, billItem, {
          amount: get(billItem, 'amount') ? getAmount(formatView, billItem.amount) : 0,
          typeId: get(billItem, 'typeId') || 1,
          trackingList: transformTrackingList(trackingList || [])
        })
      );
      inputData.billItems = billItems;
    } else {
      inputData.typeId = get(data, 'billItems[0].billItem.typeId');
      inputData.trackingList = transformTrackingList(get(data, 'billItems[0].trackingList') || []);
    }
    console.log('inputData===', inputData, get(data, 'billItems') || []);
    return inputData;
  },
  output: (data, type, bill) => {
    let billData = {
      id: get(bill, 'bill.id'),
      clientId: get(data, 'clientId.value') || null,
      contractId: get(data, 'contractId.value') || null,
      projectId: get(data, 'projectId.projectId') || null,
      feeType: get(data, 'feeType'),
      amount: (get(data, 'amount') || 0) * 100,
      paymentId: get(data, 'paymentId.value') || null,
      attachments: get(data, 'attachments') || null,
      allocations: (get(data, 'allocations') || []).map(item => ({
        uid: get(item, 'uid.value'),
        amount: (get(item, 'amount') || 0) * 100
      }))
    };
    if (type === 1) {
    } else {
      billData = Object.assign({}, billData, {
        standardAmount: get(data, 'standardAmount') || null,
        amountDiffReason: get(data, 'amountDiffReason') || null,
        remark: get(data, 'remark') || null,
        billItems: [
          {
            billItem: {
              id: get(bill, 'billItems[0].billItem.id') || null,
              billId: get(bill, 'bill.id'),
              typeId: get(data, 'typeId'),
              amount: (get(data, 'amount') || 0) * 100
            },
            trackingIdList: get(data, 'trackingList').map(({ trackingId }) => trackingId)
          }
        ]
      });
    }
    return billData;
  },
  getUserName,
  getAmount,
  transformAllocation
};

export default billTransform;
