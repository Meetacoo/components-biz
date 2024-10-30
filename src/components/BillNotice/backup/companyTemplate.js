import template from 'lodash/template';

const companyTemplate = `<div style='display: flex;margin-bottom: 40px;'>
<div>
<img style='margin-right: 46px;width: 160px;height: auto;' src="<%=data.company.logo%>" />
</div>
                  <div>
                    <div style='font-size: 16px;font-weight: 500;color: #222222;line-height: 22px;'>
                      <div><%=data.company.companyName%></div>
                      <div><%=data.company.companyEnName%></div>
                    </div>
                    <div style='font-size: 12px;color: #222222;line-height: 18px;margin-top: 8px;'>
                      <div><%=data.company.address%></div>
                      <div><%=data.company.enAddress%></div>
                      <div>
                          <span style='margin-right: 8px;'><%=data.company.contactPhone%></span>
                          <span><%=data.company.website%></span>
                      </div>
                    </div>
                  </div>
                </div>`;

export default companyTemplate;

export const renderCompanyTemplate = company => {
  return template(companyTemplate)({ data: { company } });
};
