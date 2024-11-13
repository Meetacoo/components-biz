import { createWithRemoteLoader } from '@kne/remote-loader';
import get from 'lodash/get';
import { Col, Row, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import TrackingListContent from './TrackingListContent';
import Allocations from './Allocation';
import { PaymentPreview } from '../../PaymentSelect';
import { ContractPreview } from '../../ContractSelect';

const AttachmentsContent = createWithRemoteLoader({
  modules: ['components-core:File@FileLink']
})(({ remoteModules, billItem }) => {
  const [FileLink] = remoteModules;
  return get(billItem, 'attachments.length')
    ? (get(billItem, 'attachments') || []).map((item, index) => {
        return (
          <Space key={index} direction="vertical">
            <FileLink originName={item.originalName} id={item.id} />
          </Space>
        );
      })
    : '-';
});

const BillCenterDetailInner = createWithRemoteLoader({
  modules: [
    'components-core:InfoPage',
    'components-core:InfoPage@CentralContent',
    'components-core:Content',
    'components-core:StateTag',
    'components-core:Enum',
    'components-core:InfoPage@formatView',
    'components-core:Common@isNotEmpty',
    'components-core:Modal@useModal'
  ]
})(({ remoteModules, data }) => {
  const { bill, billItems, allocations, userInfos } = data;
  const [InfoPage, CentralContent, Content, StateTag, Enum, formatView, isNotEmpty, useModal] = remoteModules;
  const modal = useModal();

  const calcList = (billItem, trackingList) => {
    const typeId = get(billItem, `typeId`);

    const billAmount = {
      label: '账单金额',
      content: `${get(billItem, `amount`) ? formatView(get(billItem, `amount`), 'number--100') : 0}元`
    };

    let list = [];
    switch (typeId) {
      // onsite 费用
      case 1:
        list = [
          billAmount,
          {
            label: '费用所属月份',
            content: get(billItem, 'month') ? dayjs(get(billItem, 'month')).format('YYYY.MM') : '-'
          },
          { label: '开票人数', content: `${get(billItem, 'num')}人` },
          { label: 'onsite人员', content: <AttachmentsContent billItem={billItem} />, block: true }
        ];
        break;
      // Mapping
      case 2:
        list = [billAmount, { label: 'mapping报告', content: <AttachmentsContent billItem={billItem} />, block: true }];
        break;
      // 项目管理、项目启动金、其他
      case 3:
      case 4:
      case 8:
        list = [billAmount];
        break;
      // 内推
      case 5:
        list = [
          billAmount,
          { label: '内推人数', content: `${get(billItem, `num`) || '-'}人` },
          { label: '内推名单', content: <AttachmentsContent billItem={billItem} />, block: true }
        ];
        break;
      case 6:
      case 7:
        list = [
          billAmount,
          {
            label: '账单候选人',
            content: <TrackingListContent trackingList={trackingList} />
          }
        ];
        break;
      default:
        list = [];
        break;
    }
    const _list = [
      {
        label: '项目类型',
        content: billItem.typeName || '其他' || ''
      },
      ...list
    ];
    return _list;
  };

  return (
    <InfoPage>
      <InfoPage.Part title="账单信息">
        <InfoPage.Part>
          <CentralContent
            dataSource={bill}
            col={1}
            columns={[
              { name: 'serialNumber', title: '账单ID' },
              { name: 'clientName', title: '客户名称' },
              {
                name: 'contractId',
                title: '合同',
                render: contractId => (
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Space>
                        {get(bill, 'contractName') || '-'}
                        {get(bill, 'contractStatus') ? (
                          <Enum moduleName="CONTRACT_STATE_ENUM">
                            {contractSateEnum => {
                              const contractStatus = contractSateEnum.find(item => item.value === get(bill, 'contractStatus'));
                              return <StateTag type={get(contractStatus, 'type')} text={get(contractStatus, 'description')} />;
                            }}
                          </Enum>
                        ) : null}
                      </Space>
                    </Col>
                    <Col>
                      <Typography.Link
                        onClick={() => {
                          // 预览合同详情
                          modal({
                            title: '合同信息',
                            children: <ContractPreview id={contractId} />
                          });
                        }}
                      >
                        预览
                      </Typography.Link>
                    </Col>
                  </Row>
                ),
                display: !!get(bill, 'contractId')
              },
              {
                name: 'projectName',
                title: '项目',
                render: projectName => `${get(bill, 'projectSerialNum')} ${projectName}`,
                display: !!get(bill, 'projectId')
              },
              {
                name: 'feeType',
                title: '费用类别',
                render: feeType => (feeType ? { 1: '招聘费', 2: '服务费' }[feeType] : '-')
              }
            ]}
          />
        </InfoPage.Part>
        <InfoPage.Part title="账单费用信息">
          {bill.type === 1 ? (
            <>
              <InfoPage.Collapse defaultActiveKey={(billItems || []).map(({ billItem }) => billItem.id)}>
                {(billItems || []).map(({ billItem, trackingList }, index) => {
                  return (
                    <InfoPage.Collapse.Panel key={billItem.id} header={`账单类目${index + 1}`}>
                      <Content labelAlign="auto" col={3} gutter={[0, 12]} list={calcList(billItem, trackingList)} />
                    </InfoPage.Collapse.Panel>
                  );
                })}
              </InfoPage.Collapse>
            </>
          ) : (
            <InfoPage.Part>
              <CentralContent
                dataSource={bill}
                col={1}
                columns={[
                  {
                    valueIsEmpty: () => false,
                    name: 'tracking',
                    title: '账单候选人',
                    render: () => <TrackingListContent trackingList={billItems[0].trackingList} />
                  },
                  {
                    valueIsEmpty: () => false,
                    name: 'typeId',
                    title: '账单类目',
                    render: () => (billItems[0].billItem.typeId ? billItems[0].billItem.typeName : '')
                  },
                  {
                    name: 'standardAmount',
                    title: '标准账单总金额',
                    render: value => `${value ? formatView(value, 'number--100') : 0}元`,
                    display: isNotEmpty(get(bill, 'standardAmount'))
                  },
                  { name: 'amount', title: '账单总金额', render: value => `${value ? formatView(value, 'number--100') : 0}元` },
                  { name: 'remark', title: '备注' },
                  {
                    name: 'amountDiffReason',
                    title: '标准账单总金额与自填账单总金额不一致的原因',
                    display: isNotEmpty(get(bill, 'amountDiffReason'))
                  },
                  {
                    name: 'attachments',
                    title: '附件',
                    render: attachments => <AttachmentsContent billItem={{ attachments }} />,
                    block: true
                  }
                ]}
              />
            </InfoPage.Part>
          )}
        </InfoPage.Part>
        <InfoPage.Part title="付款信息">
          <CentralContent
            dataSource={bill}
            col={1}
            columns={[
              {
                name: 'paymentId',
                title: '付款信息',
                render: paymentId => (
                  <Row justify="space-between" align="middle">
                    <Col>{get(bill, 'invoiceTitle') || '-'}</Col>
                    <Col>
                      <Typography.Link
                        onClick={() => {
                          // 预览 payment 详情
                          modal({
                            title: '付款信息',
                            children: <PaymentPreview id={paymentId} />
                          });
                        }}
                      >
                        预览
                      </Typography.Link>
                    </Col>
                  </Row>
                )
              }
            ]}
          />
        </InfoPage.Part>
        <InfoPage.Part title="业绩分配">
          <Allocations allocations={allocations} userInfos={userInfos} billAmount={get(bill, 'amount')} />
        </InfoPage.Part>
      </InfoPage.Part>
    </InfoPage>
  );
});

export default BillCenterDetailInner;
