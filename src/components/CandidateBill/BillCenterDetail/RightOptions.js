import { createWithRemoteLoader } from '@kne/remote-loader';
import { Tabs } from 'antd';

const StartApproval = () => {
  return '发起审核';
};
const RevokeApproval = () => {
  return '撤销审核';
};

const FlowRecord = () => {
  return '流转记录';
};

const RightOptions = createWithRemoteLoader({
  modules: []
})(({ remoteModules, data }) => {
  const [] = remoteModules;
  const billState = data.state;
  const items = [];

  //可以发起审核
  if ([1, 3, 4].indexOf(billState) > -1) {
    items.push({
      key: 'startApproval',
      label: '发起审核',
      children: <StartApproval />
    });
  }
  //可以撤销审核
  if ([2].indexOf(billState) > -1) {
    items.push({
      key: 'revokeApproval',
      label: '撤销审核',
      children: <RevokeApproval />
    });
  }

  //可以展示流转记录
  if ([2, 3, 4, 5].indexOf(billState) > -1) {
    items.push({
      key: 'flowRecord',
      label: '流转记录',
      children: <FlowRecord />
    });
  }

  return <Tabs items={items}></Tabs>;
});

export default RightOptions;
