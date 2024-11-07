
# BillNotice


### 概述

用于展示活编辑BillNotice


### 示例(全屏)

#### 示例代码

- base
- 这里填写示例说明
- _BillNotice(@components/BillNotice),remoteLoader(@kne/remote-loader),antd(antd),_presetMock(@root/presetMock),_ReactFetch(@kne/react-fetch)

```jsx
const { createWithRemoteLoader } = remoteLoader;
const { default: BillNotice } = _BillNotice;
const { default: presetMock, noticeInfo } = _presetMock;
const { Button, Flex } = antd;
const { useRef } = React;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  const ref = useRef();

  return (
    <PureGlobal preset={presetMock}>
      <BillNotice data={noticeInfo} ref={ref} />
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

```

- template
- 这里填写示例说明
- _BillNotice(@components/BillNotice),remoteLoader(@kne/remote-loader),antd(antd),_presetMock(@root/presetMock),_ReactFetch(@kne/react-fetch),lodash(lodash)

```jsx
const { createWithRemoteLoader } = remoteLoader;
const { templateRenders, billNoticeTransform } = _BillNotice;
const { default: mockApis, noticeInfo } = _presetMock;
const { default: Fetch } = _ReactFetch;
const { Flex, Divider } = antd;
const { get } = lodash;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:InfoPage@formatView']
})(({ remoteModules }) => {
  const [PureGlobal, formatView] = remoteModules;
  const {userInfo, organization} = mockApis.global.accountInfo;
  const noticeData = billNoticeTransform.input({
    initData: noticeInfo,
    userInfo,
    organization,
    formatView
  });
  return (
    <PureGlobal
      preset={{
        apis: mockApis
      }}
    >
      <div style={{ width: '769px', margin: '0 auto' }}>
        <Divider>签约主体信息</Divider>
        <Fetch
          {...Object.assign({}, mockApis.apis.contract.getSubjectList)}
          render={({ data }) => {
            return (
              <Flex vertical gap={10}>
                {data
                  .filter(item => item.citable)
                  .map((item, index) => {
                    return <div key={index} dangerouslySetInnerHTML={{ __html: templateRenders.renderCompany(item) }} />;
                  })}
              </Flex>
            );
          }}
        />
        <Divider>银行信息</Divider>
        <Fetch
          {...Object.assign({}, mockApis.apis.contract.getBankData)}
          render={({ data }) => {
            return (
              <Flex vertical gap={10}>
                {data.map((item, index) => {
                  return <div key={index} dangerouslySetInnerHTML={{ __html: templateRenders.renderBankInfo(item) }} />;
                })}
              </Flex>
            );
          }}
        />
        <Divider>批注</Divider>
        <div
          dangerouslySetInnerHTML={{
            __html: templateRenders.renderFooter({
              email: 'fuling@165.com',
              phone: '18888888888',
              name: '福玲',
              englishName: '福玲',
              gender: 'M',
              createdAt: '2022-11-18T08:22:56.000+00:00',
              updatedAt: '2023-02-28T02:22:43.000+00:00'
            })
          }}
        />
        <Divider>客户信息</Divider>
        <div
          dangerouslySetInnerHTML={{
            __html: templateRenders.renderHeader(Object.assign({}, {
              billNotice: {
                clientName: '华威股份有限公司',
                clientNum: '666666',
                clientEnName: 'FA Talent Human Resources Service Co.',
                clientAddress: '北京市朝阳区东三环北路嘉铭中心B座15层',
                contact: '19829288292',
                consultant: '张三',
                attention: '张三',
                date: '2023-07-21',
                team: 'FAT'
              },
            }, {
              clientName: '华威股份有限公司',
              clientNum: '666666',
              clientEnName: 'FA Talent Human Resources Service Co.',
              clientAddress: '北京市朝阳区东三环北路嘉铭中心B座15层',
              contact: '19829288292',
              consultant: '张三',
              attention: '张三',
              date: '2023-07-21',
              team: 'FAT'
            }))
          }}
        />
        <Divider>发票相关</Divider>
        <Fetch
          {...Object.assign({}, mockApis.apis.contract.getBankData)}
          render={({ data }) => {
            const bankInfo = data[0];
            return (
              <div
                dangerouslySetInnerHTML={{
                  __html: templateRenders.renderTable({
                    bankInfo,
                    bankInfoOperation: 'xxxx',
                    totalAmount: '1000',
                    totalFee: 3800000,
                    itemList: [
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
                    ]
                  })
                }}
              />
            );
          }}
        />
        <Divider>所有信息</Divider>
        <div
          dangerouslySetInnerHTML={{
            __html: templateRenders.renderPage(Object.assign({}, noticeData, get(noticeData, 'billNotice')))
          }}
        />
      </div>
    </PureGlobal>
  );
});

render(<BaseExample />);

```


### API

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |

