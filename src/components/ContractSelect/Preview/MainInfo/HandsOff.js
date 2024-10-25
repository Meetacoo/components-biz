import { createWithRemoteLoader } from '@kne/remote-loader';
import get from 'lodash/get';

const HandsOff = createWithRemoteLoader({
  modules: ['components-core:InfoPage', 'components-core:InfoPage@CentralContent', 'components-core:Enum']
})(({ remoteModules, showRemark, data }) => {
  const [InfoPage, CentralContent, Enum] = remoteModules;
  return (
    <InfoPage.Part title="hands-off信息">
      <CentralContent
        dataSource={data}
        columns={[
          {
            valueIsEmpty: () => false,
            name: 'hasHandsOff',
            title: '是否有针对乙方的hands-off条款',
            format: 'boolean'
          },
          {
            display: get(data, 'hasHandsOff', null) === 1,
            name: 'handsOffTime',
            title: 'hands-off周期',
            getValueOf: data => [data.handsOffStart, data.handsOffEnd],
            format: 'dateRange'
          },
          {
            display: get(data, 'hasHandsOff', null) === 1,
            name: 'handsOffPreservedRange',
            title: '禁猎公司范围',
            render: value => {
              return <Enum moduleName="handsOffCompanyEnum" name={value} />;
            }
          },
          {
            display: get(data, 'hasHandsOff', null) === 1,
            name: 'handsOffLiability',
            title: '是否有赔偿责任',
            format: 'boolean'
          },
          {
            display: get(data, 'hasHandsOff', null) === 1,
            name: 'handsOffDesc',
            title: '针对乙方的hands-off条款内容'
          },
          {
            display: showRemark,
            name: 'handsOffRemark',
            title: '备注',
            block: true
          }
        ]}
      />
    </InfoPage.Part>
  );
});

export default HandsOff;
