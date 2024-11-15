import { createWithRemoteLoader } from '@kne/remote-loader';
import ProjectDetailSelectRenderList from './ProjectDetailSelectRenderList';
import merge from 'lodash/merge';
import get from 'lodash/get';
import { useMemo } from 'react';
import ProjectDetailPreview from './ProjectDetailPreview';

const ProjectDetailSelect = createWithRemoteLoader({
  modules: ['components-core:FormInfo@fields', 'components-core:Global@usePreset']
})(({ remoteModules, api: propsApi, ...others }) => {
  const [fields, usePreset] = remoteModules;
  const { SuperSelect } = fields;
  const { apis } = usePreset();

  const fieldNames = useMemo(() => merge({}, { serialNum: 'serialNum', name: 'name' }, get(others, 'fieldNames')), [others]);

  const formatValue = (item, data) => {
    if (!item) {
      return;
    }
    return Object.assign({}, item, data, {
      value: item,
      label: `${item.rsfwlx} ${item.rsxffw} ${item.rstj}`
    });
  };

  const props = Object.assign(
    {},
    {
      single: true,
      valueType: 'all',
      valueKey: 'id',
      api: merge({}, apis.project.getDetail, propsApi),
      dataFormat: data => {
        return Object.assign({}, data, {
          list: (data.projectPriceList || []).map(item => formatValue(item, data))
        });
      }
    },
    others,
    others.hasOwnProperty('value')
      ? {
          value: Array.isArray(others.value) ? others.value.map(formatValue) : formatValue(others.value, others)
        }
      : {},
    others.hasOwnProperty('defaultValue')
      ? {
          defaultValue: Array.isArray(others.defaultValue) ? others.defaultValue.map(formatValue) : formatValue(others.defaultValue, others)
        }
      : {}
  );

  return (
    <SuperSelect
      {...props}
      isPopup={false}
      suffix={({ value }) => {
        return props.disabled && value.length > 0 && <ProjectDetailPreview data={value[0]} dataSource={[value[0].value]} fieldNames={fieldNames} />;
      }}
      renderList={contextProps => {
        const { isSelectedAll, list, data, onSelect, value, setValue, onOpenChange } = contextProps;
        const { single, isPopup, valueKey } = props;
        return (
          <ProjectDetailSelectRenderList
            data={data}
            dataSource={list || []}
            rowSelection={{
              type: single ? 'radio' : 'checkbox',
              hideSelectAll: true,
              selectedRowKeys: value.map(({ value }) => value[valueKey]),
              onSelect: item => {
                onSelect(item);
              }
            }}
            onRow={item => {
              return {
                onClick: () => {
                  if (item.disabled) {
                    return;
                  }
                  if (isSelectedAll) {
                    return;
                  }
                  if (single) {
                    setValue([item]);
                  } else {
                    onSelect(item);
                  }
                  if (isPopup && single) {
                    onOpenChange(false);
                  }
                }
              };
            }}
            fieldNames={fieldNames}
          />
        );
      }}
    />
  );
});

ProjectDetailSelect.Field = ProjectDetailSelect;

export default ProjectDetailSelect;
