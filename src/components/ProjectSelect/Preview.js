import { createWithRemoteLoader } from '@kne/remote-loader';
import Fetch from '@kne/react-fetch';
import ProjectDetailSelectRenderList from './ProjectDetailSelectRenderList';
import get from 'lodash/get';

const Preview = createWithRemoteLoader({
  modules: ['components-core:Global@usePreset']
})(({ remoteModules, id }) => {
  const [usePreset] = remoteModules;
  const { apis } = usePreset();
  return (
    <Fetch
      {...Object.assign({}, apis.project.getContractProjectDetail, {
        params: { id }
      })}
      render={({ data }) => {
        return <ProjectDetailSelectRenderList data={data} dataSource={get(data, 'projectPriceList')} />;
      }}
    />
  );
});

export default Preview;
