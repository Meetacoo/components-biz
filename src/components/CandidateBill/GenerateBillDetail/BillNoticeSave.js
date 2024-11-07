import { createWithRemoteLoader } from '@kne/remote-loader';
import merge from 'lodash/merge';
import { App } from 'antd';

const BillNoticeSave = createWithRemoteLoader({
  modules: ['components-core:Global@usePreset']
})(({ remoteModules, children }) => {
  const [usePreset] = remoteModules;
  const { apis, ajax } = usePreset();
  const { message } = App.useApp();
  return children({
    save: async (data, { childrenRef }) => {
      console.log(data, childrenRef.current.getRenderHtml(), childrenRef.current.getFormData());
      return false;
      const { data: resData } = await ajax(
        merge({}, apis.candidateBill.saveBillNotice, {
          data: Object.assign({}, data)
        })
      );
      if (resData.code !== 0) {
        return false;
      }
      message.success('保存账单通知成功');
    }
  });
});

export default BillNoticeSave;
