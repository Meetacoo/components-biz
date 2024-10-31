const { createWithRemoteLoader } = remoteLoader;
const { default: BillNotice } = _BillNotice;
const { default: presetMock, billInfo } = _presetMock;
const { Button, Flex } = antd;
const { useRef } = React;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  const ref = useRef();
  return (
    <PureGlobal preset={presetMock}>
      <BillNotice data={billInfo} ref={ref} />
      <Flex gap={8} justify="center">
        <Button
          onClick={() => {
            console.log(ref.current?.getRenderHtml());
          }}
        >
          获取HTML
        </Button>
        <Button
          onClick={() => {
            console.log(ref.current?.getFormData());
          }}
        >
          获取表单数据
        </Button>
      </Flex>
    </PureGlobal>
  );
});

render(<BaseExample />);
