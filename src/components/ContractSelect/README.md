
# ContractSelect


### 概述

合同选择


### 示例

#### 示例代码

- preview
- 合同预览
- _ContractSelect(@components/ContractSelect),remoteLoader(@kne/remote-loader),_presetMock(@root/presetMock)

```jsx
const { default: ContractSelect } = _ContractSelect;
const { createWithRemoteLoader } = remoteLoader;
const { default: presetMock, contractList } = _presetMock;
const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:FormInfo@Form']
})(({ remoteModules }) => {
  const [PureGlobal, Form] = remoteModules;
  return (
    <PureGlobal preset={presetMock}>
      <Form
        data={{
          contract2: Object.assign({}, contractList.data.pageData[0], {
            label: contractList.data.pageData[0].name,
            value: contractList.data.pageData[0].id
          })
        }}
      >
        <ContractSelect name="contract" label="合同" />
        <ContractSelect name="contract2" label="合同只读" disabled />
      </Form>
    </PureGlobal>
  );
});

render(<BaseExample />);

```

- preview
- 合同预览
- _ContractSelect(@components/ContractSelect),remoteLoader(@kne/remote-loader),_presetMock(@root/presetMock)

```jsx
const { ContractPreviewInner } = _ContractSelect;
const { createWithRemoteLoader } = remoteLoader;
const { default: presetMock } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return (
    <PureGlobal preset={presetMock}>
      <ContractPreviewInner />
    </PureGlobal>
  );
});

render(<BaseExample />);

```


### API

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |

