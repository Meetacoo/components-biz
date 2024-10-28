import { createWithRemoteLoader } from '@kne/remote-loader';
import ProjectSelect from '@components/ProjectSelect';
import ContractSelect from '@components/ContractSelect';
import CandidateSelect from '@components/CandidateSelect';
import { get } from 'lodash';
import BillAllocationForm from '../BillAllocationForm';
import PaymentSelect from '../../PaymentSelect';

const BillInfoFormInner = createWithRemoteLoader({
  modules: ['components-core:FormInfo', 'components-core:FormInfo@formModule']
})(({ remoteModules, record }) => {
  const [FormInfo, formModule] = remoteModules;
  const { FormItem } = formModule;
  const { RadioGroup, MoneyInput, TextArea, Upload, AdvancedSelect } = FormInfo.fields;

  return (
    <>
      <FormInfo
        list={[
          <AdvancedSelect
            name="clientId"
            label="客户"
            single
            allowClear={false}
            showSelectedTag={false}
            disabled
            api={{
              loader: () => ({
                pageData: [{ label: get(record, 'bill.clientName'), value: get(record, 'bill.clientId') }]
              })
            }}
          />,
          <ContractSelect name="contractId" label="合同" rule="REQ" api={{ data: { clientId: get(record, 'bill.clientId'), states: [5, 7] } }} />,
          <RadioGroup
            name="withoutProject"
            rule="REQ"
            hidden
            options={[
              { value: 1, label: '合同有项目' },
              { value: 2, label: '合同没有项目' }
            ]}
          />,
          // 项目账单。合同有项目，显示项目字段
          <FormItem display={({ formData }) => get(formData, 'withoutProject') === 1}>
            {() => <ProjectSelect name="projectId" label="项目" rule="REQ" />}
          </FormItem>,
          <RadioGroup
            name="feeType"
            label="费用类别"
            rule="REQ"
            options={[
              { value: 1, label: '招聘费' },
              { value: 2, label: '服务费' }
            ]}
          />
        ]}
      />
      <FormInfo
        title="账单候选人"
        list={[
          <CandidateSelect
            labelRender={({ label, value }) => {
              return `${label}:${(value && value.length) || 0}人`;
            }}
            label="本次账单候选人"
            name="trackingList"
            rule="REQ"
            minLength={1}
            block
          />
        ]}
      />
      <FormInfo
        title="账单费用信息"
        list={[
          <RadioGroup
            name="typeId"
            label="账单类目"
            rule="REQ"
            options={[
              { value: 6, label: '面试到岗' },
              { value: 7, label: '入职到岗' }
            ]}
            block
          />,
          <MoneyInput name="standardAmount" label="标准账单总金额" rule="REQ" />,
          <MoneyInput name="amount" label="账单总金额" rule="REQ" />,
          <TextArea name="amountDiffReason" label="标准账单总金额与自填账单总金额不一致的原因" rule="REQ" block />,
          <TextArea name="remark" label="备注" rule="REQ" block />,
          <Upload name="attachments" label="附件" block />
        ]}
      />
      <FormInfo
        title="付款信息"
        list={[<PaymentSelect name="paymentId" label="付款信息" rule="REQ" api={{ data: { clientId: get(record, 'bill.clientId'), state: 5 } }} />]}
      />
      <BillAllocationForm record={record} />
    </>
  );
});

export default BillInfoFormInner;
