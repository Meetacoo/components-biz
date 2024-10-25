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
        <CandidateSelect name="candidate" label="候选人" minLength={1} />
      </Form>
    </PureGlobal>
  );
});

render(<BaseExample />);
