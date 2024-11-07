import { forwardRef, useMemo } from 'react';
import RemoteLoader, { createWithRemoteLoader } from '@kne/remote-loader';
import FormatDocumentBuilder from '@kne/format-document-builder';
import '@kne/format-document-builder/dist/index.css';
import { Button } from 'antd';
import dayjs from 'dayjs';
import templateRenders from './template';
import get from 'lodash/get';
import billNoticeTransform from './billNoticeTransform';

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
    const { bankInfoList } = initData;

    const noticeData = useMemo(() => billNoticeTransform.input({ initData, userInfo, organization, formatView }), [initData, userInfo, organization]);

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
          clientNum: {
            className: 'selected-client-num',
            default: get(noticeData, 'billNotice.clientNum') || '',
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
            default: get(noticeData, 'billNotice.clientEnName') || '',
            type: 'Input',
            width: '300px',
            height: '32px',
            render: value => value || '请输入客户英文名',
            canDelete: true
          },
          team: {
            className: 'selected-team',
            default: get(noticeData, 'billNotice.team'),
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
            default: get(noticeData, 'bankInfoList[0]'),
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
                options: get(noticeData, 'bankInfoList'),
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
            default: get(noticeData, 'billNotice.address'),
            type: 'Select',
            width: '100px',
            options: get(noticeData, 'addressList'),
            canDelete: true,
            render: value => value || '请选择地址'
          },
          attention: {
            className: 'selected-attention',
            default: get(noticeData, 'billNotice.attention'),
            type: 'Select',
            width: '100px',
            options: get(noticeData, 'contactList'),
            render: value =>
              value
                ? `${typeof billNoticeTransform.getJsonValue(value) === 'object' ? billNoticeTransform.getJsonValue(value).name : value}`
                : '请选择Attention',
            canDelete: true,
            typeProps: ({ formApi }) => ({
              onChange: value => {
                formApi.setField({ name: 'contactMobile', value });
              },
              api: {
                loader: async () => {
                  return {
                    pageData: get(noticeData, 'contactList')
                  };
                }
              },
              label: 'Attention',
              labelHidden: true
            })
          },
          contactMobile: {
            className: 'selected-contact',
            default: get(noticeData, 'billNotice.contactMobile'),
            type: 'Select',
            width: '130px',
            options: get(noticeData, 'contactMobileList'),
            render: value =>
              value
                ? `${typeof billNoticeTransform.getJsonValue(value) === 'object' ? billNoticeTransform.getJsonValue(value).phone : value}`
                : '请选择Attention',
            canDelete: true,
            typeProps: ({ formApi }) => ({
              onChange: value => {
                formApi.setField({ name: 'attention', value });
              },
              api: {
                loader: async () => {
                  return {
                    pageData: get(noticeData, 'contactMobileList')
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
