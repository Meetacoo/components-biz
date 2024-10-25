
# ContractSelect


### 概述

合同选择


### 示例

#### 示例代码

- preview
- 合同预览
- _ContractSelect(@components/ContractSelect),remoteLoader(@kne/remote-loader),_data(@components/ContractSelect/doc/contractListData.json)

```jsx
const { default: ContractSelect, CONTRACT_STATE_ENUM } = _ContractSelect;
const { createWithRemoteLoader } = remoteLoader;
const { data: contractData } = _data;
const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:FormInfo@Form']
})(({ remoteModules }) => {
  const [PureGlobal, Form] = remoteModules;
  return (
    <PureGlobal
      preset={{
        enums: {
          CONTRACT_STATE_ENUM
        },
        apis: {
          oss: {
            loader: () => {
              return 'test.png';
            }
          },
          contract: {
            getList: {
              loader: () => {
                return contractData;
              }
            }
          }
        }
      }}
    >
      <Form
        data={{
          contract2: Object.assign({}, contractData.pageData[0], {
            label: contractData.pageData[0].name,
            value: contractData.pageData[0].id
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
- _ContractSelect(@components/ContractSelect),remoteLoader(@kne/remote-loader),_data(@components/ContractSelect/doc/contractDetailData.json)

```jsx
const { Preview } = _ContractSelect;
const { createWithRemoteLoader } = remoteLoader;
const { data: contractData } = _data;
const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return (
    <PureGlobal
      preset={{
        apis: {
          oss: {
            loader: () => {
              return 'test.png';
            }
          },
          contract: {
            getDetail: {
              loader: () => {
                return contractData;
              }
            }
          }
        }
      }}
    >
      <Preview />
    </PureGlobal>
  );
});

render(<BaseExample />);

```


### API

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |

