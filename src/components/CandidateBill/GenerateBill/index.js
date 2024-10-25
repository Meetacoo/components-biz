import { createWithRemoteLoader } from '@kne/remote-loader';
import BillInfoFormInner from '../BillInfoFormInner';
import { Button, App } from 'antd';
import Fetch from '@kne/react-fetch';
import get from 'lodash/get';

const GenerateBill = createWithRemoteLoader({
  modules: ['components-core:FormInfo']
})(({ remoteModules, children }) => {
  const [FormInfo] = remoteModules;
  const { useFormStepModal } = FormInfo;
  const formStepModal = useFormStepModal();
  return children({
    modal: props => {
      const { formProps, ...others } = Object.assign(
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
            children: <BillInfoFormInner />
          },
          {
            title: '生成账单',
            formProps: get(formProps, '[1]'),
            children: <div>生成账单</div>
          }
        ]
      });
    }
  });
});

export const GenerateBillButton = ({ modalProps, ...props }) => {
  return (
    <GenerateBill>
      {({ modal }) => (
        <Button
          {...props}
          onClick={() => {
            modal(modalProps);
          }}
        />
      )}
    </GenerateBill>
  );
};

export const EditBillButton = createWithRemoteLoader({
  modules: ['components-core:Global@usePreset', 'components-core:Common@FetchButton']
})(({ remoteModules, id, modalProps, onReload, ...props }) => {
  const [usePreset, FetchButton] = remoteModules;
  const { apis, ajax } = usePreset();
  const { message } = App.useApp();
  return (
    <GenerateBill>
      {({ modal }) => (
        <FetchButton
          {...props}
          api={Object.assign({}, apis.candidateBill.getDetail, {
            data: { id }
          })}
          modalFunc={({ data }) =>
            modal({
              title: '编辑账单',
              formProps: [
                {
                  data,
                  onSubmit: async data => {
                    const { data: resData } = await ajax(
                      Object.assign({}, apis.candidateBill.saveBill, {
                        data: Object.assign({}, data)
                      })
                    );
                    if (resData.code !== 0) {
                      return false;
                    }
                    message.success('编辑账单成功');
                    onReload && onReload();
                  }
                },
                {
                  onSubmit: async () => {}
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
