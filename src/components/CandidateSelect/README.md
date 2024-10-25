
# CandidateSelect


### 概述

用于批量选择候选人


### 示例

#### 示例代码

- 这里填写示例标题
- 这里填写示例说明
- _CandidateSelect(@components/CandidateSelect),remoteLoader(@kne/remote-loader),_userListData(@components/CandidateSelect/doc/userListData.json),_positionListData(@components/CandidateSelect/doc/positionListData.json)

```jsx
const { default: CandidateSelect } = _CandidateSelect;
const { createWithRemoteLoader } = remoteLoader;
const { default: userListData } = _userListData;
const { default: positionListData } = _positionListData;
const { data: userList } = userListData;
const { data: positionList } = positionListData;
const BaseExample = createWithRemoteLoader({
  modules: ['components-core:FormInfo@Form', 'components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [Form, PureGlobal] = remoteModules;
  return (
    <PureGlobal
      preset={{
        apis: {
          ats: {
            getTrackingList: {
              loader: () => {
                return userList;
              }
            }
          },
          position: {
            getMyList: {
              loader: () => {
                return positionList;
              }
            }
          }
        }
      }}
    >
      <Form>
        <CandidateSelect name="candidate" label="候选人" minLength={1}/>
      </Form>
    </PureGlobal>
  );
});

render(<BaseExample />);

```


### API

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |

