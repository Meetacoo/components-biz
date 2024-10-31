import { createWithRemoteLoader } from '@kne/remote-loader';
import ProjectBillInfoFormInner from '../ProjectBillInfoFormInner';
import { App, Button } from 'antd';
import { billTransform } from '../index';
import get from 'lodash/get';
import GenerateBillDetail from '../GenerateBillDetail';

const GenerateProjectBill = createWithRemoteLoader({
  modules: ['components-core:FormInfo']
})(({ remoteModules, children }) => {
  const [FormInfo] = remoteModules;
  const { useFormStepModal } = FormInfo;
  const formStepModal = useFormStepModal();
  return children({
    modal: props => {
      const { formProps, record, ...others } = Object.assign(
        {},
        {
          title: '生成账单'
        },
        props
      );
      return formStepModal({
        ...others,
        items: [
          {
            title: '填写账单信息',
            formProps: get(formProps, '[0]'),
            children: <ProjectBillInfoFormInner record={record} />
          },
          {
            title: '生成账单',
            formProps: get(formProps, '[1]'),
            children: ({ stepCacheRef }) => {
              return <GenerateBillDetail billDetail={stepCacheRef.current.billInfo} />;
            }
          }
        ]
      });
    }
  });
});

export const GenerateProjectBillButton = createWithRemoteLoader({
  modules: ['components-core:Global@usePreset']
})(({ remoteModules, onReload, client, ...props }) => {
  const [usePreset] = remoteModules;
  const { apis, ajax } = usePreset();
  const { message } = App.useApp();

  return (
    <GenerateProjectBill>
      {({ modal }) => (
        <Button
          {...props}
          onClick={() => {
            modal({
              client,
              formProps: [
                {
                  onSubmit: async (data, { stepCacheRef }) => {
                    const { data: resData } = await ajax(
                      Object.assign({}, apis.candidateBill.addBill, {
                        data: Object.assign({}, data)
                      })
                    );
                    if (resData.code !== 0) {
                      return false;
                    }
                    message.success('生成账单成功');
                    stepCacheRef.current.billInfo = resData.data;
                    onReload && onReload();
                  }
                },
                {
                  onSubmit: async (data, { childrenRef }) => {}
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
})(({ remoteModules, id, onReload, ...props }) => {
  const [usePreset, FetchButton, formatView] = remoteModules;
  const { apis, ajax } = usePreset();
  const { message } = App.useApp();
  return (
    <GenerateProjectBill>
      {({ modal }) => (
        <FetchButton
          {...props}
          api={Object.assign({}, apis.candidateBill.getBillDetail, {
            params: { id }
          })}
          modalFunc={() => {}}
          onClick={({ data, close }) => {
            return modal({
              title: '编辑账单',
              record: get(data, 'bill') || {},
              formProps: [
                {
                  data: billTransform.input(data, formatView),
                  onSubmit: async (data, { stepCacheRef }) => {
                    const { data: resData } = await ajax(
                      Object.assign({}, apis.candidateBill.saveBill, {
                        data: Object.assign({}, data)
                      })
                    );
                    if (resData.code !== 0) {
                      return false;
                    }
                    message.success('编辑账单成功');
                    stepCacheRef.current.billInfo = resData.data;
                    onReload && onReload();
                  }
                },
                {
                  onSubmit: async () => {}
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
