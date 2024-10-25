import { createWithRemoteLoader } from '@kne/remote-loader';
import ProjectBillInfoFormInner from '../ProjectBillInfoFormInner';

const GenerateProjectBill = createWithRemoteLoader({
  modules: ['components-core:FormInfo']
})(({ remoteModules, record, children }) => {
  const [FormInfo] = remoteModules;
  const { useFormStepModal } = FormInfo;
  const formStepModal = useFormStepModal();
  return children({
    modal: () => {
      return formStepModal({
        title: '生成账单',
        items: [
          {
            title: '填写账单信息',
            formProps: {
              onSubmit: async () => {}
            },
            children: <ProjectBillInfoFormInner record={record} />
          },
          {
            title: '生成账单',
            children: <div>生成账单</div>
          }
        ]
      });
    }
  });
});

export default GenerateProjectBill;
