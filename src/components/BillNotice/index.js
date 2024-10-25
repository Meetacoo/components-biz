import { useMemo, forwardRef } from 'react';
import FormatDocumentBuilder from '@kne/format-document-builder';
import getFormData from './getFormData';
import parseTemplate from './parseTemplate';
import '@kne/format-document-builder/dist/index.css';

const BillNotice = forwardRef(({ data: paymentNoticeData, ...others }, ref) => {
  const { userInfo } = paymentNoticeData;
  const paymentPdf = useMemo(() => {
    const { paymentPdfInit } = paymentNoticeData;
    return Object.assign({}, paymentPdfInit, paymentNoticeData.paymentPdf);
  }, [paymentNoticeData]);

  const { paymentNoticePro } = paymentPdf;

  return (
    <FormatDocumentBuilder
      {...others}
      ref={ref}
      data={getFormData({ paymentNoticePro, paymentPdf })}
      template={parseTemplate({
        paymentNoticePro,
        paymentPdf,
        paymentNoticeData,
        userInfo
      })}
    />
  );
});

export default BillNotice;
