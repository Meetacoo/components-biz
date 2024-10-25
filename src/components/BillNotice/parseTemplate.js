const parseTemplate = ({ paymentPdf, paymentNoticeData, userInfo }) => {
  const { projects = [], totalAmount = '', serviceFee = '', addedValueTax = '', paymentPdfInit = {} } = paymentNoticeData;
  const { paymentNoticePro = {} } = paymentPdfInit;

  let projectsTemp = [];
  (projects || []).forEach(item => {
    const commonInfo = {
      projectType: item.projectType,
      costType: item.costType === 1 ? '招聘费' : '服务费'
    };
    if ((item.trackingList || []).length) {
      const trackingIdList = item.trackingList.map((listItem, index) =>
        Object.assign({}, listItem, commonInfo, {
          amount: item.trackingList.length === 1 ? item.amount : ''
        })
      );
      projectsTemp = [...projectsTemp, ...trackingIdList];
    } else if ((item.onsiteList || []).length) {
      const onsiteList = item.onsiteList.map(listItem => Object.assign({}, listItem, commonInfo));
      projectsTemp = [...projectsTemp, ...onsiteList];
    } else {
      projectsTemp.push(Object.assign({}, item, commonInfo));
    }
  });

  let projectsTemplate = '';
  projectsTemp.forEach((item, index) => {
    projectsTemplate =
      projectsTemplate +
      `<tr style='text-align: center;font-size: 14px;line-height: 28px;' key={${'project' + index}}>
                    <td>${item.costType || ''}</td>
                    <td>${item.candidateName || item.projectType || ''}</td>
                    <td>${item.jdName || ''}</td>
                    <td>${`<span style='margin-left: 4px;margin-top: 4px;width: 120px;display: inline-block;' class='selected-onboard-date' data-index="${index}"><%=data.onboardDate && data.onboardDate[${index}]%></span>`}</td>
                    <td>${projectsTemp.length === 1 && index === 0 ? serviceFee || '' : ''}</td>
                    <td>${projectsTemp.length === 1 && index === 0 ? addedValueTax || '' : ''}</td>
                    <td>${item.amount || ''}</td>
                    ${index === 0 ? `<td rowspan='` + (projectsTemp.length || 1) + `' style='width: 150px;max-width: 150px;line-height: 20px;vertical-align: top'><div style='margin-left: 4px;margin-top: 4px;width: 120px;' class='selected-remark'><%=data.remark%></div></td>` : ''}
        </tr>`;
  });

  return `
<html lang='zh-cn'>
            <body>
              <div style="padding: 48px">
                <div style='display: flex;margin-bottom: 40px;'>
                  <img style='margin-right: 46px;width: 160px;height: 23px;' src="${paymentNoticePro.logo}" />
                  <div>
                    <div style='font-size: 16px;font-weight: 500;color: #222222;line-height: 22px;'>
                      <div>${paymentNoticePro.companyName}</div>
                      <div>${paymentNoticePro.companyEnName}</div>
                    </div>
                    <div style='font-size: 12px;color: #222222;line-height: 18px;margin-top: 8px;'>
                      <div>${paymentNoticePro.address}</div>
                      <div>${paymentNoticePro.enAddress}</div>
                      <div>
                          <span style='margin-right: 8px;'>${paymentNoticePro.contactPhone}</span>
                          <span>${paymentNoticePro.website}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style='text-align: center;font-weight: 500;color: #222222;line-height: 33px;font-size: 24px;padding-bottom: 24px;margin-bottom: 8px;border-bottom: 1px solid #999999;'>
                付款通知书 / Payment Notice</div>
                <div style='display: flex;margin-bottom: 35px;font-size: 14px;font-weight: 400;color: #222222;line-height: 32px;word-break: break-all;'>
                  <div style='width: 50%'>
                    <%if(!isDeletedField('clientName')){%>
                    <div>致 / To:<span style='margin-left: 8px;color: #666666;display: inline-block;max-width: 50%;vertical-align: top;' class='selected-client-name'><%=data.clientName%></span></div>
                    <%}%>
                    <div>客户号 / Client #:<span style='margin-left: 8px;color: #666666;display: inline-block;max-width: 50%;vertical-align: top;' class='selected-client-num'><%=data.clientNum%></div>
                    <div>Client Name (Chinese):<span style='margin-left: 8px;color: #666666;display: inline-block;max-width: 50%;vertical-align: top;' class='selected-client-name-chinese'><%=data.clientNameChinese%></span></div>
                    <div>Client Name (English):<span style='margin-left: 8px;color: #666666;display: inline-block;max-width: 50%;vertical-align: top;' class='selected-client-name-english'><%=data.clientNameEnglish%></span></div>
                    <div>Client address:<span style='margin-left: 8px;color: #666666;'>${paymentPdf.address[0]}</span></div>
                    <div>Attention:<span style='margin-left: 8px;color: #666666;display: inline-block;max-width: 50%;vertical-align: top;' class="selected-attention"><%=data.attention%></span></div>
                    <div>Contact #</div>
                  </div>
                  <div>
                    <div>日期 / Date:<span style='margin-left: 8px;color: #666666;display: inline-block;' class="selected-date"><%=data.date%></span></div>
                    <div>Consultant:</div>
                    <div>Team:<span style='margin-left: 8px;color: #666666;'>${paymentPdf.team || ''}</span></div>
                  </div>
                </div>
                <table border='1' style='border: 1px solid #999;border-collapse:collapse;width: 100%;'>
                  <tr style='color: #222222;font-size: 14px;line-height: 20px;'>
                    <th rowspan="5" style='text-align: center;font-size: 16px;line-height: 22px;font-weight: 500;'>发票信息</th>
                    <td colspan='2' style='height: 32px;'>是否增值税一般纳税人</td>
                    <td colspan='6' style='color: #666666;'></td>
                  </tr>
                  <tr style='font-size: 14px;line-height: 20px;'>
                    <td colspan='2' style='height: 32px;'>发票抬头：</td>
                    <td colspan='6' style='color: #666666;'></td>
                  </tr>
                  <tr style='font-size: 14px;line-height: 20px;'>
                    <td colspan='2' style='height: 32px;'>纳税人识别号：</td>
                    <td colspan='6' style='color: #666666;'></td>
                  </tr>
                  <tr style='font-size: 14px;line-height: 20px;'>
                    <td colspan='2' style='height: 32px;'>地址、电话：</td>
                    <td colspan='6' style='color: #666666;'></td>
                  </tr>
                  <tr style='font-size: 14px;line-height: 20px;'>
                    <td colspan='2' style='height: 32px;'>开户行及账号：</td>
                    <td colspan='6' style='color: #666666;'></td>
                  </tr>
                  <tr style='text-align: center;font-size: 14px;line-height: 22px;font-weight: 500;'>
                    <td>费用类别<br/>Payment for</td>
                    <td>候选人姓名<br/>Candidate</td>
                    <td>岗位<br/>Position</td>
                    <td>报到日期<br/>Onboard Date</td>
                    <td>服务费<br/>Service Fee<br/>(CNY)</td>
                    <td>增值税<br/>VAT<br/>(CNY)</td>
                    <td>总金额<br/>Total Amount<br/>(CNY)</td>
                    <td>备注<br/>Remark</td>
                  </tr>
                  ${projectsTemplate}
                  <tr style='height: 40px;font-size: 14px;line-height: 22px;font-weight: 500;'>
                    <td></td>
                    <td colspan='5'>总费用 / total amount due</td>
                    <td style='text-align: center;font-size: 14px;font-weight: 400;'>${totalAmount || ''}</td>
                    <td></td>
                  </tr>
                  <tr style='font-size: 16px;line-height: 22px;font-weight: 500;'>
                    <td></td>
                    <td colspan='8'>
                      <div style='font-size: 16px;line-height: 22px;font-weight: 500;display: inline-block;' class="selected-bank-info-operation">我司银行账户信息 / Bank Account Detail</div><span style="opacity: 0;display: inline-block;"><%=data.bankInfoOperation%></span>
                      <div style='font-size: 14px;line-height: 32px;display: flex;'>
                        <div style='width: 170px;'>
                          <div>开户名 / Acc. Name：</div><br/>
                          <div>开户行 / Bank：</div><br/>
                          <div>账号 / Acc. Number：</div>
                          <div>SWIFT code：</div>
                        </div>
                        <div style='color: #666666;' class="selected-bank-info">
                          <div><%=data.bankInfo?.openingAccountName%></div>
                          <div><%=data.bankInfo?.openingAccountEnName%></div>
                          <div><%=data.bankInfo?.bankName%></div>
                          <div><%=data.bankInfo?.bankEnName%></div>
                          <div><%=data.bankInfo?.bankNo%></div>
                          <div><%=data.bankInfo?.swiftCode%></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </table>
                <div style='margin-top: 16px;'>
                  <div style='font-size: 16px;font-weight: 500;color: #222222;line-height: 22px;margin-bottom: 16px;'>特别批注 / special note</div>
                  <div style='font-size: 14px;font-weight: 400;color: #222222;line-height: 24px;'>
                  烦请您在3（叁）个工作日内确认以上金额。本付款通知书不是税务发票。当您确认以上金额无误后我们将开具税务发票。<br/>
Please confirm within 3 (three) working days. This Payment Notice is not an official tax invoice. We will issue the official tax invoice upon your confirmation of the abovementioned amount.<br/>
烦请您务必确认发票信息是否正确，如退换、遗失发票，请务必在当月提出，并配合我们按照税务局要求完成退换、遗失流程。<br/>
Please make sure the information of VAT invoice is correct. IF you exchange or lose the invoice, please let us know within the current month, and cooperate with us in accordance with the requirements of the tax bureau completed return and loss processes.<br/><br/>
如果您对本通知书有疑问，请与以下人员联系：<br/>
Should you need further clarification of this notice, please liaise with the following person:<br/>
联系人 / contact：${userInfo.englishName || ''} ${userInfo.name || ''}<br/>
电话 / phone：${userInfo.phone || ''}<br/>
邮箱 / email：${userInfo.email || ''}<br/><br/>
顺颂，商祺<br/>
Sincerely yours,<br/>
北京仕邦达人力资源服务有限公司上海分公司<br/>
FA Talent Human Resources Service Co., Ltd. Shanghai Branch
                  </div>
                </div>
              </div>
            </body>
          </html>
`;
};

export default parseTemplate;
