import { createWithRemoteLoader } from '@kne/remote-loader';
import get from 'lodash/get';

const InvoicedAmountTooltipContent = createWithRemoteLoader({
  modules: ['components-core:InfoPage@TableView', 'components-core:StateTag', 'components-core:InfoPage@formatView']
})(({ remoteModules, columns, dataSource, invoiceStateEnum }) => {
  const [TableView, StateTag, formatView] = remoteModules;

  const defaultColumns = [
    {
      name: 'id',
      title: '发票ID'
    },
    {
      name: 'state',
      title: '状态',
      render: value => {
        const invoiceState = invoiceStateEnum.find(item => item.value === value);
        return <StateTag type={get(invoiceState, 'type')} text={get(invoiceState, 'description')} />;
      }
    },
    {
      name: 'amount',
      title: '发票金额',
      render: value => formatView(value || 0, 'number--100')
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

const InvoicedAmountTooltip = createWithRemoteLoader({
  modules: ['components-core:Tooltip', 'components-core:Enum', 'components-core:InfoPage@formatView']
})(({ remoteModules, columns = ['id', 'state', 'amount'], rowKey = 'cvName', invoicedAmount, ...props }) => {
  const [Tooltip, Enum, formatView] = remoteModules;
  return (
    <Tooltip
      content={
        <Enum moduleName="INVOICE_STATE_ENUM">
          {invoiceStateEnum => <InvoicedAmountTooltipContent columns={columns} {...props} invoiceStateEnum={invoiceStateEnum} />}
        </Enum>
      }
    >
      {formatView(invoicedAmount || 0, 'number--100')}
    </Tooltip>
  );
});

export default InvoicedAmountTooltip;
