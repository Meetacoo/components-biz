import get from 'lodash/get';
import dayjs from 'dayjs';

const getContactItem = item => {
  return JSON.stringify({
    id: item.id,
    name: item.name,
    phone: item?.phoneOfPerson?.number || item?.phoneOfWork?.number || item.phoneOfLandline
  });
};

const getJsonValue = str => {
  if (typeof str == 'string') {
    try {
      return JSON.parse(str);
    } catch (e) {
      return false;
    }
  }
};

const billNoticeTransform = {
  input: ({ initData, userInfo, organization, formatView }) => {
    const { billNotice, contactList, addressList, itemList, bankInfoList } = initData;
    let projectsTemp = [];
    (itemList || []).forEach(item => {
      if (item.trackingList?.length) {
        const trackingIdList = item.trackingList.map(listItem => {
          const onboardDate = listItem?.joinedTime || listItem?.expectedJoinDate;
          return Object.assign(
            {},
            listItem,
            { typeName: item.billItem.typeName },
            {
              amount: item.trackingList.length === 1 ? formatView(get(item, 'billItem.amount'), 'number--100') : '',
              onboardDate: onboardDate ? dayjs(onboardDate).format('YYYY-MM-DD') : null,
              type: 'trackingList'
            }
          );
        });
        projectsTemp = [...projectsTemp, ...trackingIdList];
      } else {
        projectsTemp.push(
          Object.assign({}, item.billItem, {
            amount: formatView(get(item, 'billItem.amount'), 'number--100')
          })
        );
      }
    });
    const contractList = (contactList || []).map(item => ({ label: item.name, value: getContactItem(item) }));
    const contactMobileList = (contactList || []).map(item => ({
      label: item?.phoneOfPerson?.number || item?.phoneOfWork?.number || item.phoneOfLandline,
      value: getContactItem(item)
    }));
    return Object.assign({}, initData, {
      billNotice: Object.assign({}, billNotice, {
        clientNum: get(billNotice, 'clientNum') || '',
        clientEnName: get(billNotice, 'clientEnName') || '',
        clientAddress: get(billNotice, 'address') || get(addressList, '[0]') || '',
        attention: get(billNotice, 'attention') || get(contractList, '[0].value') || '',
        contactMobile: get(billNotice, 'contactMobile') || get(contractList, '[0].value') || '',
        consultant: get(billNotice, 'consultant') || `${userInfo.englishName || ''} ${userInfo.name || ''}`,
        team: billNotice?.team || organization?.name,
        contact: get(billNotice, 'contact') || `${userInfo.englishName || ''} ${userInfo.name || ''}`,
        phone: get(billNotice, 'phone') || userInfo.phone || '',
        email: get(billNotice, 'email') || userInfo.email || '',
        bankInfo: get(billNotice, 'bankInfo') || get(bankInfoList, '[0]') || null
      }),
      totalFee: formatView(get(initData, 'totalFee'), 'number--100'),
      itemList: projectsTemp,
      addressList: addressList?.length ? addressList.map(item => ({ label: item, value: item })) : null,
      subjectList: get(initData, 'subjectList').filter(item => item.citable),
      contactList: contractList,
      contactMobileList: contactMobileList
    });
  },
  output: data => {
    const outputData = Object.assign({}, data, {
      noticeDate: get(data, 'noticeDate'),
      subjectCode: get(data, 'subjectCode.code'),
      attention:
        typeof billNoticeTransform.getJsonValue(get(data, 'attention')) === 'object'
          ? billNoticeTransform.getJsonValue(get(data, 'attention')).name
          : null,
      contactMobile:
        typeof billNoticeTransform.getJsonValue(get(data, 'contactMobile')) === 'object'
          ? billNoticeTransform.getJsonValue(get(data, 'contactMobile')).phone
          : null
    });
    return outputData;
  },
  getJsonValue
};

export default billNoticeTransform;
