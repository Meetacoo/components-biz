import bankData from './bankData.json';
import companyData from './companyData.json';
import paymentData from './paymentData.json';

const apis = {
  contract: {
    getSubjectList: {
      loader: () => {
        return companyData.data;
      }
    },
    getBankData: {
      loader: () => {
        return bankData.data;
      }
    }
  },
  payment: {
    getPaymentData: {
      loader: () => {
        return paymentData.data;
      }
    }
  }
};

export default apis;
