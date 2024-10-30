import { createWithRemoteLoader } from '@kne/remote-loader';
import getColumns from './getColumns';
import ListOptions from './ListOptions';

const BillCenter = createWithRemoteLoader({
  modules: [
    'components-core:Layout@TablePage',
    'components-core:Filter',
    'components-core:Global@usePreset',
    'components-core:InfoPage@formatView',
    'components-core:Permissions@usePermissionsPass'
  ]
})(({ remoteModules }) => {
  const [TablePage, Filter, usePreset, formatView, usePermissionsPass] = remoteModules;
  const { apis } = usePreset();
  const { getFilterValue } = Filter;
  const hasPositionAuth = usePermissionsPass({ request: ['jd:job:look'] });
  const hasTalentAuth = usePermissionsPass({ request: ['cv:cv:look'] });

  return (
    <ListOptions>
      {({ ref, filter, topOptions, topArea, optionsColumn }) => {
        const filterValue = getFilterValue(filter.value);
        return (
          <TablePage
            {...apis.candidateBill.getBillList}
            data={filterValue}
            ref={ref}
            topArea={topArea}
            columns={[...getColumns({ formatView, hasPositionAuth, hasTalentAuth }), optionsColumn]}
            name="setting-user"
            page={{
              filter,
              titleExtra: topOptions
            }}
            transformData={data => {
              return Object.assign({}, data, {
                userMap: new Map((data?.userInfos || []).map(item => [item.uid, item]))
              });
            }}
          />
        );
      }}
    </ListOptions>
  );
});

export default BillCenter;
