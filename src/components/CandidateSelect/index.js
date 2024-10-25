import { useRef } from 'react';
import { createWithRemoteLoader } from '@kne/remote-loader';

const CandidateSelect = createWithRemoteLoader({
  modules: [
    'components-field:BatchSelect',
    'components-core:Common@SuperSelectTableListField',
    'components-core:Global@usePreset',
    'components-core:Filter'
  ]
})(({ remoteModules, clientId, phases, ...props }) => {
  const [BatchSelect, SuperSelectTableListField, usePreset, Filter] = remoteModules;
  const { apis } = usePreset();
  const { getFilterValue } = Filter;
  const { SuperSelectFilterItem } = Filter.fields;
  const ref = useRef(null);
  const callbackRef = useRef(null);
  return (
    <>
      <BatchSelect
        {...props}
        labelRender={({ label, value }) => {
          return `${label}:${(value && value.length) || 0}人`;
        }}
        columns={[
          {
            title: '候选人姓名',
            name: 'candidateName',
            type: 'user'
          },
          {
            title: '职位',
            name: 'deliveryPosition',
            type: 'mainInfo',
            hover: false,
            primary: false
          }
        ]}
        onAdd={(value, callback) => {
          callbackRef.current = null;
          ref.current.setValue(value);
          ref.current.onOpenChange(true);
          callbackRef.current = callback;
        }}
      />
      <div style={{ display: 'none' }}>
        <SuperSelectTableListField
          valueKey="id"
          labelKey="candidateName"
          filterRender={({ setSearchProps }) => {
            return (
              <Filter
                extra={<Filter.SearchInput name="search" label="关键字" />}
                list={[
                  [
                    <SuperSelectFilterItem
                      api={Object.assign({}, apis.position.getMyList, { data: { clientId } })}
                      dataFormat={data => {
                        return {
                          list: data.pageData.map(item => {
                            return Object.assign({}, item, {
                              value: item.id,
                              label: item.name
                            });
                          }),
                          total: data.totalCount
                        };
                      }}
                      name="jdIds"
                      label="职位"
                    />
                  ]
                ]}
                onChange={value => {
                  setSearchProps(getFilterValue(value));
                }}
              />
            );
          }}
          api={Object.assign({}, apis.ats.getTrackingList, {
            data: { clientIds: [clientId], phases },
            transformData: data => {
              return {
                pageData: data.pageData.data,
                totalCount: data.totalCount
              };
            }
          })}
          ref={ref}
          isPopup={false}
          columns={[
            {
              title: '候选人姓名',
              name: 'candidateName',
              span: 12
            },
            {
              title: '职位',
              name: 'deliveryPosition',
              span: 12
            }
          ]}
          onChange={value => {
            callbackRef.current && callbackRef.current(value);
          }}
        />
      </div>
    </>
  );
});

export default CandidateSelect;
