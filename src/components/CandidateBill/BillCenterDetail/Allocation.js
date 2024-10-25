import { createWithRemoteLoader } from '@kne/remote-loader';
import get from 'lodash/get';
import { useCallback, useMemo } from 'react';

const Allocations = createWithRemoteLoader({
  modules: ['components-core:InfoPage', 'components-core:InfoPage@formatView', 'components-core:Content']
})(({ remoteModules, allocations, userInfos, billAmount }) => {
  const [InfoPage, formatView, Content] = remoteModules;
  const userMap = useMemo(() => new Map((userInfos || []).map(item => [item.uid, item])), [userInfos]);

  const allocationFormat = useCallback(
    item => {
      return {
        name: `${get(userMap.get(item.uid), 'englishName', '')} ${get(userMap.get(item.uid), 'name', '')}`,
        amount: formatView(item.amount, 'number--100'),
        amountPercent: item.amount && billAmount ? formatView(item.amount / billAmount, 'number-percent') : null
      };
    },
    [allocations, billAmount]
  );

  return (
    <InfoPage.Collapse defaultActiveKey={(allocations || []).map(allocation => allocation.id)}>
      {(allocations || []).map((allocation, index) => {
        const { name, amount, amountPercent } = allocationFormat(allocation);
        return (
          <InfoPage.Collapse.Panel key={allocation.id} header={`业绩分配${index + 1}`}>
            <Content
              labelAlign="auto"
              col={3}
              gutter={[0, 12]}
              list={[
                { label: '分配用户', content: name },
                { label: '分配金额', content: `${amount}元` },
                { label: '分配比例', content: `${amountPercent}` }
              ]}
            />
          </InfoPage.Collapse.Panel>
        );
      })}
    </InfoPage.Collapse>
  );
});

export default Allocations;
