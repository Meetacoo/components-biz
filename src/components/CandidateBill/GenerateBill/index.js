import { createWithRemoteLoader } from '@kne/remote-loader';
import BillInfoFormInner from '../BillInfoFormInner';
import { App, Button } from 'antd';
import get from 'lodash/get';
import { billTransform } from '../index';
import GenerateBillDetail from '../GenerateBillDetail';
import merge from 'lodash/merge';

const GenerateBill = createWithRemoteLoader({
  modules: ['components-core:FormInfo']
})(({ remoteModules, children }) => {
  const [FormInfo] = remoteModules;
  const { useFormStepModal } = FormInfo;
  const formStepModal = useFormStepModal();
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
        items: [
          {
            title: '填写账单信息',
            formProps: get(formProps, '[0]'),
            children: <BillInfoFormInner client={client} />
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

export const GenerateBillButton = createWithRemoteLoader({
  modules: ['components-core:Global@usePreset']
})(({ remoteModules, ...p }) => {
  const [usePreset] = remoteModules;
  const { client, trackingList, ...props } = Object.assign(
    {},
    {
      trackingList: []
    },
    p
  );
  const { message } = App.useApp();
  const { ajax, apis } = usePreset();
  return (
    <GenerateBill>
      {({ modal }) => (
        <Button
          {...props}
          onClick={() => {
            modal({
              title: '生成账单',
              client,
              formProps: [
                {
                  data: {
                    trackingList
                  },
                  onSubmit: async (data, { stepCacheRef }) => {
                    const { data: resData } = await ajax(
                      merge({}, apis.candidateBill.addBill, {
                        data: Object.assign({}, data)
                      })
                    );
                    if (resData.code !== 0) {
                      return false;
                    }
                    message.success('生成账单成功');
                    stepCacheRef.current.billInfo = resData.data;
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
    </GenerateBill>
  );
});

export const EditBillButton = createWithRemoteLoader({
  modules: ['components-core:Global@usePreset', 'components-core:FetchButton', 'components-core:InfoPage@formatView']
})(({ remoteModules, id, onReload, ...props }) => {
  const [usePreset, FetchButton, formatView] = remoteModules;
  const { apis, ajax } = usePreset();
  const { message } = App.useApp();
  return (
    <GenerateBill>
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
            })
          }
        />
      )}
    </GenerateBill>
  );
});

export default GenerateBill;
