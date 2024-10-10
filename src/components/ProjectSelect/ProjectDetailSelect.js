import { createWithRemoteLoader } from '@kne/remote-loader';
import { Flex } from 'antd';
import getColumns from './getColumns';
import { useMemo } from 'react';

const ProjectDetailSelectField = createWithRemoteLoader({
  modules: ['components-core:Common@createListField', 'components-core:Table', 'components-core:Global@usePreset']
})(({ remoteModules, ...others }) => {
  const [createListField, Table, usePreset] = remoteModules;
  const { apis } = usePreset();
  const props = Object.assign(
    {},
    {
      api: apis.project.getDetail,
      dataFormat: data => {
        return Object.assign({}, data, {
          list: data.projectPriceList.map(item => {
            return Object.assign({}, item, {
              value: item.id,
              label: `${item.rsfwlx} ${item.rsxffw} ${item.rstj}`
            });
          })
        });
      }
    },
    others
  );

  const Components = useMemo(
    () =>
      createListField({
        defaultProps: {
          single: true,
          showSelectedTag: false
        },
        renderList: ({ props, data, list, value, onSelect }) => {
          const { single } = props;
          return (
            <Flex vertical gap={12}>
              <div>
                {data.serialNum} {data.name}
              </div>
              <Table
                controllerOpen={false}
                rowSelection={{
                  type: single ? 'radio' : 'checkbox',
                  hideSelectAll: true,
                  selectedRowKeys: value,
                  onSelect: item => {
                    onSelect(item);
                  }
                }}
                onRow={item => {
                  return {
                    onClick: () => onSelect(item)
                  };
                }}
                dataSource={list || []}
                pagination={false}
                rowKey={'id'}
                columns={[...getColumns()]}
              />
            </Flex>
          );
        }
      }),
    [createListField]
  );

  return <Components {...props} isPopup={false} />;
});

const ProjectDetailSelect = createWithRemoteLoader({
  modules: ['FormInfo@hooks']
})(({ remoteModules, ...props }) => {
  const [hooks] = remoteModules;
  const { useOnChange } = hooks;
  const render = useOnChange(Object.assign({}, { placeholder: '请选择' + props.label }, props));
  return render(ProjectDetailSelectField);
});

ProjectDetailSelect.Field = ProjectDetailSelectField;
export default ProjectDetailSelect;
