
# BillNotice


### 概述

用于展示活编辑BillNotice


### 示例(全屏)

#### 示例代码

- base
- 这里填写示例说明
- _BillNotice(@components/BillNotice),remoteLoader(@kne/remote-loader),antd(antd),_mock(@components/BillNotice/doc/mock),_ReactFetch(@kne/react-fetch)

```jsx
const { createWithRemoteLoader } = remoteLoader;
const { default: BillNotice } = _BillNotice;
const { default: mockApis } = _mock;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return (
    <PureGlobal
      preset={{
        apis: mockApis,
        ajax: async api => {
          return { data: { code: 0, data: api.loader() } };
        }
      }}
    >
      <BillNotice
        data={{
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
    </PureGlobal>
  );
});

render(<BaseExample />);

```

- template
- 这里填写示例说明
- _BillNotice(@components/BillNotice),remoteLoader(@kne/remote-loader),antd(antd),_mock(@components/BillNotice/doc/mock),_ReactFetch(@kne/react-fetch)

```jsx
const { createWithRemoteLoader } = remoteLoader;
const { templateRenders } = _BillNotice;
const { default: mockApis } = _mock;
const { default: Fetch } = _ReactFetch;
const { Flex, Divider } = antd;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal']
})(({ remoteModules }) => {
  const [PureGlobal] = remoteModules;
  return (
    <PureGlobal
      preset={{
        apis: mockApis
      }}
    >
      <div style={{ width: '769px', margin: '0 auto' }}>
        <Fetch
          {...Object.assign({}, mockApis.contract.getSubjectList)}
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
        <Divider />
        <Fetch
          {...Object.assign({}, mockApis.contract.getBankData)}
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
        <Divider />
        <div
          dangerouslySetInnerHTML={{
            __html: templateRenders.renderFooter({
              email: 'fuling@165.com',
              phone: '13988882221',
              name: '福玲',
              englishName: '福玲',
              gender: 'M',
              createdAt: '2022-11-18T08:22:56.000+00:00',
              updatedAt: '2023-02-28T02:22:43.000+00:00'
            })
          }}
        />
        <Divider />
        <Fetch
          {...Object.assign({}, mockApis.payment.getPaymentData)}
          render={({ data }) => {
            return (
              <div
                dangerouslySetInnerHTML={{
                  __html: templateRenders.renderHeader({
                    clientName: '华威股份有限公司',
                    clientNum: '666666',
                    clientNameChinese: '华威股份有限公司',
                    clientNameEnglish: 'FA Talent Human Resources Service Co.',
                    clientAddress: '北京市朝阳区东三环北路嘉铭中心B座15层',
                    contact: '19829288292',
                    consultant: '张三',
                    attention: '张三',
                    date: '2023-07-21',
                    team: 'FAT'
                  })
                }}
              />
            );
          }}
        />
        <Divider />
        <Fetch
          {...Object.assign({}, mockApis.contract.getBankData)}
          render={({ data }) => {
            const bankInfo = data[0];
            return (
              <div
                dangerouslySetInnerHTML={{
                  __html: templateRenders.renderTable({
                    bankInfo,
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
                    ]
                  })
                }}
              />
            );
          }}
        />
        <Divider />
        <Fetch
          {...Object.assign({}, mockApis.contract.getSubjectList)}
          render={({ data }) => {
            const company = data[0];
            return (
              <Fetch
                {...Object.assign({}, mockApis.contract.getBankData)}
                render={({ data }) => {
                  const bankInfo = data[0];
                  return (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: templateRenders.renderPage({
                          company,
                          bankInfo,
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
                        })
                      }}
                    />
                  );
                }}
              />
            );
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

