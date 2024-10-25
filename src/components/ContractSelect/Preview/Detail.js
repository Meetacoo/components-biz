import { createWithRemoteLoader } from '@kne/remote-loader';
import RenewalInfo from './RenewalInfo';
import Fetch from '@kne/react-fetch';
import MainInfo from './MainInfo';

export const Detail = createWithRemoteLoader({
  modules: ['components-core:InfoPage']
})(({ remoteModules, data }) => {
  const [InfoPage] = remoteModules;
  return (
    <InfoPage>
      {data.contractRenewal?.renewalStartDate && <RenewalInfo data={data} />}
      {data.contractRenewal?.renewalStartDate ? (
        <InfoPage.Part title="初始合同信息">
          <MainInfo data={data} />
        </InfoPage.Part>
      ) : (
        <MainInfo data={data} />
      )}
    </InfoPage>
  );
});

const DetailWithData = createWithRemoteLoader({
  modules: ['components-core:Global@usePreset']
})(({ remoteModules, id }) => {
  const [usePreset] = remoteModules;
  const { apis } = usePreset();
  return (
    <Fetch
      {...Object.assign({}, apis.contract.getDetail, {
        params: { id }
      })}
      render={({ data }) => <Detail data={data} />}
    />
  );
});

export default DetailWithData;
