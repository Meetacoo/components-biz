import { createWithRemoteLoader } from '@kne/remote-loader';
import merge from 'lodash/merge';
import get from 'lodash/get';
import { Alert, Col, Flex, Row } from 'antd';
import classnames from 'classnames';
import Preview, { PaymentPreviewInner } from './Preview';
import style from './style.module.scss';

const PaymentSelect = createWithRemoteLoader({
  modules: [
    'components-core:FormInfo@fields',
    'components-core:Global@usePreset',
    'components-core:Common@SimpleBar',
    'components-core:Modal@useModal'
  ]
})(({ remoteModules, api: propsApi, ...props }) => {
  const [fields, usePreset, SimpleBar, useModal] = remoteModules;
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
          list: (data.pageData || []).map(item =>
            Object.assign({}, item, {
              value: item.id,
              label: item.invoiceTitle
            })
          ),
          total: data.totalCount
        };
      }}
      suffix={({ value }) => {
        return props.disabled && value.length > 0 && <Preview id={get(value[0], 'value')} />;
      }}
      renderItemContent={({ item }) => {
        return (
          <Flex className={classnames(style['select-list-item-label'], 'select-list-item-label')} flex={1}>
            {item.label}
          </Flex>
        );
      }}
      getSearchProps={text => {
        return {
          name: text
        };
      }}
      api={merge({}, apis.payment.getPaymentList, propsApi)}
    >
      {({ components, value }) => {
        return (
          <Flex vertical gap={8}>
            <Alert message="仅展示审核通过的付款信息。" type="warning" showIcon />
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
                    {value[0] && <PaymentPreviewInner id={get(value[0], 'value')} />}
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

PaymentSelect.Field = PaymentSelect;

export default PaymentSelect;
