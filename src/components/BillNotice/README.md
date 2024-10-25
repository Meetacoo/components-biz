
# BillNotice


### 概述

用于展示活编辑BillNotice


### 示例

#### 示例代码

- 这里填写示例标题
- 这里填写示例说明
- _BillNotice(@components/BillNotice),_paymentData(@components/BillNotice/doc/paymentData.json)

```jsx
const { default: BillNotice } = _BillNotice;
const { default: paymentData } = _paymentData;
const BaseExample = () => {
  return <BillNotice data={paymentData} />;
};

render(<BaseExample />);

```


### API

|属性名|说明|类型|默认值|
|  ---  | ---  | --- | --- |

