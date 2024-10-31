import { createWithRemoteLoader } from '@kne/remote-loader';
import BillNotice from '@components/BillNotice';
import ApprovalProcess from '../ApprovalProcess';
import style from './style.module.scss';

const GenerateBillDetail = createWithRemoteLoader({
  modules: ['components-core:FormInfo', 'components-core:InfoPage']
})(({ remoteModules, billDetail }) => {
  const [FormInfo, InfoPage] = remoteModules;
  return (
    <>
      <InfoPage.Part>
        <BillNotice data={billDetail} className={style['bill-notice']} />
      </InfoPage.Part>
      <div className={style['flow']}>
        <FormInfo title="账单审批流程" list={[<ApprovalProcess label="账单审批流程" name="flowRequest" rule="REQ FLOW_USER" />]} />
      </div>
    </>
  );
});

export default GenerateBillDetail;
