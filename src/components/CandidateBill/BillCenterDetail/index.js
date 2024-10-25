import { createWithRemoteLoader } from '@kne/remote-loader';
import Fetch from '@kne/react-fetch';
import { useParams } from 'react-router-dom';
import get from 'lodash/get';
import dayjs from 'dayjs';
import { Col, Row, Space, Typography } from 'antd';

import RightOptions from './RightOptions';
import Allocations from './Allocation';

const TrackingListContent = ({ trackingList }) => {
  return (
    <Space wrap={true}>
      {(trackingList || []).map((item, index) => {
        const { cvId, jdId, trackingId, cvName } = item;
        return (
          <Typography.Link key={index} href={`/ats/candidate/${cvId}?jobId=${jdId}&id=${trackingId}`} target="_blank">
            {cvName}
          </Typography.Link>
        );
      })}
    </Space>
  );
};

const BillCenterDetail = createWithRemoteLoader({
  modules: [
    'components-core:Layout@Page',
    'components-core:Global@usePreset',
    'components-core:InfoPage',
    'components-core:InfoPage@CentralContent',
    'components-core:Content',
    'components-core:FilePreview',
    'components-core:StateTag',
    'components-core:Enum',
    'components-core:InfoPage@formatView'
  ]
})(({ remoteModules, ...props }) => {
  const [Page, usePreset, InfoPage, CentralContent, Content, FilePreview, StateTag, Enum, formatView] = remoteModules;
  const { apis } = usePreset();
  const { id } = useParams();
  const calcList = (billItem, trackingList) => {
    const typeId = get(billItem, `typeId`);

    const billAmount = {
      label: '账单金额',
      content: `${get(billItem, `amount`) ? formatView(get(billItem, `amount`), 'number--100') : 0}元`
    };

    const attachmentsContent = (get(billItem, 'attachments') || []).map((item, index) => {
      return (
        <Space key={index} direction="vertical">
          <FilePreview originName={item.originalName} value={item.id} />
        </Space>
      );
    });

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
          { label: 'onsite人员', content: attachmentsContent }
        ];
        break;
      // Mapping
      case 2:
        list = [billAmount, { label: 'mapping报告', content: attachmentsContent }];
        break;
      // 项目管理、项目启动金、其他
      case 3:
      case 4:
      case 8:
        list = [billAmount];
        break;
      // 内推
      case 5:
        list = [billAmount, { label: '内推人数', content: `${get(billItem, `num`) || '-'}人` }, { label: '内推名单', content: attachmentsContent }];
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
        content: billItem.typeId ? billItem.typeName || '其他' : ''
      },
      ...list
    ];
    return _list;
  };
  return (
    <Fetch
      {...Object.assign({}, apis.candidateBill.getBillDetail, { params: { id } })}
      render={({ data, reload }) => {
        const { bill, billItems, allocations, userInfos } = data;
        return (
          <Page {...props} option={<RightOptions />}>
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
                                  // TODO 预览合同详情
                                  console.log('contractId:', contractId);
                                }}
                              >
                                预览
                              </Typography.Link>
                            </Col>
                          </Row>
                        )
                      },
                      { name: 'projectName', title: '项目', display: !!get(bill, 'projectId') },
                      {
                        name: 'feeType',
                        title: '费用类别',
                        render: feeType => (feeType ? { 1: '招聘费', 2: '服务费' }[feeType] : '-')
                      }
                    ]}
                  />
                </InfoPage.Part>
                <InfoPage.Part title="账单费用信息">
                  {bill.type === 1 && (
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
                  )}
                  <InfoPage.Part>
                    <CentralContent
                      dataSource={bill}
                      col={1}
                      columns={[
                        {
                          valueIsEmpty: () => false,
                          name: 'tracking',
                          title: '账单候选人',
                          render: () => <TrackingListContent trackingList={billItems[0].trackingList} />,
                          display: get(bill, 'type') !== 1
                        },
                        {
                          valueIsEmpty: () => false,
                          name: 'typeId',
                          title: '账单类目',
                          render: () => (billItems[0].billItem.typeId ? billItems[0].billItem.typeName : ''),
                          display: get(bill, 'type') !== 1
                        },
                        {
                          name: 'amount',
                          title: '标准账单总金额',
                          render: value => `${value ? formatView(value, 'number--100') : 0}元`,
                          display: get(bill, 'type') !== 1
                        },
                        { name: 'amount', title: '账单总金额', render: value => `${value ? formatView(value, 'number--100') : 0}元` },
                        { name: 'remark', title: '备注' },
                        { name: 'amountDiffReason', title: '标准账单总金额与自填账单总金额不一致的原因', display: get(bill, 'type') !== 1 },
                        {
                          name: 'attachments',
                          title: '附件',
                          render: attachments =>
                            (attachments || []).map((item, index) => {
                              return (
                                <Space key={index} direction="vertical">
                                  <FilePreview originName={item.originalName} value={item.id} />
                                </Space>
                              );
                            })
                        }
                      ]}
                    />
                  </InfoPage.Part>
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
                                  // TODO 预览 payment 详情
                                  console.log('paymentId:', paymentId);
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
          </Page>
        );
      }}
    />
  );
});

export default BillCenterDetail;
