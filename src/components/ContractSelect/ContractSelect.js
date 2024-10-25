import { createWithRemoteLoader } from '@kne/remote-loader';
import merge from 'lodash/merge';
import { Row, Col, Flex, Alert, Button } from 'antd';
import classnames from 'classnames';
import { Detail } from './Preview';
import style from './style.module.scss';

const ContractSelect = createWithRemoteLoader({
  modules: [
    'components-core:FormInfo@fields',
    'components-core:Global@usePreset',
    'components-core:Common@SimpleBar',
    'components-core:StateTag',
    'components-core:Enum',
    'components-core:Modal@useModal'
  ]
})(({ remoteModules, api: propsApi, ...props }) => {
  const [fields, usePreset, SimpleBar, StateTag, Enum, useModal] = remoteModules;
  const { SuperSelect } = fields;
  const { apis } = usePreset();
  const modal = useModal();
  return (
    <SuperSelect
      {...props}
      isPopup={false}
      single
      dataFormat={data => {
        return {
          list: data.pageData.map(item => Object.assign({}, item, { value: item.id, label: item.name })),
          total: data.totalCount
        };
      }}
      suffix={({ value }) => {
        return (
          props.disabled &&
          value.length > 0 && (
            <Button
              onClick={() => {
                modal({
                  title: '合同预览',
                  children: <Detail data={value[0]} />
                });
              }}
            >
              预览
            </Button>
          )
        );
      }}
      renderItemContent={({ item }) => {
        return (
          <Flex gag={8} flex={1}>
            <Flex className={classnames(style['select-list-item-label'], 'select-list-item-label')} flex={1}>
              {item.label}
            </Flex>
            <Flex flex={0}>
              <Enum moduleName="CONTRACT_STATE_ENUM" name={item.state}>
                {({ description, type }) => {
                  return <StateTag type={type} text={description} />;
                }}
              </Enum>
            </Flex>
          </Flex>
        );
      }}
      getSearchProps={text => {
        return {
          name: text
        };
      }}
      api={merge({}, apis.contract.getList, propsApi)}
    >
      {({ components, value }) => {
        return (
          <Flex vertical gap={8}>
            <Alert message="仅展示审批通过和已过期的合同。" type="warning" showIcon />
            <Row wrap={false} gutter={24}>
              <Col span={8}>
                {components.search}
                {components.selectedAll}
                <div className={style['fetch-list']}>{components.fetchList}</div>
              </Col>
              <Col span={16}>
                <SimpleBar
                  style={{
                    maxHeight: 'calc(var(--modal-height) - 48px - 46px)'
                  }}
                >
                  <Flex vertical gap={24}>
                    <div>预览</div>
                    {value[0] && <Detail data={value[0]} />}
                  </Flex>
                </SimpleBar>
              </Col>
            </Row>
          </Flex>
        );
      }}
    </SuperSelect>
  );
});

ContractSelect.Field = ContractSelect;

export default ContractSelect;
