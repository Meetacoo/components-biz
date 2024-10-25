import { createWithRemoteLoader } from '@kne/remote-loader';
import ProjectSelect from '@components/ProjectSelect';
import ContractSelect from '@components/ContractSelect';
import CandidateSelect from '@components/CandidateSelect';
import { get } from 'lodash';
import { useMemo } from 'react';
import { billTransform } from '../index';

const BillInfoFormInner = createWithRemoteLoader({
  modules: ['components-core:FormInfo', 'components-core:FormInfo@formModule', 'components-core:Global@usePreset', 'components-core:StateTag']
})(({ remoteModules, record }) => {
  const [FormInfo, formModule, usePreset, StateTag] = remoteModules;
  const { TableList } = FormInfo;
  const { FormItem } = formModule;
  const { Input, RadioGroup, MoneyInput, TextArea, Upload, AdvancedSelect, SuperSelectUser } = FormInfo.fields;
  const { apis } = usePreset();

  const userMap = useMemo(() => new Map((get(record, 'userInfos') || []).map(item => [item.uid, item])), [record]);
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
          // TODO 项目账单。合同有项目，显示项目字段
          <FormItem display={({ formData }) => get(formData, 'contract')}>
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
      <FormInfo title="付款信息" list={[<Input name="paymentId" label="付款信息" rule="REQ" />]} />
      <TableList
        title="业绩分配"
        name="allocations"
        list={(groupArgs, { index: allocationIndex }, { formData }) => {
          return [
            <SuperSelectUser
              name="uid"
              label="分配用户"
              isPopup={false}
              rule="REQ"
              single
              labelWrap={false}
              api={apis.user.getUserList}
              getSearchProps={({ searchText }) => ({ userName: searchText })}
              dataFormat={({ pageData = [], totalCount }) => {
                const currentUid = get(formData, `allocations[${allocationIndex}].uid`);
                const selectedUids = (formData.allocations || []).filter(x => x.uid && x.uid.value !== currentUid).map(item => item.uid.value);
                return {
                  list: pageData.map(item => ({
                    ...item,
                    // label: `${get(item, 'englishName', '')} ${get(item, 'name', '')} ${get(item, 'orgName') ? ' - ' + get(item, 'orgName') : ''}`,
                    label: billTransform.getUserName({ userMap, user: item }),
                    value: get(item, 'uid'),
                    disabled: selectedUids.some(x => x === get(item, 'uid')),
                    description: item?.state === 1 ? <StateTag text="账号已关闭" /> : null
                  })),
                  total: totalCount
                };
              }}
            />,
            <MoneyInput name="amount" label="分配金额" rule="REQ" />,
            <Input name="amountPercent" label="分配比例" rule="REQ" />
          ];
        }}
      />
    </>
  );
});

export default BillInfoFormInner;
