import { createWithRemoteLoader } from '@kne/remote-loader';
import merge from 'lodash/merge';
import { Checkbox, Col, Flex, Radio, Row, Typography } from 'antd';
import classnames from 'classnames';
import useRefCallback from '@kne/use-ref-callback';
import get from 'lodash/get';

import style from './style.module.scss';
import getColumns from './getColumns';
import { ProjectPreview } from './index';

const ProjectSelect = createWithRemoteLoader({
  modules: ['components-core:FormInfo@fields', 'components-core:Global@usePreset', 'components-core:Table']
})(({ remoteModules, data, api: propsApi, fieldNames = { serialNum: 'serialNum', name: 'name', id: 'id' }, ...others }) => {
  const [fields, usePreset, Table] = remoteModules;
  const { SuperSelect } = fields;
  const { apis, ajax } = usePreset();

  const formatValue = item => {
    if (!item) {
      return;
    }
    return Object.assign({}, item, {
      value: item[fieldNames.id],
      label: `${item[fieldNames.serialNum]} ${item[fieldNames.name]}`
    });
  };
  const props = Object.assign(
    {},
    {
      single: true,
      valueKey: fieldNames.id,
      valueType: 'all',
      api: merge({}, Object.assign({}, apis.project.getList, { data }), propsApi),
      dataFormat: data => {
        return {
          list: (data.projectList || []).map(formatValue)
        };
      }
    },
    others,
    others.hasOwnProperty('value')
      ? {
          value: Array.isArray(others.value) ? others.value.map(formatValue) : formatValue(others.value)
        }
      : {},
    others.hasOwnProperty('defaultValue')
      ? {
          defaultValue: Array.isArray(others.defaultValue) ? others.defaultValue.map(formatValue) : formatValue(others.defaultValue)
        }
      : {}
  );
  const gotoContract = useRefCallback(async item => {
    const { data } = await ajax(merge({}, apis.client.getContractSsoUrl, { params: { contractId: item.contractId } }));
    if (data?.code === 0) {
      window.open(data?.data?.url);
    }
  });
  return (
    <SuperSelect
      {...props}
      isPopup={false}
      suffix={({ value }) => {
        return props.disabled && value.length > 0 && <ProjectPreview id={get(value[0], `value.${fieldNames.id}`)} />;
      }}
      renderItem={contextProps => {
        const { item, props, isSelectedAll, value, onSelect, setValue, onOpenChange } = contextProps;
        const { single, isPopup, valueKey } = props;
        const CheckedComponent = single ? Radio : Checkbox;
        const isChecked = value.some(target => target.value[valueKey] === item[valueKey]);
        return (
          <Flex
            key={item[fieldNames.id]}
            className={classnames(style['project-item'], {
              [style['is-selected']]: isChecked
            })}
            vertical
            gap={12}
            onClick={() => {
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
            }}
          >
            <Row justify="space-between">
              <Col>
                <CheckedComponent checked={isChecked}>{item.label}</CheckedComponent>
              </Col>
              <Col>
                {props.showContract && get(item, 'contractId') ? (
                  <div className={style['project-contract']}>
                    所属合同{`《${item.contractName}》`}
                    <Typography.Link
                      onClick={async e => {
                        e.stopPropagation();
                        e.preventDefault();
                        gotoContract(item);
                      }}
                    >
                      查看
                    </Typography.Link>
                  </div>
                ) : null}
              </Col>
            </Row>
            <Table
              controllerOpen={false}
              dataSource={item.projectPriceList || []}
              pagination={false}
              rowKey={fieldNames.id}
              columns={[...getColumns()]}
            />
          </Flex>
        );
      }}
    />
  );
});

ProjectSelect.Field = ProjectSelect;

export default ProjectSelect;
