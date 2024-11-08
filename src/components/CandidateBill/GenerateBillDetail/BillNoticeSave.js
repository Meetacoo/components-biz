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
        Object.assign(
          {},
          childrenRef.current.getFormData(),
          {
            billId,
            id,
            flowRequest: get(stepCacheRef, 'current.billInfo.flowRequest'),
            pdfData: childrenRef.current.getRenderHtml(),
            deleteFields: get(childrenRef.current, 'deleteFields')
          },
          data
        )
      );
      const { data: resData } = await ajax(
        merge({}, apis.candidateBill.saveBillNotice, {
          data: Object.assign({}, submitNotice)
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
