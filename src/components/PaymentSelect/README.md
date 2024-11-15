
# PaymentSelect


### 概述

选择付款信息


### 示例

#### 示例代码

- 这里填写示例标题
- 这里填写示例说明
- _PaymentSelect(@components/PaymentSelect),remoteLoader(@kne/remote-loader),_presetMock(@root/presetMock)

```jsx
const { default: PaymentSelect } = _PaymentSelect;
const { createWithRemoteLoader } = remoteLoader;
const { default: presetMock, paymentList } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:FormInfo@Form']
})(({ remoteModules }) => {
  const [PureGlobal, Form] = remoteModules;
  return (
    <PureGlobal preset={presetMock}>
      <Form
        data={{
          payment2: (() => {
            const value = paymentList.data.pageData[0];
            return {
              value: value.id,
              label: value.invoiceTitle
            };
          })()
        }}
      >
        <PaymentSelect name="payment" label="付款信息" />
        <PaymentSelect name="payment2" label="付款信息(有默认值)" />
        <PaymentSelect name="payment2" label="付款信息(有默认值并禁止修改)" disabled />
      </Form>
    </PureGlobal>
  );
});

render(<BaseExample />);

```

- 这里填写示例标题
- 这里填写示例说明
- _PaymentSelect(@components/PaymentSelect),remoteLoader(@kne/remote-loader),_presetMock(@root/presetMock)

```jsx
const { PaymentPreview } = _PaymentSelect;
const { createWithRemoteLoader } = remoteLoader;
const { default: presetMock } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return (
    <PureGlobal preset={presetMock}>
      <PaymentPreview id={0} />
    </PureGlobal>
  );
});

render(<BaseExample />);

```


### API

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |

