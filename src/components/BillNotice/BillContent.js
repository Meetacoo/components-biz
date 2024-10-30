import RemoteLoader, { createWithRemoteLoader } from '@kne/remote-loader';
import Fetch from '@kne/react-fetch';
import FormatDocumentBuilder from '@kne/format-document-builder';
import '@kne/format-document-builder/dist/index.css';
import { forwardRef } from 'react';
import { Button } from 'antd';
import dayjs from 'dayjs';
import templateRenders from './template';

const BillContent = createWithRemoteLoader({
  modules: ['components-core:Global@usePreset', 'components-core:FormInfo@fields', 'components-core:FormInfo@Form']
})(
  forwardRef(({ remoteModules, data: initData, ...others }, ref) => {
    const [usePreset, fields, Form] = remoteModules;
    const { apis, ajax } = usePreset();
    const { SuperSelect } = fields;
    return (
      <Fetch
        loader={async () => {
          const [companyList, bankList] = await Promise.all([
            ajax(Object.assign({}, apis.contract.getSubjectList)).then(({ data }) => {
              if (data.code !== 0) {
                throw new Error(data.msg);
              }
              return data.data;
            }),
            ajax(Object.assign({}, apis.contract.getBankData)).then(({ data }) => {
              if (data.code !== 0) {
                throw new Error(data.msg);
              }
              return data.data;
            })
          ]);

          return { companyList: companyList.filter(item => item.citable), bankList };
        }}
        render={({ data: { companyList, bankList } }) => {
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
                  default: companyList[0],
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
                      options: companyList,
                      open: isActive,
                      inputRender: (inputProps, { value, ...props }) => {
                        return <div dangerouslySetInnerHTML={{ __html: templateRenders.renderCompany((value && value[0]) || companyList[0]) }} />;
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
                  default: initData.clientName || '请输入客户名称',
                  type: 'Input',
                  width: '300px',
                  height: '32px',
                  canEdit: false,
                  canDelete: true
                },
                clientNum: {
                  className: 'selected-client-num',
                  default: initData.clientNum || '请输入客户号',
                  type: 'TextArea',
                  width: '200px',
                  typeProps: () => ({
                    maxLength: 20
                  })
                },
                clientNameChinese: {
                  className: 'selected-client-name-chinese',
                  default: initData.clientName || '请输入客户中文名',
                  type: 'TextArea',
                  width: '200px'
                },
                clientNameEnglish: {
                  className: 'selected-client-name-english',
                  default: initData.clientName || '请输入客户英文名',
                  type: 'Input',
                  width: '300px',
                  height: '32px'
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
                  default: bankList[0],
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
                      options: bankList,
                      open: isActive,
                      inputRender: (inputProps, { value, ...props }) => {
                        return <div dangerouslySetInnerHTML={{ __html: templateRenders.renderBankInfo((value && value[0]) || bankList[0]) }} />;
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
                attention: {
                  className: 'selected-attention',
                  default: '',
                  type: 'Select',
                  width: '100px',
                  options: [
                    { label: '1', value: 1 },
                    { label: '2', value: 2 }
                  ],
                  render: value => (value ? `${value}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` : '请选择Attention')
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
                },
                onboardDate: {
                  className: 'selected-onboard-date',
                  type: 'DatePicker',
                  isArray: true,
                  default: '',
                  typeProps: ({ isActive, blur }) => ({
                    bordered: false,
                    open: isActive,
                    format: 'YYYY-MM-DD',
                    onChange: () => {
                      blur();
                    }
                  }),
                  width: '120px',
                  render: value => {
                    return value ? value.map(item => (item ? dayjs(item).format('YYYY-MM-DD') : '请选择日期')) : [];
                  }
                }
              }}
              template={({ data, options }) => templateRenders.renderPage(Object.assign({}, initData, data), options)}
            />
          );
        }}
      />
    );
  })
);

export default BillContent;
