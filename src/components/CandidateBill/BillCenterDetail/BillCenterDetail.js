import { createWithRemoteLoader } from '@kne/remote-loader';
import { useParams } from 'react-router-dom';
import Fetch from '@kne/react-fetch';
import BillCenterDetailInner from './BillCenterDetailInner';

const BillCenterDetail = createWithRemoteLoader({
  modules: ['components-core:Global@usePreset']
})(({ remoteModules, billId, children }) => {
  const [usePreset] = remoteModules;
  const { apis } = usePreset();
  const { id } = useParams();
  return (
    <Fetch
      {...Object.assign({}, apis.candidateBill.getBillDetail, { params: { id: id || billId } })}
      render={({ data, reload }) => {
        return children ? (
          children({
            data,
            reload,
            content: <BillCenterDetailInner data={data} />
          })
        ) : (
          <BillCenterDetailInner data={data} />
        );
      }}
    />
  );
});

export default BillCenterDetail;
