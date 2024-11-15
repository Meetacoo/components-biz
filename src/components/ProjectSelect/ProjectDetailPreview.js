import { createWithRemoteLoader } from '@kne/remote-loader';
import ProjectDetailSelectRenderList from './ProjectDetailSelectRenderList';
import { Button } from 'antd';

const ProjectDetailPreview = createWithRemoteLoader({
  modules: ['components-core:Modal@useModal']
})(({ remoteModules, id, data, dataSource, fieldNames, ...props }) => {
  const [useModal] = remoteModules;
  const modal = useModal();

  return (
    <Button
      {...props}
      onClick={() => {
        modal({
          title: '项目',
          footer: null,
          children: <ProjectDetailSelectRenderList data={data} fieldNames={fieldNames} dataSource={dataSource} />
        });
      }}
    >
      预览
    </Button>
  );
});

export default ProjectDetailPreview;
