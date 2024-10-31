const { createWithRemoteLoader } = remoteLoader;
const { default: ProjectSelect, ProjectDetailSelect } = _ProjectSelect;
const { default: presetMock } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:FormInfo', 'components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [FormInfo, PureGlobal] = remoteModules;
  const { Form } = FormInfo;
  return (
    <PureGlobal preset={presetMock}>
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
