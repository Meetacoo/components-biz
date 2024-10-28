const getColumns = () => {
  return [
    {
      title: '业务子类',
      name: 'rsywzl',
      type: 'serialNumberShort',
      fixed: 'left'
    },
    {
      title: '服务类型',
      name: 'rsfwlx',
      type: 'serialNumberShort',
      fixed: 'left'
    },
    {
      title: '细分服务',
      name: 'rsxffw',
      type: 'serialNumberShort'
    },
    {
      title: '条件',
      name: 'rstj',
      type: 'serialNumberShort'
    },
    {
      title: '单位',
      name: 'rsdw',
      type: 'serialNumberShort'
    },
    {
      title: '基准价格（费率）',
      name: 'rsjzjgfl',
      type: 'serialNumberShort'
    },
    {
      title: '岗位/职能',
      name: 'rsgwzn',
      type: 'serialNumberShort'
    },
    {
      title: '薪资模式',
      name: 'rsxzms',
      type: 'serialNumberShort'
    },
    {
      title: '月薪',
      name: 'rsyx',
      type: 'serialNumberShort'
    },
    {
      title: '年薪',
      name: 'rsnx',
      type: 'serialNumberShort'
    },
    {
      title: '金额',
      name: 'rsjg',
      type: 'serialNumberShort'
    },
    {
      title: '费率',
      name: 'rsfl',
      type: 'serialNumberShort',
      valueOf: (item, { name }) => {
        return !Number.isNaN(item[name]) ? `${(item[name] * 100).toLocaleString()}%` : item[name];
      }
    },
    {
      title: 'Marketup rate',
      name: 'rsmarkuprate',
      type: 'serialNumberShort',
      valueOf: (item, { name }) => {
        return !Number.isNaN(item[name]) ? `${(item[name] * 100).toLocaleString()}%` : item[name];
      }
    },
    {
      title: '预估收费',
      name: 'rsygsf',
      type: 'serialNumberShort'
    },
    {
      title: '保证期',
      name: 'bzq',
      type: 'serialNumberShort'
    }
  ];
};

export default getColumns;
