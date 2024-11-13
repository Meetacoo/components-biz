import get from 'lodash/get';
import dayjs from 'dayjs';
import transform from 'lodash/transform';
import { uniqueId } from 'lodash';

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

const nodeListTransform = ({ flowRequest = {}, flowNodes, currentValue, target, flowNo, valueNodeListMap }) => {
  return Object.assign({}, flowRequest, {
    flowNo,
    nodeList: flowNodes.map(flow => {
      const userId = (() => {
        if (!(flow.actionType === 1 && flow.roleType === 3)) {
          return (flow.userList || []).map(item => item.userId);
        }
        if (flow.id === target.id) {
          return currentValue ? [currentValue.value] : null;
        }

        const currentNode = valueNodeListMap.get(flow.id);
        if (!currentNode) {
          return null;
        }
        return currentNode.userId;
      })();
      return Object.assign(
        {},
        transform(
          ['level', 'order', 'actionType', 'roleType', 'userName', 'auditType'],
          (result, name) => {
            result[name] = flow[name];
          },
          {}
        ),
        { userId, nodeId: flow.id }
      );
    })
  });
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
    const attentionList = (contactList || []).map(item => ({ label: item.name, value: getContactItem(item) }));
    const contactMobileList = (contactList || []).map(item => ({
      label: item?.phoneOfPerson?.number || item?.phoneOfWork?.number || item.phoneOfLandline,
      value: getContactItem(item)
    }));
    const deleteFields = get(billNotice, 'deleteFields');
    const clientAddress = get(billNotice, 'address') || get(addressList, '[0]');
    const attention = get(billNotice, 'attention')
      ? attentionList.find(item => item.label === get(billNotice, 'attention'))
      : get(attentionList, '[0]');
    const contactMobile = get(billNotice, 'contactMobile')
      ? contactMobileList.find(item => item.label === get(billNotice, 'contactMobile'))
      : get(contactMobileList, '[0]');
    return Object.assign({}, initData, {
      billNotice: Object.assign({}, billNotice, {
        clientNum: deleteFields && deleteFields.indexOf('clientNum') > -1 ? null : get(billNotice, 'clientNum') || '',
        clientEnName: deleteFields && deleteFields.indexOf('clientEnName') > -1 ? null : get(billNotice, 'clientEnName') || '',
        clientAddress: deleteFields && deleteFields.indexOf('clientAddress') > -1 ? null : { label: clientAddress, value: clientAddress } || null,
        attention: deleteFields && deleteFields.indexOf('attention') > -1 ? null : attention || '',
        contactMobile: deleteFields && deleteFields.indexOf('contactMobile') > -1 ? null : contactMobile || '',
        team: deleteFields && deleteFields.indexOf('team') > -1 ? null : billNotice?.team || organization?.name || '',
        noticeDate: get(billNotice, 'noticeDate') || '',
        consultant: get(billNotice, 'consultant') || `${userInfo.englishName || ''} ${userInfo.name || ''}`,
        contact: get(billNotice, 'contact') || `${userInfo.englishName || ''} ${userInfo.name || ''}`,
        phone: get(billNotice, 'phone') || userInfo.phone || '',
        email: get(billNotice, 'email') || userInfo.email || '',
        bankInfo: get(billNotice, 'bankInfo') || get(bankInfoList, '[0]')
      }),
      totalFee: formatView(get(initData, 'totalFee'), 'number--100'),
      itemList: projectsTemp,
      addressList: addressList?.length ? addressList.map(item => ({ label: item, value: item })) : null,
      subjectList: get(initData, 'subjectList').filter(item => item.citable),
      contactList: attentionList,
      contactMobileList: contactMobileList
    });
  },
  output: data => {
    const deleteFields = get(data, 'deleteFields');
    const deleteFieldsLength = get(deleteFields, 'length');
    return Object.assign({}, data, {
      noticeDate: get(data, 'noticeDate'),
      subjectCode: get(data, 'subjectCode.code'),
      clientNum: deleteFieldsLength && deleteFields.indexOf('clientNum') > -1 ? null : get(data, 'clientNum'),
      clientEnName: deleteFieldsLength && deleteFields.indexOf('clientEnName') > -1 ? null : get(data, 'clientEnName'),
      clientAddress: deleteFieldsLength && deleteFields.indexOf('clientAddress') > -1 ? null : get(data, 'clientAddress'),
      attention:
        deleteFieldsLength && deleteFields.indexOf('attention') > -1
          ? null
          : typeof billNoticeTransform.getJsonValue(get(data, 'attention')) === 'object'
            ? billNoticeTransform.getJsonValue(get(data, 'attention')).name
            : '',
      contactMobile:
        deleteFieldsLength && deleteFields.indexOf('contactMobile') > -1
          ? null
          : typeof billNoticeTransform.getJsonValue(get(data, 'contactMobile')) === 'object'
            ? billNoticeTransform.getJsonValue(get(data, 'contactMobile')).phone
            : '',
      team: deleteFieldsLength && deleteFields.indexOf('team') > -1 ? null : get(data, 'team'),
      fileName: get(data, 'doSubmit') ? uniqueId(`Bill Notice ${new Date().getTime()}`) : null
    });
  },
  nodeListTransform,
  getJsonValue
};

export default billNoticeTransform;
