import { Space, Typography } from 'antd';

const TrackingListContent = ({ trackingList }) => {
  return (
    <Space wrap={true}>
      {(trackingList || []).map((item, index) => {
        const { cvId, jdId, trackingId, cvName } = item;
        return (
          <Typography.Link key={index} href={`/ats/candidate/${cvId}?jobId=${jdId}&id=${trackingId}`} target="_blank">
            {cvName}
          </Typography.Link>
        );
      })}
    </Space>
  );
};

export default TrackingListContent;
