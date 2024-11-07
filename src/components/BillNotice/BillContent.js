import { forwardRef, useMemo } from 'react';
import RemoteLoader, { createWithRemoteLoader } from '@kne/remote-loader';
import Fetch from '@kne/react-fetch';
import FormatDocumentBuilder from '@kne/format-document-builder';
import '@kne/format-document-builder/dist/index.css';
import { Button } from 'antd';
import dayjs from 'dayjs';
import templateRenders from './template';
import get from 'lodash/get';

const getContactItem = item => {
  return JSON.stringify({
    id: item.id,
    name: item.name,
    phone: item?.phoneOfPerson?.number || item?.phoneOfWork?.number || item.phoneOfLandline
  });
};

export const getJsonValue = str => {
  if (typeof str == 'string') {
    try {
      return JSON.parse(str);
    } catch (e) {
      return false;
    }
  }
};

const BillContent = createWithRemoteLoader({
  modules: [
    'components-core:Global@usePreset',
    'components-core:FormInfo@fields',
    'components-core:FormInfo@Form',
    'components-core:Global@useGlobalContext',
    'components-core:InfoPage@formatView'
  ]
})(
  forwardRef(({ remoteModules, data: initData, ...others }, ref) => {
    const [usePreset, fields, Form, useGlobalContext, formatView] = remoteModules;
    const { apis, ajax } = usePreset();
    const { SuperSelect } = fields;
    const { global } = useGlobalContext('accountInfo');
    const { userInfo, organization } = global;
    const { billNotice, bankInfoList, contactList, addressList, itemList } = initData;

    const noticeData = useMemo(() => {
      let projectsTemp = [];
      (itemList || []).forEach(item => {
        if (item.trackingList?.length) {
          const trackingIdList = item.trackingList.map((listItem, index) => {
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
      return Object.assign({}, initData, {
        totalFee: formatView(get(initData, 'totalFee'), 'number--100'),
        itemList: projectsTemp,
        subjectList: get(initData, 'subjectList').filter(item => item.citable)
      });
    }, [initData]);
    return (
      <FormatDocumentBuilder
        fields={{ SuperSelect }}
        formRender={props => <Form {...props} />}
        {...others}
        ref={ref}
        data={{
          company: {
            className: 'selected-company',
            type: 'SuperSelect',
            default: get(noticeData, 'subjectList[0]'),
            canDelete: false,
            editButton: props => {
              return (
                <Button {...props} type="link" style={{ transform: 'translateX(-100%)' }}>
                  切换
                  <RemoteLoader module="components-core:Icon" type="arrow-thin-down" />
                </Button>
              );
            },
            typeProps: ({ isActive, blur }) => {
              return {
                label: '公司名称',
                labelHidden: true,
                isPopup: false,
                single: true,
                labelKey: 'companyName',
                valueKey: 'code',
                options: get(noticeData, 'subjectList'),
                open: isActive,
                inputRender: (inputProps, { value, ...props }) => {
                  return (
                    <div
                      style={{ padding: '3px' }}
                      dangerouslySetInnerHTML={{
                        __html: templateRenders.renderCompany((value && value[0]) || get(noticeData, 'subjectList[0]'))
                      }}
                    />
                  );
                },
                onOpenChange: () => {
                  blur();
                },
                renderItemContent: ({ item }) => {
                  return <div dangerouslySetInnerHTML={{ __html: templateRenders.renderCompany(item) }} />;
                }
              };
            }
          },
          clientName: {
            className: 'selected-client-name',
            default: billNotice.clientName || '请输入客户名称',
            type: 'Input',
            width: '300px',
            height: '32px',
            canEdit: false
          },
          clientNum: {
            className: 'selected-client-num',
            default: billNotice.clientNum || '',
            type: 'TextArea',
            width: '200px',
            typeProps: () => ({
              maxLength: 20
            }),
            render: value => value || '请输入客户号',
            canDelete: true
          },
          clientEnName: {
            className: 'selected-client-name-english',
            default: billNotice.clientEnName || '请输入客户英文名',
            type: 'Input',
            width: '300px',
            height: '32px',
            canDelete: true
          },
          consultant: {
            className: 'selected-consultant',
            default: billNotice?.consultant || `${userInfo.englishName || ''} ${userInfo.name || ''}`,
            type: 'Input',
            canEdit: false
          },
          team: {
            className: 'selected-team',
            default: billNotice?.team || organization?.name,
            type: 'TextArea',
            width: '240px',
            canEdit: false,
            canDelete: true
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
          bankInfo: {
            className: 'selected-bank-info',
            type: 'SuperSelect',
            default: bankInfoList[0],
            canDelete: false,
            editButton: props => {
              return (
                <Button {...props} type="link" style={{ transform: 'translateX(-100%)' }}>
                  切换
                  <RemoteLoader module="components-core:Icon" type="arrow-thin-down" />
                </Button>
              );
            },
            typeProps: ({ isActive, blur }) => {
              return {
                label: '银行信息',
                labelHidden: true,
                isPopup: false,
                single: true,
                labelKey: 'bankName',
                valueKey: 'bankNo',
                options: bankInfoList,
                open: isActive,
                inputRender: (inputProps, { value, ...props }) => {
                  return (
                    <div
                      style={{ padding: '3px' }}
                      dangerouslySetInnerHTML={{ __html: templateRenders.renderBankInfo((value && value[0]) || bankInfoList[0]) }}
                    />
                  );
                },
                onOpenChange: () => {
                  blur();
                },
                renderItemContent: ({ item }) => {
                  return <div dangerouslySetInnerHTML={{ __html: templateRenders.renderBankInfo(item) }} />;
                }
              };
            }
          },
          address: {
            className: 'selected-address',
            default: billNotice.address || addressList?.[0] || '',
            type: 'Select',
            width: '100px',
            options: addressList?.length ? addressList.map(item => ({ label: item, value: item })) : null,
            canDelete: true,
            render: value => value || '请选择地址'
          },
          attention: {
            className: 'selected-attention',
            default: contactList?.length ? getContactItem(contactList?.[0]) : '',
            type: 'Select',
            width: '100px',
            options: contactList.map(item => ({ label: item.name, value: getContactItem(item) })),
            render: value => (value ? `${typeof getJsonValue(value) === 'object' ? getJsonValue(value).name : value}` : '请选择Attention'),
            canDelete: true,
            typeProps: ({ formApi }) => ({
              onChange: value => {
                formApi.setField({ name: 'contactMobile', value });
              },
              api: {
                loader: async () => {
                  return {
                    pageData: contactList.map(item => ({ label: item.name, value: getContactItem(item) }))
                  };
                }
              },
              label: 'Attention',
              labelHidden: true
            })
          },
          contactMobile: {
            className: 'selected-contact',
            default: contactList?.length ? getContactItem(contactList?.[0]) : '',
            type: 'Select',
            width: '130px',
            options: contactList.map(item => ({
              label: item?.phoneOfPerson?.number || item?.phoneOfWork?.number || item.phoneOfLandline,
              value: getContactItem(item)
            })),
            render: value => (value ? `${typeof getJsonValue(value) === 'object' ? getJsonValue(value).phone : value}` : '请选择Attention'),
            canDelete: true,
            typeProps: ({ formApi }) => ({
              onChange: value => {
                formApi.setField({ name: 'attention', value });
              },
              api: {
                loader: async () => {
                  return {
                    pageData: contactList.map(item => ({
                      label: item?.phoneOfPerson?.number || item?.phoneOfWork?.number || item.phoneOfLandline,
                      value: getContactItem(item)
                    }))
                  };
                }
              },
              label: 'Contract',
              labelHidden: true
            })
          },
          remark: {
            className: 'selected-remark',
            default: '',
            type: 'TextArea',
            width: '130px',
            typeProps: () => ({
              maxLength: 200,
              autocomplete: 'off'
            }),
            render: value => value || '请添加备注'
          }
        }}
        template={({ data, options }) => templateRenders.renderPage(Object.assign({}, noticeData, data, userInfo), options)}
      />
    );
  })
);

export default BillContent;
