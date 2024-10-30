import { createWithRemoteLoader } from '@kne/remote-loader';
import getColumns from './getColumns';
import { useRef, useState } from 'react';
import { Space } from 'antd';
import get from 'lodash/get';
import { EditBillButton } from '../GenerateBill';
import { EditBillProjectButton } from '../GenerateProjectBill';
import ListOptions from './ListOptions';

const BillCenter = createWithRemoteLoader({
  modules: ['components-core:Layout@TablePage', 'components-core:Filter', 'components-core:Global@usePreset', 'components-core:InfoPage@formatView']
})(({ remoteModules }) => {
  const [TablePage, Filter, usePreset, formatView] = remoteModules;
  const { apis } = usePreset();
  const { getFilterValue } = Filter;

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
            pagination={{ paramsType: 'params' }}
            columns={[...getColumns({ formatView }), optionsColumn]}
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
