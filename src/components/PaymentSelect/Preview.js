import { createWithRemoteLoader } from '@kne/remote-loader';
import { Flex } from 'antd';
import Fetch from '@kne/react-fetch';

export const Detail = createWithRemoteLoader({
  modules: ['components-core:InfoPage@CentralContent', 'components-core:File@FileLink', 'components-core:Enum']
})(({ remoteModules, data }) => {
  const [CentralContent, FileLink, Enum] = remoteModules;

  return (
    <CentralContent
      dataSource={data}
      columns={[
        {
          name: 'clientName',
          title: '客户'
        },
        {
          name: 'invoiceType',
          title: '开票类型',
          render: value => <Enum moduleName="INVOICE_TYPE_ENUM" name={value} />
        },
        {
          name: 'invoiceTitle',
          title: '发票抬头'
        },
        {
          name: 'taxpayerIdNumber',
          title: '纳税人识别号'
        },
        {
          name: 'taxRegistrationAddress',
          title: '税务登记地址'
        },
        {
          name: 'taxRegistrationPhone',
          title: '税务登记电话'
        },
        {
          name: 'openingBankName',
          title: '开户银行名称'
        },
        {
          name: 'openingBackAccount',
          title: '开户银行账号'
        },
        {
          name: 'clientBusinessLicenseIds',
          title: '客户营业执照',
          block: true,
          render: value => {
            return (
              <Flex gap={8} vertical>
                {value.map((item, index) => (
                  <FileLink key={index} originName={item.originalName} id={item.id} />
                ))}
              </Flex>
            );
          }
        },
        {
          name: 'invoiceAttachments',
          title: '客户开票信息',
          block: true,
          render: value => {
            return (
              <Flex gap={8} vertical>
                {value.map((item, index) => (
                  <FileLink key={index} originName={item.originalName} id={item.id} />
                ))}
              </Flex>
            );
          }
        },
        {
          name: 'billingInfoIds',
          title: '合同或伞状协议',
          block: true,
          render: value => {
            return (
              <Flex gap={8} vertical>
                {value.map((item, index) => (
                  <FileLink key={index} originName={item.originalName} id={item.id} />
                ))}
              </Flex>
            );
          }
        }
      ]}
    />
  );
});

const Preview = createWithRemoteLoader({
  modules: ['components-core:Global@usePreset']
})(({ remoteModules, id }) => {
  const [usePreset] = remoteModules;
  const { apis } = usePreset();
  return (
    <Fetch
      {...Object.assign({}, apis.payment.getPaymentById, {
        params: { id }
      })}
      render={({ data }) => <Detail data={data} />}
    />
  );
});

export default Preview;
