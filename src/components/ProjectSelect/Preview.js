import { createWithRemoteLoader } from '@kne/remote-loader';
import Fetch from '@kne/react-fetch';
import ProjectDetailSelectRenderList from './ProjectDetailSelectRenderList';
import get from 'lodash/get';
import { Button } from 'antd';

export const ProjectPreviewInner = createWithRemoteLoader({
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
          title: '项目',
          footer: null,
          children: <ProjectPreviewInner id={id} />
        });
      }}
    >
      预览
    </Button>
  );
});

export default Preview;
