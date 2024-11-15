import { createWithRemoteLoader } from '@kne/remote-loader';
import Fetch from '@kne/react-fetch';
import { Button } from 'antd';

import RenewalInfo from './RenewalInfo';
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

export const ContractPreviewInner = createWithRemoteLoader({
  modules: ['components-core:Global@usePreset']
})(({ remoteModules, id }) => {
  const [usePreset] = remoteModules;
  const { apis } = usePreset();
  return <Fetch {...Object.assign({}, apis.contract.getContractById, { params: { id } })} render={({ data }) => <Detail data={data} />} />;
});

const Preview = createWithRemoteLoader({
  modules: ['components-core:Modal@useModal']
})(({ remoteModules, id, ...props }) => {
  const [useModal] = remoteModules;
  const modal = useModal();

  return (
    <Button
      {...props}
      onClick={() => {
        modal({
          title: '合同信息',
          footer: null,
          children: <ContractPreviewInner id={id} />
        });
      }}
    >
      预览
    </Button>
  );
});

export default Preview;
