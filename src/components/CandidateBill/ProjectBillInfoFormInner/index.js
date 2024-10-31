import { createWithRemoteLoader } from '@kne/remote-loader';
import ProjectSelect from '@components/ProjectSelect';
import ContractSelect from '@components/ContractSelect';
import CandidateSelect from '@components/CandidateSelect';
import get from 'lodash/get';
import BillAllocationForm from '../BillAllocationForm';
import PaymentSelect from '../../PaymentSelect';

// 项目账单
const ProjectBillInfoFormInner = createWithRemoteLoader({
  modules: ['components-core:FormInfo', 'components-core:FormInfo@formModule']
})(({ remoteModules, client }) => {
  const [FormInfo, formModule] = remoteModules;
  const { FormItem } = formModule;
  const { List } = FormInfo;
  const { Input, RadioGroup, Upload, MoneyInput, DatePicker, InputNumber, SuperSelect } = FormInfo.fields;

  const onsiteFields = [
      <MoneyInput name="amount" label="账单金额" rule="REQ" />,
      <DatePicker picker="month" name="month" label="费用所属月份" rule="REQ" />,
      <InputNumber name="num" label="开票人数" rule="REQ" addonAfter="人" precision={1} />,
      <Upload block name="attachments" label="onsite人员" rule="REQ" />
    ],
    mappingFields = [<MoneyInput name="amount" label="账单金额" rule="REQ" />, <Upload block name="attachments" label="mapping报告" />],
    projectManageFields = [<MoneyInput name="amount" label="账单金额" rule="REQ" />],
    projectStartFeeFields = [<MoneyInput name="amount" label="账单金额" rule="REQ" />],
    referralFields = [
      <MoneyInput name="amount" label="账单金额" rule="REQ" />,
      <InputNumber name="num" label="内推人数" rule="REQ" addonAfter="人" precision={1} />,
      <Upload block name="attachments" label="内推名单" rule="REQ" />
    ],
    interviewFields = [
      <MoneyInput name="amount" label="账单金额" rule="REQ" />,
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
    ],
    inductionFields = [
      <MoneyInput name="amount" label="账单金额" rule="REQ" />,
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
    ],
    otherFields = [<MoneyInput name="amount" label="账单金额" rule="REQ" />, <Input name="typeName" label="账单类目名称" rule="REQ LEN-0-20" />];

  const fieldsMapping = {
    1: onsiteFields,
    2: mappingFields,
    3: projectManageFields,
    4: projectStartFeeFields,
    5: referralFields,
    6: interviewFields,
    7: inductionFields,
    8: otherFields
  };

  return (
    <>
      <FormInfo
        list={[
          <SuperSelect
            name="clientId"
            label="客户"
            single
            disabled
            valueKey="clientId"
            labelKey="clientName"
            value={client}
            interceptor="object-output-value"
          />,
          <ContractSelect name="contractId" label="合同" rule="REQ" api={{ data: { clientId: get(client, 'clientId'), states: [5, 7] } }} />,
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
      <List
        title="账单费用信息"
        itemTitle={({ index }) => '账单类目' + (index + 1)}
        name="billItems"
        list={(key, { index }, context) => {
          const { formData } = context;
          const billType = get(formData, `billItems[${index}].typeId`);
          const moreFields = (billType && fieldsMapping[billType]) || [];
          return [
            <RadioGroup
              name="typeId"
              label="账单类目"
              rule="REQ"
              options={[
                { value: 1, label: 'onsite' },
                { value: 2, label: 'mapping' },
                {
                  value: 3,
                  label: '项目管理'
                },
                { value: 4, label: '项目启动金' },
                { value: 5, label: '内推' },
                {
                  value: 6,
                  label: '面试到岗'
                },
                { value: 7, label: '入职到岗' },
                { value: 8, label: '其他' }
              ]}
              block
            />,
            ...moreFields
          ];
        }}
      />
      <FormInfo
        title="付款信息"
        list={[<PaymentSelect name="paymentId" label="付款信息" rule="REQ" api={{ data: { clientId: get(client, 'clientId'), state: 5 } }} />]}
      />
      <BillAllocationForm />
    </>
  );
});

export default ProjectBillInfoFormInner;
