import { createWithRemoteLoader } from '@kne/remote-loader';
import ProjectBillInfoFormInner from '../ProjectBillInfoFormInner';
import { App, Button } from 'antd';
import { billTransform } from '../index';
import get from 'lodash/get';
import merge from 'lodash/merge';
import GenerateBillDetail, { BillNoticeSave } from '../GenerateBillDetail';

const GenerateProjectBill = createWithRemoteLoader({
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
            const { formProps, client, ...others } = Object.assign(
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
                  children: <ProjectBillInfoFormInner client={client} />
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
                      children: '仅保存'
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

export const GenerateProjectBillButton = createWithRemoteLoader({
  modules: ['components-core:Global@usePreset']
})(({ remoteModules, onSuccess, client, userInfo, ...props }) => {
  const [usePreset] = remoteModules;
  const { apis, ajax } = usePreset();
  const { message } = App.useApp();

  return (
    <GenerateProjectBill onSuccess={onSuccess}>
      {({ modal }) => (
        <Button
          {...props}
          onClick={() => {
            modal({
              client,
              formProps: [
                {
                  data: {
                    clientId: { label: get(client, 'clientName'), value: get(client, 'clientId') },
                    billItems: [{ typeId: 1 }],
                    allocations: [{ uid: { label: billTransform.getUserName({ user: userInfo }), value: get(userInfo, 'uid') } }]
                  },
                  onSubmit: async (formData, { stepCacheRef }) => {
                    const submitData = billTransform.output(formData, 1);
                    const { data: resData } = await ajax(
                      Object.assign({}, apis.candidateBill.addBill, {
                        data: Object.assign({}, submitData, { type: 1 })
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
    </GenerateProjectBill>
  );
});

export const EditBillProjectButton = createWithRemoteLoader({
  modules: ['components-core:Global@usePreset', 'components-core:FetchButton', 'components-core:InfoPage@formatView']
})(({ remoteModules, id, onSuccess, ...props }) => {
  const [usePreset, FetchButton, formatView] = remoteModules;
  const { apis, ajax } = usePreset();
  const { message } = App.useApp();
  return (
    <GenerateProjectBill onSuccess={onSuccess}>
      {({ modal }) => (
        <FetchButton
          {...props}
          api={Object.assign({}, apis.candidateBill.getBillDetail, {
            params: { id }
          })}
          onClick={({ data, close }) => {
            return modal({
              title: '编辑账单',
              client: get(data, 'bill') || {},
              formProps: [
                {
                  data: billTransform.input(data, formatView),
                  onSubmit: async (formData, { stepCacheRef }) => {
                    const submitData = billTransform.output(formData, 1, data);
                    const { data: resData } = await ajax(
                      Object.assign({}, apis.candidateBill.updateBill, {
                        data: Object.assign({}, submitData, { type: 1 })
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
            });
          }}
        />
      )}
    </GenerateProjectBill>
  );
});

export default GenerateProjectBill;
