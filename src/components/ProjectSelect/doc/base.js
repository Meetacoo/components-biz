const { createWithRemoteLoader } = remoteLoader;
const { default: ProjectSelect, ProjectDetailSelect } = _ProjectSelect;
const { default: presetMock, projectList, projectDetailInfo } = _presetMock;

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
          })(),
          projectDetail: (() => {
            const value = projectDetailInfo.projectPriceList[0];
            return {
              ...projectDetailInfo,
              value: value,
              label: `${value.rsfwlx} ${value.rsxffw} ${value.rstj}`
            };
          })()
        }}
      >
        <FormInfo
          list={[
            <ProjectSelect name="project" label="项目" rule="REQ" showContract />,
            <ProjectSelect name="project" label="项目" rule="REQ" showContract disabled />,
            <ProjectDetailSelect
              name="projectDetail"
              label="项目细分服务"
              rule="REQ"
              api={{
                loader: () => projectDetailInfo
              }}
              fieldNames={{
                serialNum: 'projectSerialNum',
                name: 'projectName'
              }}
            />,
            <ProjectDetailSelect
              name="projectDetail"
              label="项目细分服务"
              rule="REQ"
              api={{
                loader: () => projectDetailInfo
              }}
              disabled
              fieldNames={{
                serialNum: 'projectSerialNum',
                name: 'projectName'
              }}
            />
          ]}
        />
      </Form>
    </PureGlobal>
  );
});

render(<BaseExample />);
