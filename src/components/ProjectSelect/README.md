
# ProjectSelect


### 概述

选择项目


### 示例

#### 示例代码

- 这里填写示例标题
- 这里填写示例说明
- _ProjectSelect(@components/ProjectSelect),remoteLoader(@kne/remote-loader),_presetMock(@root/presetMock)

```jsx
const { createWithRemoteLoader } = remoteLoader;
const { default: ProjectSelect, ProjectDetailSelect } = _ProjectSelect;
const { default: presetMock, projectList } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:FormInfo', 'components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [FormInfo, PureGlobal] = remoteModules;
  const { Form } = FormInfo;
  return (
    <PureGlobal preset={presetMock}>
      <Form
        data={{
          project: (() => {
            const value = projectList.data.projectList[0];
            return {
              value: value,
              label: `${value.serialNum} ${value.name}`
            };
          })()
        }}
      >
        <FormInfo
          list={[
            <ProjectSelect name="project" label="项目" rule="REQ" showContract />,
            <ProjectSelect name="project" label="项目" rule="REQ" showContract disabled />,
            <ProjectDetailSelect name="projectDetail" label="项目细分服务" rule="REQ" />
          ]}
        />
      </Form>
    </PureGlobal>
  );
});

render(<BaseExample />);

```


### API

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |

