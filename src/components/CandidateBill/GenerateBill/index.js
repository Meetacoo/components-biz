import { createWithRemoteLoader } from '@kne/remote-loader';
import BillInfoFormInner from '../BillInfoFormInner';
import { App, Button } from 'antd';
import get from 'lodash/get';
import { billTransform } from '../index';
import GenerateBillDetail, { BillNoticeSave } from '../GenerateBillDetail';
import merge from 'lodash/merge';

const GenerateBill = createWithRemoteLoader({
  modules: ['components-core:FormInfo', 'components-core:FormInfo@formModule']
})(({ remoteModules, onSuccess, children }) => {
  const [FormInfo, formModule] = remoteModules;
  const { useFormStepModal } = FormInfo;
  const formStepModal = useFormStepModal();
  const { SubmitButton } = formModule;

  return (
    <BillNoticeSave onSuccess={onSuccess}>
      {({ save }) => {
        return children({
          modal: props => {
            const { formProps, client, billType, phases, projectInfo, ...others } = Object.assign(
              {},
              {
                title: '生成账单'
              },
              props
            );
            return formStepModal({
              ...others,
              autoClose: true,
              items: [
                {
                  title: '填写账单信息',
                  formProps: get(formProps, '[0]'),
                  footerButtons: [
                    {
                      ButtonComponent: SubmitButton,
                      children: '下一步',
                      autoClose: false
                    }
                  ],
                  children: <BillInfoFormInner client={client} billType={billType} phases={phases} projectInfo={projectInfo} />
                },
                {
                  title: '生成账单',
                  formProps: merge({}, get(formProps, '[1]'), {
                    onSubmit: save
                  }),
                  footerButtons: [
                    {
                      ButtonComponent: Button,
                      children: '上一步',
                      autoClose: false,
                      onClick: (e, { currentIndex, setCurrentIndex }) => {
                        setCurrentIndex(currentIndex - 1);
                      }
                    },
                    {
                      ButtonComponent: SubmitButton,
                      type: 'default',
                      autoClose: false,
                      children: '仅保存',
                      onClick: () => {
                        return { doSubmit: false };
                      }
                    },
                    {
                      ButtonComponent: SubmitButton,
                      autoClose: false,
                      children: '保存并提交',
                      onClick: () => {
                        return { doSubmit: true };
                      }
                    }
                  ],
                  children: ({ stepCacheRef, childrenRef }) => {
                    return <GenerateBillDetail billDetail={stepCacheRef.current.billInfo} ref={childrenRef} />;
                  }
                }
              ]
            });
          }
        });
      }}
    </BillNoticeSave>
  );
});

export const GenerateBillButton = createWithRemoteLoader({
  modules: ['components-core:Global@usePreset', 'components-core:InfoPage@formatView']
})(({ remoteModules, onSuccess, ...p }) => {
  const [usePreset, formatView] = remoteModules;
  const { client, trackingList, billType, onClick, typeId, phases, projectInfo, userInfo, ...props } = Object.assign(
    {},
    {
      trackingList: []
    },
    p
  );
  const { message } = App.useApp();
  const { ajax, apis } = usePreset();
  return (
    <GenerateBill onSuccess={onSuccess}>
      {({ modal }) => (
        <Button
          {...props}
          onClick={() => {
            if (onClick?.()) {
              return;
            }
            modal({
              title: '生成账单',
              client,
              billType,
              phases,
              projectInfo,
              formProps: [
                {
                  data: {
                    clientId: { label: get(client, 'clientName'), value: get(client, 'clientId') },
                    trackingList,
                    typeId,
                    projectId: projectInfo,
                    standardAmount: billTransform.getAmount(
                      formatView,
                      (trackingList || []).reduce((prev, cur) => prev + cur.standardAmount, 0)
                    ),
                    allocations: [{ uid: { label: billTransform.getUserName({ user: userInfo }), value: get(userInfo, 'uid') } }]
                  },
                  onSubmit: async (data, { stepCacheRef }) => {
                    const submitData = billTransform.output(data, billType);
                    const { data: resData } = await ajax(
                      merge({}, apis.candidateBill.addBill, {
                        data: Object.assign({}, submitData, { type: billType })
                      })
                    );
                    if (resData.code !== 0) {
                      return false;
                    }
                    message.success('生成账单成功');
                    stepCacheRef.current.billInfo = resData.data;
                    onSuccess && onSuccess();
                  }
                }
              ]
            });
          }}
        />
      )}
    </GenerateBill>
  );
});

export const EditBillButton = createWithRemoteLoader({
  modules: ['components-core:Global@usePreset', 'components-core:FetchButton', 'components-core:InfoPage@formatView']
})(({ remoteModules, id, onSuccess, billType, phases, ...props }) => {
  const [usePreset, FetchButton, formatView] = remoteModules;
  const { apis, ajax } = usePreset();
  const { message } = App.useApp();
  return (
    <GenerateBill onSuccess={onSuccess}>
      {({ modal }) => (
        <FetchButton
          {...props}
          api={Object.assign({}, apis.candidateBill.getBillDetail, {
            params: { id }
          })}
          onClick={({ data }) =>
            modal({
              title: '编辑账单',
              client: get(data, 'bill') || {},
              billType,
              phases,
              projectInfo: get(data, 'bill.projectId') ? { label: get(data, 'bill.projectId'), projectName: get(data, 'bill.projectName') } : null,
              formProps: [
                {
                  data: billTransform.input(data, formatView),
                  onSubmit: async (formData, { stepCacheRef }) => {
                    const submitData = billTransform.output(formData, billType, data);
                    const { data: resData } = await ajax(
                      Object.assign({}, apis.candidateBill.updateBill, {
                        data: Object.assign({}, submitData, { type: get(data, 'bill.type') })
                      })
                    );
                    if (resData.code !== 0) {
                      return false;
                    }
                    message.success('编辑账单成功');
                    stepCacheRef.current.billInfo = resData.data;
                    onSuccess && onSuccess();
                  }
                }
              ]
            })
          }
        />
      )}
    </GenerateBill>
  );
});

export default GenerateBill;
