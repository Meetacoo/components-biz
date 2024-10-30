import { createWithRemoteLoader } from '@kne/remote-loader';
import { Typography } from 'antd';
import get from 'lodash/get';
import dayjs from 'dayjs';

const CandidateContent = ({ rowKey, dataSource, toAts, hasTalentAuth, hasPositionAuth }) => {
  return (
    <Typography.Link
      onClick={() => {
        if (dataSource.length === 1) {
          const record = dataSource[0];
          const { cvId, jdId, trackingId } = record;
          let linkUrl = `/ats/candidate/${cvId}?jobId=${jdId}&id=${trackingId}`;
          if (!toAts) {
            linkUrl = `/talent/resume/${cvId}`;
          }
          if (['jdName'].indexOf(rowKey) !== -1) {
            return get(record, 'jdId') && hasPositionAuth ? window.open(`/position/${get(record, 'jdId')}`, '_blank') : false;
          }
          return get(record, 'cvId') && hasTalentAuth ? window.open(linkUrl, '_blank') : false;
        }
      }}
    >
      {dataSource.length > 1
        ? `${['expectJoinedTime', 'joinedTime'].indexOf(rowKey) !== -1 ? (dataSource[0][rowKey] ? dayjs(dataSource[0][rowKey]).format('YYYY-MM-DD') : '-') : dataSource[0][rowKey]}...(${dataSource.length}人)`
        : dataSource
          ? dataSource
              .map(item =>
                ['expectJoinedTime', 'joinedTime'].indexOf(rowKey) !== -1
                  ? dataSource[0][rowKey]
                    ? dayjs(item[rowKey]).format('YYYY-MM-DD')
                    : '-'
                  : item[rowKey]
              )
              .join(',')
          : '-'}
    </Typography.Link>
  );
};

const CandidatesTooltipContent = createWithRemoteLoader({
  modules: ['components-core:InfoPage@TableView']
})(({ remoteModules, columns, dataSource, toAts, hasPositionAuth, hasTalentAuth }) => {
  const [TableView] = remoteModules;

  const defaultColumns = [
    {
      name: 'cvName',
      title: '候选人姓名',
      render: (value, { target }) =>
        value ? (
          <Typography.Link
            onClick={() => {
              if (get(target, 'cvId')) {
                if (!toAts && hasTalentAuth) {
                  window.open(`/talent/resume/${get(target, 'cvId')}`, '_blank');
                } else {
                  window.open(`/ats/candidate/${get(target, 'cvId')}?jobId=${get(target, 'jdId')}&id=${get(target, 'trackingId')}`, '_blank');
                }
              }
            }}
          >
            {value}
          </Typography.Link>
        ) : (
          '-'
        )
    },
    {
      name: 'jdName',
      title: '职位',
      render: (value, { target }) => {
        return target.jdId && hasPositionAuth ? (
          <Typography.Link
            onClick={() => {
              window.open(`/position/${target.jdId}`, '_blank');
            }}
          >
            {value || '-'}
          </Typography.Link>
        ) : (
          value || '-'
        );
      }
    }
  ];
  return dataSource?.length ? (
    <div style={{ minWidth: '280px' }}>
      <TableView dataSource={dataSource} columns={defaultColumns.filter(x => columns.some(it => it === x.name))} />
    </div>
  ) : (
    '-'
  );
});

const CandidatesTooltip = createWithRemoteLoader({
  modules: ['components-core:Tooltip']
})(({ remoteModules, columns = ['cvName', 'jdName'], rowKey = 'cvName', ...props }) => {
  const [Tooltip] = remoteModules;
  return (
    <Tooltip content={<CandidatesTooltipContent columns={columns} {...props} />}>
      <CandidateContent rowKey={rowKey} {...props} />{' '}
    </Tooltip>
  );
});

export default CandidatesTooltip;
