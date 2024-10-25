import { createWithRemoteLoader } from '@kne/remote-loader';
import { Flex, Typography } from 'antd';
import get from 'lodash/get';
import merge from 'lodash/merge';
import ContractTerm from '../ContractTerm';

const Basic = createWithRemoteLoader({
  modules: [
    'components-core:InfoPage',
    'components-core:InfoPage@CentralContent',
    'components-core:Enum',
    'components-core:Modal@ModalButton',
    'components-core:Global@usePreset',
    'components-core:File@FileLink'
  ]
})(({ remoteModules, data }) => {
  const [InfoPage, CentralContent, Enum, ModalButton, usePreset, FileLink] = remoteModules;
  const { apis } = usePreset();
  return (
    <InfoPage.Part title="合同基本信息">
      <CentralContent
        dataSource={data}
        columns={[
          {
            name: 'contractClauseId',
            title: '选择审核通过的合同条款',
            block: true,
            render: value => {
              return (
                <Flex gap={8}>
                  <span>{get(data, 'contractClauseName') || '-'}</span>
                  <ModalButton
                    api={merge({}, apis.contract.getContractTerm, { params: { id: value } })}
                    type="link"
                    className="btn-no-padding"
                    modalProps={({ data }) => {
                      return {
                        title: '合同条款',
                        children: <ContractTerm data={data} />
                      };
                    }}
                  >
                    预览
                  </ModalButton>
                </Flex>
              );
            }
          },
          {
            name: 'name',
            title: '合同名称'
          },
          {
            name: 'clientName',
            title: '客户',
            render: value => <Typography.Link onClick={() => window.open(`/client/${data.clientId}`)}>{value}</Typography.Link>
          },
          {
            name: 'contractType',
            title: '合同类型',
            render: value => (
              <Enum moduleName="contractServiceType">
                {data => {
                  return (value || [])
                    .map(it => {
                      const item = (data || []).find(x => x.value === it);
                      return get(item, 'description') || '';
                    })
                    .join('，');
                }}
              </Enum>
            )
          },
          {
            name: 'contractNature',
            title: '合同性质',
            render: value => <Enum moduleName="contractNature" name={value} />
          },
          {
            name: 'subjectCode',
            title: '签约主体',
            block: true,
            render: value => <Enum moduleName="SUBJECT_ENUM" name={value} />
          },
          {
            name: 'startDate',
            title: '合同起始时间',
            format: 'date'
          },
          {
            name: 'endDate',
            title: '合同结束时间',
            format: 'date'
          },
          {
            name: 'paymentPeriod',
            title: '账期',
            render: value => `${value}天`
          },
          {
            name: 'guaranteePeriod',
            title: '保证期',
            getValueOf: data => `${get(data, 'guaranteePeriod') || '0'}`,
            render: value => (
              <>
                {value}
                <Enum moduleName="contractPeriodUnitEnum" name={data.guaranteePeriodUnit || 'D'} />
              </>
            )
          },
          {
            name: 'taxPayer',
            title: '税费承担方',
            render: value => <Enum moduleName="contractTaxPayerEnum" name={value} />
          },
          {
            name: 'clientTaxRate',
            title: '客户承担税率',
            display: (value, { dataSource }) => get(dataSource, 'taxPayer') === 2,
            render: value => `${value}%`,
            placeholder: '0%'
          },
          {
            name: 'weatherRefund',
            title: '有无退款',
            render: value => (value === 1 ? '有' : '无')
          },
          {
            display: get(data, 'weatherRefund') === 1,
            name: 'refundRate',
            title: '退款比例（%）',
            render: value => `${value}%`,
            placeholder: '0%'
          },
          {
            name: 'refundClause',
            title: '退款条款'
          },
          {
            name: 'annualEstimatedGp',
            title: '年预估GP(万元)',
            format: 'number--1000000'
          },
          {
            name: 'weatherHirePurchase',
            title: '是否分期',
            block: true,
            render: value => (value === 1 ? '是' : '否')
          },
          {
            name: 'installmentRate',
            title: '分期比例',
            block: true,
            render: value => {
              return value.map((item, index) => {
                return (
                  <Flex key={index}>
                    第<span>{item.num}</span>期，付款比例为<span>{item.rate}%</span>
                  </Flex>
                );
              });
            }
          },
          {
            name: 'autoRenew',
            title: '自动延期',
            render: value => <Enum moduleName="contractAutoReNewEnum" name={value} />
          },
          {
            display: data.autoRenew === 1,
            name: 'renewalDuration',
            title: '延期时长',
            block: true,
            getValueOf: data =>
              data.unlimitedFlag === 'Y' ? '无限自动延期' : get(data, 'renewalDuration') ? `${get(data, 'renewalDuration')}年` : ''
          },
          {
            name: 'candidateForbidden',
            title: '客户是否禁止在系统录入候选人信息',
            block: true,
            render: value => <Enum moduleName="contractForbidEnum" name={value} />
          },
          {
            display: !!get(data, 'candidateForbidden'),
            name: 'protocolDesc',
            title: '相关协议说明'
          },
          {
            name: 'attachmentIds',
            title: '附件',
            block: true,
            render: value => value.map((item, index) => <FileLink key={index} originName={item.originalName} id={item.id} />)
          }
        ]}
      />
    </InfoPage.Part>
  );
});

export default Basic;
