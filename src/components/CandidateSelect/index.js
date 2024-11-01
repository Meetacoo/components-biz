import { useRef } from 'react';
import { createWithRemoteLoader } from '@kne/remote-loader';
import get from 'lodash/get';
import ProjectDetailSelectRenderList from '../ProjectSelect/ProjectDetailSelectRenderList';

const CandidateSelect = createWithRemoteLoader({
  modules: [
    'components-field:BatchSelect',
    'components-core:Common@SuperSelectTableListField',
    'components-core:Global@usePreset',
    'components-core:Filter',
    'components-core:Modal@useModal'
  ]
})(({ remoteModules, clientId, phases, ...props }) => {
  const [BatchSelect, SuperSelectTableListField, usePreset, Filter, useModal] = remoteModules;
  const { apis } = usePreset();
  const { getFilterValue } = Filter;
  const { SuperSelectFilterItem } = Filter.fields;
  const ref = useRef(null);
  const callbackRef = useRef(null);
  const modal = useModal();
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
          },
          {
            title: '项目细分服务',
            name: 'projectInfo',
            type: 'mainInfo',
            valueOf: ({ projectInfo }) => {
              return projectInfo ? (
                <span
                  onClick={() => {
                    modal({
                      title: '付款信息预览',
                      children: (
                        <ProjectDetailSelectRenderList
                          data={projectInfo}
                          fieldNames={{
                            serialNum: 'projectSerialNum',
                            name: 'projectName'
                          }}
                          dataSource={[get(projectInfo, 'projectPrice')]}
                        />
                      )
                    });
                  }}
                >
                  {(get(projectInfo, 'projectPrice.rsfwlx') || '') +
                    (get(projectInfo, 'projectPrice.rsxffw') || '') +
                    (get(projectInfo, 'projectPrice.rstj') || '')}
                </span>
              ) : null;
            }
          },
          {
            title: '标准账单金额',
            name: 'standardAmount',
            type: 'otherSmall'
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
          api={Object.assign({}, apis.ats.getList, {
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
              name: 'candidateName'
              // span: 6
            },
            {
              title: '职位',
              name: 'deliveryPosition'
              // span: 6
            }
            /*{
              title: '项目细分服务',
              name: 'projectPrice',
              span: 6
            },
            {
              title: '标准账单金额',
              name: 'standardAmount',
              span: 6
            }*/
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
