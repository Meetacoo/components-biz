import { useMemo } from 'react';
import { createWithRemoteLoader } from '@kne/remote-loader';
import { Flex, Row, Col, Radio, Checkbox, Typography } from 'antd';
import useRefCallback from '@kne/use-ref-callback';
import getColumns from './getColumns';
import classnames from 'classnames';
import get from 'lodash/get';
import merge from 'lodash/merge';
import style from './style.module.scss';

const ProjectSelectField = createWithRemoteLoader({
  modules: ['components-core:Common@createListField', 'components-core:Table', 'components-core:Global@usePreset']
})(({ remoteModules, data, api: propsApi, fieldNames = { serialNum: 'serialNum', name: 'name', id: 'id' }, ...others }) => {
  const [createListField, Table, usePreset] = remoteModules;
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
  const Components = useMemo(
    () =>
      createListField({
        defaultProps: {
          single: true,
          showSelectedTag: false
        },
        renderList: ({ props, list, value, onSelect }) => {
          const { single } = props;
          const CheckedComponent = single ? Radio : Checkbox;
          return (
            <Flex vertical gap={24}>
              {list.map(item => {
                const checked = value.indexOf(item[fieldNames.id]) > -1;
                return (
                  <Flex
                    key={item[fieldNames.id]}
                    className={classnames(style['project-item'], {
                      [style['is-selected']]: checked
                    })}
                    vertical
                    gap={12}
                    onClick={() => {
                      onSelect(item);
                    }}
                  >
                    <Row justify="space-between">
                      <Col>
                        <CheckedComponent checked={checked}>{item.label}</CheckedComponent>
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
                      rowKey={'id'}
                      columns={[...getColumns()]}
                    />
                  </Flex>
                );
              })}
            </Flex>
          );
        }
      }),
    [createListField, gotoContract]
  );

  return <Components {...props} isPopup={false} />;
});

const ProjectSelect = createWithRemoteLoader({
  modules: ['FormInfo@hooks']
})(({ remoteModules, ...props }) => {
  const [hooks] = remoteModules;
  const { useOnChange } = hooks;
  const render = useOnChange(Object.assign({}, { placeholder: '请选择' + props.label }, props));
  return render(ProjectSelectField);
});

ProjectSelect.Field = ProjectSelectField;

export default ProjectSelect;
