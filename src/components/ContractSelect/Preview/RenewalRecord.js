import { createWithRemoteLoader } from '@kne/remote-loader';
import get from 'lodash/get';
import dayjs from 'dayjs';
import { Flex } from 'antd';

const RenewalRecord = createWithRemoteLoader({
  modules: [
    'components-core:InfoPage',
    'components-core:Content',
    'components-function:StepFlow',
    'components-core:Common@isNotEmpty',
    'components-core:Enum',
    'components-core:File@FileLink'
  ]
})(({ remoteModules, ...props }) => {
  const { data } = Object.assign({}, { data: [] }, props);
  const [InfoPage, Content, StepFlow, isNotEmpty, Enum, FileLink] = remoteModules;

  const recordDataSource = record => [
    {
      label: '合同开始时间',
      content: dayjs(get(record, 'renewalStartDate')).format('YYYY-MM-DD')
    },
    {
      label: '合同结束时间',
      content: dayjs(get(record, 'renewalEndDate')).format('YYYY-MM-DD')
    },
    {
      label: '自动延期',
      content: isNotEmpty(get(record, 'renewalAutoRenew')) ? <Enum moduleName="contractAutoReNewEnum" name={get(record, 'renewalAutoRenew')} /> : ''
    },
    {
      display: record.renewalAutoRenew === 1,
      label: '延期时长',
      content: record.unlimitedFlag === 'Y' ? '无限自动延期' : get(record, 'renewalDuration') ? `${get(record, 'renewalDuration')}年` : ''
    },
    {
      label: '附件',
      content: (
        <Flex vertical gap={8}>
          {(record.renewalAttachments || []).map((item, index) => {
            return <FileLink key={index} originName={item.originalName} id={item.id} />;
          })}
        </Flex>
      )
    },
    {
      label: '是否有针对乙方的hands-off条款',
      content: isNotEmpty(get(record, 'hasHandsOff')) ? (get(record, 'hasHandsOff') === 1 ? '是' : '否') : '-'
    },
    {
      display: get(record, 'hasHandsOff', null) === 1,
      label: 'hands-off周期',
      content:
        get(record, 'handsOffStart') && get(record, 'handsOffEnd')
          ? `${dayjs(get(record, 'handsOffStart')).format('YYYY-MM-DD')}-${dayjs(get(record, 'handsOffEnd')).format('YYYY-MM-DD')}`
          : '-'
    },
    {
      display: get(record, 'hasHandsOff', null) === 1,
      label: '禁猎公司范围',
      content: get(record, 'handsOffPreservedRange') ? <Enum moduleName="handsOffCompanyEnum" name={record.handsOffPreservedRange} /> : '-'
    },
    {
      display: get(record, 'hasHandsOff') === 1 && get(record, 'handsOffPreservedRange') === 2,
      label: '禁猎关联公司名单',
      content: '-'
    },
    {
      display: get(record, 'hasHandsOff') === 1,
      label: '是否有赔偿责任',
      content: isNotEmpty(record.handsOffLiability) ? (record.handsOffLiability ? '是' : '否') : '-'
    },
    {
      display: get(record, 'hasHandsOff') === 1,
      label: '针对乙方的hands-off条款内容',
      content: get(record, 'handsOffDesc') || '-'
    },
    {
      label: '备注',
      content: get(record, 'renewalRemark') ? get(record, 'renewalRemark') : '-'
    }
  ];

  return (
    <InfoPage>
      <InfoPage.Part title="续签记录">
        {data.length ? (
          <StepFlow
            current={-1}
            size="small"
            progressDot
            direction="vertical"
            items={data.map(item => {
              item = Object.assign({}, item);
              return {
                title: dayjs(item.createAt).format('YYYY-MM-DD HH:mm:ss'),
                status: 'finish',
                description: <Content labelAlign="auto" list={recordDataSource(item)} />
              };
            })}
          />
        ) : null}
      </InfoPage.Part>
    </InfoPage>
  );
});

export default RenewalRecord;
