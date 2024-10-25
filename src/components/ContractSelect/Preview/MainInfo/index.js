import { createWithRemoteLoader } from '@kne/remote-loader';
import Basic from './Basic';
import HandsOff from './HandsOff';
import Charges from './Charges';

const MainInfo = createWithRemoteLoader({
  modules: ['components-core:InfoPage']
})(({ remoteModules, data }) => {
  const [InfoPage] = remoteModules;
  return (
    <>
      <Basic data={data} />
      <HandsOff data={data} />
      <Charges data={data} />
    </>
  );
});

export default MainInfo;
