
# PaymentSelect


### 概述

选择付款信息


### 示例

#### 示例代码

- 这里填写示例标题
- 这里填写示例说明
- _PaymentSelect(@components/PaymentSelect),remoteLoader(@kne/remote-loader),_paymentList(@components/PaymentSelect/doc/paymentList.json)

```jsx
const { default: PaymentSelect, INVOICE_TYPE_ENUM } = _PaymentSelect;
const { createWithRemoteLoader } = remoteLoader;

const { default: paymentList } = _paymentList;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:FormInfo@Form']
})(({ remoteModules }) => {
  const [PureGlobal, Form] = remoteModules;
  return (
    <PureGlobal
      preset={{
        apis: {
          payment: {
            getPaymentList: {
              loader: () => {
                return paymentList.data;
              }
            }
          }
        },
        enums: { INVOICE_TYPE_ENUM }
      }}
    >
      <Form>
        <PaymentSelect name="payment" label="付款信息" />
      </Form>
    </PureGlobal>
  );
});

render(<BaseExample />);

```

- 这里填写示例标题
- 这里填写示例说明
- _PaymentSelect(@components/PaymentSelect),remoteLoader(@kne/remote-loader),_paymentList(@components/PaymentSelect/doc/paymentList.json)

```jsx
const { Preview, INVOICE_TYPE_ENUM } = _PaymentSelect;
const { createWithRemoteLoader } = remoteLoader;

const { default: paymentList } = _paymentList;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return (
    <PureGlobal
      preset={{
        apis: {
          payment: {
            getDetail: {
              loader: ({ params }) => {
                return paymentList.data.pageData[params.id];
              }
            }
          }
        },
        enums: { INVOICE_TYPE_ENUM }
      }}
    >
      <Preview id={0} />
    </PureGlobal>
  );
});

render(<BaseExample />);

```


### API

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |

