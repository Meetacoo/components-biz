import { createWithRemoteLoader } from '@kne/remote-loader';
import { useMemo, forwardRef } from 'react';
import FormatDocumentBuilder from '@kne/format-document-builder';
import getFormData from './getFormData';
import parseTemplate from './parseTemplate';
import '@kne/format-document-builder/dist/index.css';

const BillNotice = createWithRemoteLoader({
  modules: ['components-core:FormInfo@fields', 'components-core:FormInfo@Form', 'components-core:Global@usePreset']
})(
  forwardRef(({ remoteModules, data: paymentNoticeData, ...others }, ref) => {
    const [fields, Form, usePreset] = remoteModules;
    const { userInfo } = paymentNoticeData;
    const { apis } = usePreset();
    const paymentPdf = useMemo(() => {
      const { paymentPdfInit } = paymentNoticeData;
      return Object.assign({}, paymentPdfInit, paymentNoticeData.paymentPdf);
    }, [paymentNoticeData]);

    const { SuperSelect } = fields;

    const { paymentNoticePro } = paymentPdf;

    return (
      <FormatDocumentBuilder
        fields={{ SuperSelect }}
        formRender={props => <Form {...props} />}
        {...others}
        ref={ref}
        data={getFormData({ paymentNoticePro, paymentPdf, api: apis.contract.getSubjectList })}
        template={parseTemplate({
          paymentNoticePro,
          paymentPdf,
          paymentNoticeData,
          userInfo
        })}
      />
    );
  })
);

export default BillNotice;
