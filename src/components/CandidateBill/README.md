
# CandidateBill


### 概述

候选人账单


### 示例(全屏)

#### 示例代码

- 这里填写示例标题
- 这里填写示例说明
- _CandidateBill(@components/CandidateBill)

```jsx
const { default: CandidateBill } = _CandidateBill;
const BaseExample = () => {
  return <CandidateBill />;
};

render(<BaseExample />);

```

- ApprovalProcess
- 流程配置
- _CandidateBill(@components/CandidateBill),remoteLoader(@kne/remote-loader),_presetMock(@root/presetMock)

```jsx
const { ApprovalProcess, FLOW_USER } = _CandidateBill;
const { createWithRemoteLoader } = remoteLoader;
const { default: presetMock } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:FormInfo@Form']
})(({ remoteModules }) => {
  const [PureGlobal, Form] = remoteModules;
  return (
    <PureGlobal preset={presetMock}>
      <Form rules={{ FLOW_USER }}>
        <ApprovalProcess label="账单审批流程" name="flowRequest" rule="REQ FLOW_USER" />
      </Form>
    </PureGlobal>
  );
});

render(<BaseExample />);

```

- 生成账单
- 生成账单
- _CandidateBill(@components/CandidateBill),remoteLoader(@kne/remote-loader),antd(antd),_presetMock(@root/presetMock)

```jsx
const { createWithRemoteLoader } = remoteLoader;
const {
  GenerateBillButton, EditBillButton, GenerateProjectBillButton, EditBillProjectButton
} = _CandidateBill;
const { Button, Space } = antd;
const { default: presetMock, astUserList } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return (<PureGlobal preset={presetMock}>
    <Space>
      <GenerateBillButton client={{ clientId: '123', clientName: '测试客户' }}
                          trackingList={astUserList.data.pageData.data.slice(3, 5)}>生成候选人账单</GenerateBillButton>
      <EditBillButton id="123">编辑候选人账单</EditBillButton>
      <GenerateProjectBillButton
        client={{ clientId: '123', clientName: '测试客户' }}>生成项目账单</GenerateProjectBillButton>
      <EditBillProjectButton id="123">编辑项目账单</EditBillProjectButton>
    </Space>
  </PureGlobal>);
});

render(<BaseExample />);

```

- GenerateBillDetail
- 生成账单详情
- _CandidateBill(@components/CandidateBill),remoteLoader(@kne/remote-loader),_presetMock(@root/presetMock)

```jsx
const { GenerateBillDetail, FLOW_USER } = _CandidateBill;
const { createWithRemoteLoader } = remoteLoader;

const { default: presetMock, billInfo } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:FormInfo@Form']
})(({ remoteModules }) => {
  const [PureGlobal, Form] = remoteModules;
  return (
    <PureGlobal preset={presetMock}>
      <Form rules={{ FLOW_USER }}>
        <GenerateBillDetail billDetail={billInfo} />
      </Form>
    </PureGlobal>
  );
});

render(<BaseExample />);

```

- 生成候选人账单表单
- 生成候选人账单表单
- remoteLoader(@kne/remote-loader),_CandidateBill(@components/CandidateBill),_presetMock(@root/presetMock)

```jsx
const { BillInfoFormInner } = _CandidateBill;
const { createWithRemoteLoader } = remoteLoader;

const { default: presetMock } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:FormInfo@Form', 'components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [Form, PureGlobal] = remoteModules;
  return (<PureGlobal preset={presetMock}>
      <Form>
        <BillInfoFormInner client={{ clientName: '测试客户', clientId: '123' }} trackingList={[

        ]} />
      </Form>
    </PureGlobal>);
});

render(<BaseExample />);

```

- 生成项目账单表单
- 生成项目账单表单
- remoteLoader(@kne/remote-loader),_CandidateBill(@components/CandidateBill),_presetMock(@root/presetMock)

```jsx
const { ProjectBillInfoFormInner } = _CandidateBill;
const { createWithRemoteLoader } = remoteLoader;
const { default: presetMock } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:FormInfo@Form', 'components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [Form, PureGlobal] = remoteModules;
  return (
    <PureGlobal preset={presetMock}>
      <Form>
        <ProjectBillInfoFormInner />
      </Form>
    </PureGlobal>
  );
});

render(<BaseExample />);

```

- 账单中心
- 账单中心
- remoteLoader(@kne/remote-loader),_CandidateBill(@components/CandidateBill),_presetMock(@root/presetMock)

```jsx
const { BillCenterPage } = _CandidateBill;
const { createWithRemoteLoader } = remoteLoader;
const { default: presetMock } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:Layout']
})(({ remoteModules }) => {
  const [PureGlobal, Layout] = remoteModules;
  return (
    <PureGlobal preset={presetMock}>
      <Layout navigation={{ isFixed: false }}>
        <BillCenterPage />
      </Layout>
    </PureGlobal>
  );
});

render(<BaseExample />);

```

- 账单详情
- 账单详情
- remoteLoader(@kne/remote-loader),_CandidateBill(@components/CandidateBill),_presetMock(@root/presetMock)

```jsx
const { BillCenterDetail } = _CandidateBill;
const { createWithRemoteLoader } = remoteLoader;
const { default: presetMock } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:Layout']
})(({ remoteModules }) => {
  const [PureGlobal, Layout] = remoteModules;
  return (
    <PureGlobal preset={presetMock}>
      <Layout navigation={{ isFixed: false }}>
        <BillCenterDetail optionFixed={false} />
      </Layout>
    </PureGlobal>
  );
});

render(<BaseExample />);

```


### API

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |

