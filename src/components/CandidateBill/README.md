
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
    <PureGlobal
      preset={presetMock}
    >
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
const { GenerateBill, GenerateProjectBill } = _CandidateBill;
const { Button, Space } = antd;
const { default: presetMock } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return (
    <PureGlobal
      preset={presetMock}
    >
      <Space>
        <GenerateBill>
          {({ modal }) => {
            return (
              <Button
                onClick={() => {
                  modal({
                    title: '生成候选人账单',
                    formProps: [
                      {
                        onSubmit: async () => {}
                      },
                      {
                        onSubmit: async () => {}
                      }
                    ]
                  });
                }}
              >
                生成候选人账单
              </Button>
            );
          }}
        </GenerateBill>
        <GenerateProjectBill>
          {({ modal }) => {
            return (
              <Button
                onClick={() => {
                  modal({
                    title: '生成候选人账单',
                    formProps: [
                      {
                        onSubmit: async () => {}
                      },
                      {
                        onSubmit: async () => {}
                      }
                    ]
                  });
                }}
              >
                生成项目账单
              </Button>
            );
          }}
        </GenerateProjectBill>
      </Space>
    </PureGlobal>
  );
});

render(<BaseExample />);

```

- GenerateBillDetail
- 生成账单详情
- _CandidateBill(@components/CandidateBill),remoteLoader(@kne/remote-loader),_presetMock(@root/presetMock)

```jsx
const { GenerateBillDetail, FLOW_USER } = _CandidateBill;
const { createWithRemoteLoader } = remoteLoader;

const { default: presetMock } = _presetMock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:FormInfo@Form']
})(({ remoteModules }) => {
  const [PureGlobal, Form] = remoteModules;
  return (
    <PureGlobal
      preset={presetMock}
    >
      <Form rules={{ FLOW_USER }}>
        <GenerateBillDetail
          billDetail={{
            bankInfoOperation: 'xxxx',
            totalAmount: '1000',
            projects: [
              {
                id: 223,
                noticeId: 122,
                projectTypeId: 7,
                projectType: '入职到岗',
                costType: 1,
                amount: 1900000,
                num: null,
                projectAttachments: null
              },
              {
                id: 223,
                noticeId: 122,
                projectTypeId: 7,
                projectType: '入职到岗',
                costType: 1,
                amount: 1900000,
                num: null,
                projectAttachments: null
              }
            ],
            clientName: '华威股份有限公司',
            clientNum: '666666',
            clientNameChinese: '华威股份有限公司',
            clientNameEnglish: 'FA Talent Human Resources Service Co.',
            clientAddress: '北京市朝阳区东三环北路嘉铭中心B座15层',
            contact: '19829288292',
            consultant: '张三',
            attention: '张三',
            date: '2023-07-21',
            team: 'FAT',
            userInfo: {
              email: 'fuling@165.com',
              phone: '13988882221',
              name: '福玲',
              englishName: '福玲',
              gender: 'M',
              createdAt: '2022-11-18T08:22:56.000+00:00',
              updatedAt: '2023-02-28T02:22:43.000+00:00'
            }
          }}
        />
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
  return (
    <PureGlobal preset={presetMock}>
      <Form>
        <BillInfoFormInner />
      </Form>
    </PureGlobal>
  );
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
    <PureGlobal
      preset={presetMock}
    >
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
  return (<PureGlobal
    preset={presetMock}
  >
    <Layout navigation={{ isFixed: false }}>
      <BillCenterDetail optionFixed={false} />
    </Layout>
  </PureGlobal>);
});

render(<BaseExample />);

```


### API

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |

