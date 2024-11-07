import { createWithRemoteLoader } from '@kne/remote-loader';
import merge from 'lodash/merge';
import get from 'lodash/get';
import { App } from 'antd';
import { billNoticeTransform } from '../../BillNotice';

const BillNoticeSave = createWithRemoteLoader({
  modules: ['components-core:Global@usePreset']
})(({ remoteModules, children }) => {
  const [usePreset] = remoteModules;
  const { apis, ajax } = usePreset();
  const { message } = App.useApp();
  return children({
    save: async (data, { childrenRef, stepCacheRef }) => {
      // console.log(data, stepCacheRef, childrenRef.current.getRenderHtml());
      const { billId, id } = get(stepCacheRef, 'current.billInfo.notice.billNotice');
      const submitNotice = billNoticeTransform.output(
        Object.assign({}, data, childrenRef.current.getFormData(), {
          billId,
          id
        })
      );
      console.log(get(stepCacheRef, 'current.billInfo'), submitNotice);
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
