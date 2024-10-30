const { GenerateBillDetail, FLOW_USER } = _CandidateBill;
const { createWithRemoteLoader } = remoteLoader;
const { default: billNoticeMock } = _billNoticeMock;
const { default: flowData } = _flowData;

const BaseExample = createWithRemoteLoader({
  modules: ['components-core:Global@PureGlobal', 'components-core:FormInfo@Form']
})(({ remoteModules }) => {
  const [PureGlobal, Form] = remoteModules;
  return (
    <PureGlobal
      preset={{
        ajax: async api => {
          return { data: { code: 0, data: api.loader() } };
        },
        apis: {
          flow: {
            getFlowCondition: {
              loader: () => {
                return {
                  conditions: [
                    {
                      columnName: 'withoutContractType'
                    }
                  ],
                  flowNo: '1004'
                };
              }
            },
            getNodesList: {
              loader: () => {
                return flowData.data;
              }
            }
          },
          ...billNoticeMock
        }
      }}
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
