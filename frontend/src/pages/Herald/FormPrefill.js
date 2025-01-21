import React, { useState } from 'react';
import { Alert, Button, Spin,  } from 'antd';
import moment from 'moment';
import pdfData from '../../assets/files/Sample_print_2.pdf';

// const { Option } = Select;

const FileUploadForm = ({ form }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const PROD_URL = 'http://34.204.36.193:5000';

  const processFields = (fields, type) => {
    const prefillData = {};

    fields.forEach((field) => {
      const fieldId = type === "Risk" ? field.risk_parameter_id : field.coverage_parameter_id;

      if (!fieldId) {
        console.warn(`Missing field ID for ${type} field:`, field);
        return;
      }

      // Default value handling based on input type
      switch (field.input_type) {
        case "short_text":
          prefillData[fieldId] = field.value || "";
          break;
        case "integer":
        case "number":
          prefillData[fieldId] = parseInt(field.value) || 0;
          break;
        case "email":
          prefillData[fieldId] = field.value ? String(field.value).toLowerCase() : "";
          break;
        case "phone":
          prefillData[fieldId] = field.value ? String(field.value).replace(/\D/g, '') : "";
          break;
        case "select_one":
          if (field.schema?.enum?.includes(field.value)) {
            prefillData[fieldId] = field.value;
          } else if (typeof field.value === 'boolean' || /^(yes|no)$/i.test(field.value)) {
            prefillData[fieldId] = String(field.value).toLowerCase();
          }
          break;
        case "select_many":
          if (Array.isArray(field.value)) {
            prefillData[fieldId] = field.value.filter(v => field.schema?.items?.enum?.includes(v));
          } else {
            prefillData[fieldId] = [];
          }
          break;
        case "date":
          try {
            prefillData[fieldId] = field.value ? moment(field.value).format("YYYY-MM-DD") : null;
          } catch {
            prefillData[fieldId] = null;
          }
          break;
        case "address":
          // Handle address fields by creating nested form field names
          if (field.value && typeof field.value === 'object') {
            const addressValue = field.value;
            prefillData[`${fieldId}.line1`] = addressValue.line1 || '';
            prefillData[`${fieldId}.organization`] = addressValue.organization || '';
            prefillData[`${fieldId}.city`] = addressValue.city || '';
            prefillData[`${fieldId}.state`] = addressValue.state || '';
            prefillData[`${fieldId}.postal_code`] = addressValue.postal_code || '';
            prefillData[`${fieldId}.country_code`] = addressValue.country_code || '';
          }
          break;
        case "currency":
          prefillData[fieldId] = parseFloat(field.value) || 0;
          break;
        default:
          prefillData[fieldId] = field.value || "";
      }
    });

    return prefillData;
  };

  const handlePrefill = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetch(pdfData);
      const pdfBlob = await response.blob();
      const file = new File([pdfBlob], 'Sample_print_2.pdf', { type: 'application/pdf' });

      const formData = new FormData();
      formData.append('file', file);

      const apiResponse = await fetch(`${PROD_URL}/api/process_doc`, {
        method: 'POST',
        body: formData,
      });

      if (!apiResponse.ok) {
        const responseData = await apiResponse.json();
        throw new Error(responseData.message || 'File processing failed.');
      }

      const responseData = await apiResponse.json();
      console.log('Raw API Response:', responseData);

      if (!responseData.application_details) {
        throw new Error('Invalid response format: missing application details');
      }

      const { risk_values, coverage_values } = responseData.application_details;

      // Process values
      const riskValues = processFields(risk_values || [], "Risk");
      const coverageValues = processFields(coverage_values || [], "Coverage");

      // Combine values
      const formValues = {
        ...riskValues,
        ...coverageValues,
      };

      console.log('Final form values:', formValues);
      form.setFieldsValue(formValues);
      setSuccess(true);

    } catch (err) {
      setError(err.message);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Address field renderer component
//   const renderAddressField = ({ fieldKey, parameter_text, schema }) => {
//     return (
//       <div key={fieldKey}>
//         <h4>{parameter_text.agent_facing_text}</h4>
//         <Form.Item
//           name={`${fieldKey}.line1`}
//           label="Street Address"
//           rules={[{ required: false }]}
//         >
//           <Input placeholder="Enter street address" />
//         </Form.Item>

//         <Form.Item
//           name={`${fieldKey}.organization`}
//           label="Organization"
//           rules={[{ required: false }]}
//         >
//           <Input placeholder="Enter organization" />
//         </Form.Item>

//         <Form.Item
//           name={`${fieldKey}.city`}
//           label="City"
//           rules={[{ required: false }]}
//         >
//           <Input placeholder="Enter city" />
//         </Form.Item>

//         <Form.Item
//           name={`${fieldKey}.state`}
//           label="State"
//           rules={[{ required: false }]}
//         >
//           <Input placeholder="Enter state" />
//         </Form.Item>

//         <Form.Item
//           name={`${fieldKey}.postal_code`}
//           label="ZIP Code"
//           rules={[{ required: false }]}
//         >
//           <Input placeholder="Enter ZIP code" />
//         </Form.Item>

//         <Form.Item
//           name={`${fieldKey}.country_code`}
//           label="Country"
//           rules={[{ required: false }]}
//         >
//           <Input placeholder="Enter country" />
//         </Form.Item>
//       </div>
//     );
//   };

  return (
    <>
      <Button
        type="primary"
        onClick={handlePrefill}
        disabled={loading}
        style={{ marginRight: '16px' }}
      >
        {loading ? <Spin size="small" /> : 'Prefill Form'}
      </Button>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          closable
          onClose={() => setError(null)}
          style={{ marginTop: '8px' }}
        />
      )}

      {success && (
        <Alert
          message="Success"
          description="Form has been prefilled"
          type="success"
          closable
          onClose={() => setSuccess(false)}
          style={{ marginTop: '2px' }}
        />
      )}
    </>
  );
};

export default FileUploadForm;