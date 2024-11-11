import { useRef } from 'react';
import { createWithRemoteLoader } from '@kne/remote-loader';
import get from 'lodash/get';
import merge from 'lodash/merge';
import ProjectDetailSelectRenderList from '../ProjectSelect/ProjectDetailSelectRenderList';

/**
 * 可生成账单状态对应操作
 * 6  待安排客户面试
 * 7  待反馈客户{N}面
 * 8  客户{N}面通过
 * 9  客户{N}面不通过
 * 10 客户{N}面缺席
 * 12 已发offer待反馈
 * 13 待入职
 * 14 待反馈保证期结果
 * 15 通过保证期
 * 17 通过客户面试
 */
const billActions = {
  1: [14, 15, 13, 12], // 默认流程下
  2: [14, 15, 13, 12], // 简要流程下
  3: [6, 7, 8, 9, 10, 17] // 极简流程下客户面试阶段下所有操作
};

const CandidateSelect = createWithRemoteLoader({
  modules: [
    'components-field:BatchSelect',
    'components-core:Common@SuperSelectTableListField',
    'components-core:Global@usePreset',
    'components-core:Filter',
    'components-core:Modal@useModal',
    'components-core:InfoPage@formatView'
  ]
})(({ remoteModules, clientId, phases, ...props }) => {
  const [BatchSelect, SuperSelectTableListField, usePreset, Filter, useModal, formatView] = remoteModules;
  const { apis, ajax } = usePreset();
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
            type: 'otherSmall',
            valueOf: ({ standardAmount }) => formatView(standardAmount, 'number--100')
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
            transformData: async data => {
              const trackingIds = data.pageData.data.map(item => item.id);
              const { data: billResData } = await ajax(merge({}, apis.candidateBill.getTrackingBillState, { data: { trackingIds } }));
              const billStateList = get(billResData, 'data.billStateList') || [];
              const sendOfferMapping = new Map((get(data, 'pageData.sendOffers') || []).map(item => [item.trackingId.toString(), item]));
              const resData = data.pageData.data.map(item => {
                // 当前阶段可生成账单的状态集合
                const currentBillStates = billActions[item.processingId] || [];
                // 当前候选人是否已生成过账单
                const trackingCanBill = !(billStateList || []).find(x => +x.trackingId === +item.id);
                // 当前状态是否可生成账单
                const stateCanBill = currentBillStates.indexOf(item.state) !== -1;
                // 当前阶段是否可生成账单
                const canBill = trackingCanBill && stateCanBill;
                return Object.assign({}, item, { projectInfo: get(sendOfferMapping.get(item.id), 'projectInfo'), disabled: !canBill });
              });
              return {
                pageData: resData,
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
