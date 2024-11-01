import { createWithRemoteLoader } from '@kne/remote-loader';
import { Flex } from 'antd';
import getColumns from './getColumns';

const ProjectDetailSelectRenderList = createWithRemoteLoader({
  modules: ['components-core:Table']
})(({ remoteModules, data, dataSource, fieldNames = { serialNum: 'serialNum', name: 'name' }, ...props }) => {
  const [Table] = remoteModules;

  return (
    <Flex vertical gap={12}>
      <div>
        {data[fieldNames.serialNum]} {data[fieldNames?.name]}
      </div>
      <Table controllerOpen={false} {...props} dataSource={dataSource || []} pagination={false} rowKey={'id'} columns={[...getColumns()]} />
    </Flex>
  );
});

export default ProjectDetailSelectRenderList;
