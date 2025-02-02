
# ProjectSelect


### 概述

选择项目


### 示例

#### 示例代码

- 这里填写示例标题
- 这里填写示例说明
- _ProjectSelect(@components/ProjectSelect),remoteLoader(@kne/remote-loader),_projectListData(@components/ProjectSelect/doc/projectList.json)

```jsx
const { createWithRemoteLoader } = remoteLoader;
const { default: ProjectSelect, ProjectDetailSelect } = _ProjectSelect;
const { default: projectListData } = _projectListData;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:FormInfo', 'components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [FormInfo, PureGlobal] = remoteModules;
  const { Form } = FormInfo;
  return (
    <PureGlobal
      preset={{
        apis: {
          client: {},
          project: {
            getList: {
              loader: () => {
                return projectListData.data;
              }
            },
            getDetail: {
              loader: () => {
                return projectListData.data.projectList[0];
              }
            }
          }
        }
      }}
    >
      <Form>
        <FormInfo
          list={[
            <ProjectSelect name="project" label="项目" rule="REQ" showContract />,
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

