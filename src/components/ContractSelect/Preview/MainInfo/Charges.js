import { createWithRemoteLoader } from '@kne/remote-loader';
import range from 'lodash/range';
import { Space } from 'antd';
import get from 'lodash/get';

const Charges = createWithRemoteLoader({
  modules: ['components-core:InfoPage', 'components-core:Content', 'components-core:Enum']
})(({ remoteModules, data }) => {
  const [InfoPage, Content, Enum] = remoteModules;
  const { Collapse } = InfoPage;
  return (
    <InfoPage.Part title="收费说明">
      <Collapse
        defaultActiveKey={range(0, (data.charges || []).length)}
        items={(data.charges || []).map((item, index) => {
          let feeTypeItem = null;
          switch (get(item, 'chargeType')) {
            case 1:
              feeTypeItem = { label: '费率', content: `${get(item, 'chargeRate')}%` };
              break;
            case 2:
              feeTypeItem = { label: '固定收费', content: `${get(item, 'chargeFixed') / 100}元` };
              break;
            case 3:
              feeTypeItem = { label: '最低收费', content: get(item, 'chargeLower') };
              break;
            default:
              feeTypeItem = null;
          }
          let list = [
            { label: '收费名称', content: get(item, 'chargeName') },
            {
              label: '收费标准',
              content: item.chargeType ? <Enum moduleName="contractChargeTypeEnum" name={item.chargeType} /> : '-'
            }
          ];
          if (feeTypeItem && !list.some(x => x.label === feeTypeItem.label)) {
            list.splice(2, 0, feeTypeItem);
          }
          return {
            key: index,
            label: `收费说明${index + 1}`,
            children: (
              <Space size={[0, 12]} direction="vertical" className="space-full">
                <Content labelAlign="auto" col={3} gutter={[0, 12]} list={list} />
                <Content
                  labelAlign="auto"
                  col={1}
                  gutter={[0, 12]}
                  list={[
                    {
                      label: '收费备注',
                      content: get(item, 'chargeRemark', '-')
                    }
                  ]}
                />
              </Space>
            )
          };
        })}
      />
    </InfoPage.Part>
  );
});

export default Charges;
