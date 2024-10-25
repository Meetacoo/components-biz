import { createWithRemoteLoader } from '@kne/remote-loader';

const ContractTerm = createWithRemoteLoader({
  modules: ['components-core:InfoPage']
})(({ remoteModules }) => {
  const [InfoPage] = remoteModules;
  return <InfoPage />;
});

export default ContractTerm;
