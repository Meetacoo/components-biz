import { createWithRemoteLoader } from '@kne/remote-loader';
import { Button } from 'antd';

const RightOptions = createWithRemoteLoader({
  modules: [
    'components-core:InfoPage',
    'components-core:InfoPage@Flow',
    'components-core:InfoPage@Content',
    'components-core:Enum',
    'components-core:Modal@useModal'
  ]
})(({ remoteModules, data, records }) => {
  const [InfoPage, Flow, Content, Enum, useModal] = remoteModules;
  const modal = useModal();
  const billState = data.state;
  //可以展示流转记录
  if ([2, 3, 4, 5].indexOf(billState) > -1) {
    return (
      <InfoPage>
        <InfoPage.Part title="流转记录">
          <Flow
            dataSource={records}
            progressDot
            columns={[
              {
                type: 'title',
                name: 'state',
                render: value => {
                  return <Enum moduleName="BILL_EVENT_ENUM" name={value} />;
                }
              },
              {
                name: 'status',
                getValueOf: () => 'finish'
              },
              { type: 'subTitle', name: 'createdAt', format: 'datetime' },
              {
                type: 'description',
                name: 'name',
                render: (value, { target }) => {
                  return (
                    <Content
                      list={[
                        { label: '操作人', content: value },
                        {
                          label: '审批流程',
                          content: (
                            <Button
                              type="link"
                              size="small"
                              className="btn-no-padding"
                              onClick={() => {
                                modal({
                                  size: 'small',
                                  footer: null,
                                  children: '审批流程详情'
                                });
                              }}
                            >
                              查看详情
                            </Button>
                          )
                        },
                        {
                          label: '备注',
                          display: !!target.remark,
                          content: target.remark
                        }
                      ]}
                    />
                  );
                }
              }
            ]}
          />
        </InfoPage.Part>
      </InfoPage>
    );
  }

  return null;
});

export default RightOptions;
