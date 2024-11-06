import company from './company.html';
import bankInfo from './bankInfo.html';
import footer from './footer.html';
import header from './header.html';
import table from './table.html';
import page from './index.html';
import template from 'lodash/template';

export const renderCompany = (data, options) => {
  return template(company)({ data: { company: data }, options });
};

export const renderBankInfo = (data, options) => {
  return template(bankInfo)({ data: { bankInfo: data }, options });
};

export const renderFooter = (data, options) => {
  return template(footer)({ data: { userInfo: data }, options });
};

export const renderHeader = (data, options) => {
  return template(header)({ data, options });
};

export const renderTable = (data, options) => {
  return template(table)({ data, options, content: { bankInfo: renderBankInfo(data.bankInfo) } });
};

export const renderPage = (data, options) => {
  return template(page)({
    data,
    options,
    content: {
      company: renderCompany(data.company, options),
      header: renderHeader(data, options),
      table: renderTable(data, options),
      footer: renderFooter(data, options)
    }
  });
};

const templateRenders = { renderCompany, renderBankInfo, renderFooter, renderHeader, renderTable, renderPage };

export default templateRenders;
