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
    'components-core:FormInfo@fields',
    'components-core:FormInfo@Form',
    'components-core:Global@useGlobalContext',
    'components-core:InfoPage@formatView'
  ]
})(
  forwardRef(({ remoteModules, data: initData, ...others }, ref) => {
    const [fields, Form, useGlobalContext, formatView] = remoteModules;
    const { SuperSelect } = fields;
    const { global } = useGlobalContext('accountInfo');
    const { userInfo, organization } = global;

    const noticeData = useMemo(
      () =>
        initData
          ? billNoticeTransform.input({
              initData,
              userInfo,
              organization,
              formatView
            })
          : null,
      [initData, userInfo, organization, formatView]
    );

    return (
      <FormatDocumentBuilder
        fields={{ SuperSelect }}
        formRender={props => <Form {...props} />}
        {...others}
        ref={ref}
        data={{
          subjectCode: {
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
          clientName: {
            className: 'selected-client-name',
            default: get(noticeData, 'billNotice.clientName') || '',
            type: 'Input',
            width: '300px',
            height: '32px',
            render: value => value || '请输入客户名称',
            canEdit: false
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
          consultant: {
            className: 'selected-consultant',
            default: get(noticeData, 'billNotice.consultant'),
            type: 'Input',
            canEdit: false
          },
          team: {
            className: 'selected-team',
            default: get(noticeData, 'billNotice.team'),
            type: 'TextArea',
            width: '240px',
            canEdit: false,
            canDelete: true
          },
          noticeDate: {
            className: 'selected-date',
            type: 'DatePicker',
            default: get(noticeData, 'billNotice.noticeDate'),
            typeProps: ({ isActive, blur }) => ({
              bordered: false,
              open: isActive,
              format: 'YYYY-MM-DD',
              onChange: () => {
                blur();
              }
            }),
            width: '150px',
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
                      dangerouslySetInnerHTML={{ __html: templateRenders.renderBankInfo((value && value[0]) || get(noticeData, 'bankInfoList')) }}
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
          clientAddress: {
            className: 'selected-address',
            default: get(noticeData, 'billNotice.clientAddress') || null,
            type: 'SuperSelect',
            width: '100px',
            options: get(noticeData, 'addressList'),
            canDelete: true,
            render: value => value || '请选择地址',
            typeProps: ({ isActive, blur }) => ({
              interceptor: 'object-output-value',
              open: isActive,
              showSelectedTag: false,
              onOpenChange: () => {
                blur();
              },
              single: true,
              label: 'clientAddress',
              labelHidden: true
            })
          },
          attention: {
            className: 'selected-attention',
            default: get(noticeData, 'billNotice.attention'),
            type: 'SuperSelect',
            width: '100px',
            render: value =>
              value
                ? `${typeof billNoticeTransform.getJsonValue(value) === 'object' ? billNoticeTransform.getJsonValue(value).name : value}`
                : '请选择Attention',
            canDelete: true,
            typeProps: ({ formApi, isActive, blur }) => ({
              interceptor: 'object-output-value',
              open: isActive,
              showSelectedTag: false,
              onOpenChange: () => {
                blur();
              },
              onChange: value => {
                formApi.setField({
                  name: 'contactMobile',
                  value: value ? Object.assign({}, value, { label: billNoticeTransform.getJsonValue(value?.value)?.phone }) : null
                });
              },
              single: true,
              options: get(noticeData, 'contactList'),
              label: 'Attention',
              labelHidden: true
            })
          },
          contactMobile: {
            className: 'selected-contact',
            default: get(noticeData, 'billNotice.contactMobile'),
            type: 'SuperSelect',
            width: '130px',
            render: value =>
              value
                ? `${typeof billNoticeTransform.getJsonValue(value) === 'object' ? billNoticeTransform.getJsonValue(value).phone : value}`
                : '请选择Contract',
            canDelete: true,
            typeProps: ({ formApi, isActive, blur }) => ({
              interceptor: 'object-output-value',
              open: isActive,
              showSelectedTag: false,
              onOpenChange: () => {
                blur();
              },
              single: true,
              options: get(noticeData, 'contactMobileList'),
              onChange: value => {
                formApi.setField({
                  name: 'attention',
                  value: value ? Object.assign({}, value, { label: billNoticeTransform.getJsonValue(value?.value)?.name }) : null
                });
              },
              label: 'Contract',
              labelHidden: true
            })
          },
          contact: {
            className: 'selected-contact',
            default: get(noticeData, 'billNotice.contact'),
            type: 'Input',
            canEdit: false
          },
          phone: {
            className: 'selected-phone',
            default: get(noticeData, 'billNotice.phone'),
            type: 'Input',
            canEdit: false
          },
          email: {
            className: 'selected-email',
            default: get(noticeData, 'billNotice.email'),
            type: 'Input',
            canEdit: false
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
        template={({ data, options }) => templateRenders.renderPage(Object.assign({}, noticeData, data), options)}
      />
    );
  })
);

export default BillContent;
