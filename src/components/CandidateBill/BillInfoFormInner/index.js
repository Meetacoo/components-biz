import { createWithRemoteLoader } from '@kne/remote-loader';
import ProjectSelect from '@components/ProjectSelect';
import ContractSelect from '@components/ContractSelect';
import CandidateSelect from '@components/CandidateSelect';
import { get } from 'lodash';
import BillAllocationForm from '../BillAllocationForm';
import PaymentSelect from '../../PaymentSelect';
import BillAmount from '../BillAmount';

const BillInfoFormInner = createWithRemoteLoader({
  modules: ['components-core:FormInfo', 'components-core:Common@isNotEmpty']
})(({ remoteModules, client, billType, phases, projectInfo }) => {
  const [FormInfo, isNotEmpty] = remoteModules;
  const { RadioGroup, MoneyInput, TextArea, Upload, SuperSelect } = FormInfo.fields;

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
          // 所选候选人所在职位无项目，显示合同
          // 所选候选人所在职位都有项目，不显示合同
          <ContractSelect
            name="contractId"
            label="合同"
            api={{ data: { clientId: get(client, 'clientId'), states: [5, 7] } }}
            display={!projectInfo}
          />,
          // 所选候选人所在职位有项目，显示项目，不可修改
          // 职位无项目，不显示项目
          <ProjectSelect
            name="projectId"
            label="项目"
            rule="REQ"
            display={!!projectInfo}
            api={
              projectInfo
                ? {
                    loader: () => ({ projectList: [projectInfo] })
                  }
                : null
            }
            fieldNames={{
              serialNum: 'projectSerialNum',
              name: 'projectName',
              id: 'projectId'
            }}
            disabled
          />,
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
            clientId={get(client, 'clientId')}
            phases={phases}
            showBatchDelete={billType === 3}
            showRowSelection={billType === 3}
            showAdd={billType === 3}
            showDelete={billType === 3}
            controllerOpen={false}
          />
        ]}
      />
      <FormInfo
        title="账单费用信息"
        list={[
          <RadioGroup
            name="typeId"
            label="账单类目"
            disabled
            rule="REQ"
            options={[
              { value: 6, label: '面试到岗' },
              { value: 7, label: '入职到岗' }
            ]}
            block
          />,
          <MoneyInput
            name="standardAmount"
            label="标准账单总金额"
            rule="REQ"
            disabled
            display={({ formData }) => (get(formData, 'trackingList') || []).every(item => isNotEmpty(get(item, 'standardAmount')))}
          />,
          <BillAmount name="amount" label="账单总金额" rule="REQ" />,
          <TextArea
            name="amountDiffReason"
            label="标准账单总金额与自填账单总金额不一致的原因"
            rule="REQ"
            block
            display={({ formData }) => isNotEmpty(get(formData, 'standardAmount')) && +get(formData, 'standardAmount') !== +get(formData, 'amount')}
          />,
          <TextArea name="remark" label="备注" rule="REQ" block />,
          <Upload name="attachments" label="附件" block />
        ]}
      />
      <FormInfo
        title="付款信息"
        list={[<PaymentSelect name="paymentId" label="付款信息" rule="REQ" api={{ data: { clientId: get(client, 'clientId'), state: 5 } }} />]}
      />
      <BillAllocationForm />
    </>
  );
});

export default BillInfoFormInner;
