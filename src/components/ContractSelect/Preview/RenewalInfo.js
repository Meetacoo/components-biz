import { createWithRemoteLoader } from '@kne/remote-loader';
import { Popover, Button } from 'antd';
import style from './style.module.scss';
import classnames from 'classnames';
import { useState } from 'react';
import RenewalRecord from './RenewalRecord';
import get from 'lodash/get';

const RenewalInfo = createWithRemoteLoader({
  modules: [
    'components-core:InfoPage',
    'components-core:InfoPage@CentralContent',
    'components-core:Icon',
    'components-core:Enum',
    'components-core:File@FileLink',
    'components-core:Common@SimpleBar'
  ]
})(({ remoteModules, data }) => {
  const [InfoPage, CentralContent, Icon, Enum, FileLink, SimpleBar] = remoteModules;
  const [recordOpen, setRecordOpen] = useState(false);
  return (
    <InfoPage.Part
      title="最新续签信息"
      extra={
        <Popover
          trigger="click"
          placement="bottomRight"
          open={recordOpen}
          arrow={false}
          onOpenChange={setRecordOpen}
          content={
            <SimpleBar style={{ width: '360px', maxHeight: '400px' }}>
              <RenewalRecord data={data.records} />
            </SimpleBar>
          }
        >
          <Button type="text">
            续签记录
            <Icon
              type="icon-arrow-thin-down"
              className={classnames(style[`title-record-arrow-${recordOpen ? 'down' : 'up'}`], style['title-record-arrow'])}
            />
          </Button>
        </Popover>
      }
    >
      <CentralContent
        columns={[
          {
            name: 'contractRenewal.renewalStartDate',
            title: '合同开始时间',
            format: 'date'
          },
          {
            name: 'contractRenewal.renewalEndDate',
            title: '合同结束时间',
            format: 'date'
          },
          {
            name: 'contractRenewal.renewalAutoRenew',
            title: '自动延期',
            render: value => <Enum moduleName="contractAutoReNewEnum" name={value} />
          },
          {
            display: value => value === 1,
            name: 'contractRenewal?.renewalAutoRenew',
            title: '延期时长',
            getValueOf: data => {
              return data.contractRenewal?.unlimitedFlag === 'Y'
                ? '无限自动延期'
                : get(data.contractRenewal, 'renewalDuration')
                  ? `${get(data.contractRenewal, 'renewalDuration')}年`
                  : '-';
            }
          },
          {
            name: 'contractRenewal.renewalAttachments',
            title: '附件',
            render: value => value.map((item, index) => <FileLink key={index} originName={item.originalName} id={item.id} />)
          },
          {
            name: 'contractRenewal.renewalRemark',
            title: '备注'
          }
        ]}
        dataSource={data}
      />
    </InfoPage.Part>
  );
});

export default RenewalInfo;
