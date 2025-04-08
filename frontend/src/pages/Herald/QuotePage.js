import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Spin, Typography, Collapse, Space, message, Tag, Divider, Dropdown } from 'antd';
import { DownloadOutlined, AntCloudOutlined, LoadingOutlined, FileTextOutlined, SecurityScanOutlined, DownOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Panel } = Collapse;
const PRODUCT_NAMES = {
  'prd_0050_herald_cyber': 'Herald Cyber',
  'prd_la3v_atbay_cyber': 'At-Bay Cyber',
  'prd_jk0g_cowbell_cyber': 'Cowbell Cyber',
};

const getProductName = (productId) => {
  return PRODUCT_NAMES[productId] || productId;
};

const QuotePage = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, setSubmissionData] = useState(null);
  const [detailedQuoteData, setDetailedQuoteData] = useState({});
  const [loadingQuoteDetails, setLoadingQuoteDetails] = useState({});
  const [businessName, setBusinessName] = useState('');
  const [loadedQuoteIds, setLoadedQuoteIds] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const submissionId = location.state?.submissionId;

  const api = axios.create({
    baseURL: 'https://sandbox.heraldapi.com',
    headers: {
      'Authorization': 'Bearer E4xGG8aD+6kcbID50Z7dfntunn8wsHvXKxb5gBB1pdw=',
      'Content-Type': 'application/json'
    }
  });

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  useEffect(() => {
    const fetchSubmissionData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!submissionId) {
          throw new Error("No submission ID provided");
        }

        const submissionResponse = await api.get(`/submissions/${submissionId}`);

        if (!submissionResponse.data?.submission) {
          throw new Error("Invalid submission data received");
        }

        const quotePreviewsWithDetails = await Promise.all(
          submissionResponse.data.submission.quote_previews.map(async (quote) => {
            try {
              const quoteDetails = await api.get(`/quotes/${quote.quote_id}`);
              return {
                ...quote,
                totalPremium: quoteDetails.data.quote.prices?.premium_with_taxes_and_fees || null
              };
            } catch (error) {
              console.error(`Error fetching details for quote ${quote.quote_id}:`, error);
              return { ...quote, totalPremium: null };
            }
          })
        );

        setSubmissionData(submissionResponse.data.submission);
        setQuotes(quotePreviewsWithDetails);

        // Extract business name from first quote's risk values
        const firstQuoteDetails = await api.get(`/quotes/${submissionResponse.data.submission.quote_previews[0].quote_id}`);
        // Add null check for risk_values before using find()
        const riskValues = firstQuoteDetails.data.quote.risk_values || [];
        const businessRiskValue = riskValues.find(
          (risk) => risk.risk_parameter_id === "rsk_m4p9_insured_name"
        )?.value;

        if (businessRiskValue) {
          setBusinessName(businessRiskValue);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to fetch data");

        if (error.message === "No submission ID provided") {
          navigate('/bulk-quote');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissionData();
  }, [submissionId, navigate]);

  const fetchQuoteDetails = async (quoteId) => {
    setLoadingQuoteDetails(prev => ({ ...prev, [quoteId]: true }));
    try {
      const response = await api.get(`/quotes/${quoteId}`);

      if (!response.data?.quote) {
        throw new Error("Invalid quote details received");
      }

      setDetailedQuoteData(prev => ({
        ...prev,
        [quoteId]: response.data.quote
      }));
      setLoadedQuoteIds(prev => [...prev, quoteId]);
    } catch (error) {
      console.error("Error fetching quote details:", error);
      message.error(error.message || "Failed to fetch quote details");
    } finally {
      setLoadingQuoteDetails(prev => ({ ...prev, [quoteId]: false }));
    }
  };
  const formatValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') {
      if (value.city) {
        return `${value.line1}, ${value.city}, ${value.state} ${value.postal_code}`;
      }
      return JSON.stringify(value);
    }
    if (typeof value === 'number') {
      if (value > 999999) {
        return value.toLocaleString();
      }
      return value.toString();
    }
    return value;
  };


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderQuoteDetails = (quote) => {
    const quoteData = detailedQuoteData[quote.quote_id];

    if (!loadedQuoteIds.includes(quote.quote_id)) {
      return (
        <Button
          onClick={() => fetchQuoteDetails(quote.quote_id)}
          loading={loadingQuoteDetails[quote.quote_id]}
          style={{ marginBottom: 16 }}
        >
          Load Full Details
        </Button>
      );
    }

    const sections = [
      {
        title: "Product Information",
        data: [
          { label: "Product Name", value: quoteData.product?.name },
          { label: "Product Line", value: quoteData.product?.product_line },
          { label: "Institution", value: quoteData.product?.institution?.name },
          { label: "Admitted", value: quoteData.admitted ? "Yes" : "No" },
          { label: "Bind Status", value: quoteData.bind_status },
          { label: "Quote Created", value: formatDate(quoteData.created_at) },
          { label: "Last Updated", value: formatDate(quoteData.updated_at) }
        ]
      },
      {
        title: "Insurance Details",
        data: (quoteData.insurers || []).map((insurer, index) => ([
          { label: `Insurer Name ${index + 1}`, value: insurer.name },
          { label: `NAIC Code ${index + 1}`, value: insurer.naic_code },
          { label: `Quota Share ${index + 1}`, value: `${insurer.quota_share}%` }
        ])).flat()
      },
      {
        title: "Pricing Information",
        data: [
          {
            label: "Premium Before Taxes and Fees",
            value: formatCurrency(quoteData.prices?.premium_before_taxes_and_fees)
          },
          {
            label: "Total Premium",
            value: formatCurrency(quoteData.prices?.premium_with_taxes_and_fees)
          }
        ]
      },
      {
        title: "Coverage Details",
        data: (quoteData.coverage_values || []).map(cv => ({
          label: cv.parameter_text?.agent_facing_text || cv.parameter_text?.applicant_facing_text,
          value: cv.input_type === 'currency' ? formatCurrency(cv.value) : formatValue(cv.value)
        }))
      },
      {
        title: "Risk Information",
        data: (quoteData.risk_values || []).map(rv => ({
          label: rv.parameter_text?.agent_facing_text || rv.parameter_text?.applicant_facing_text,
          value: rv.input_type === 'currency' ? formatCurrency(rv.value) : formatValue(rv.value)
        }))
      },
      {
        title: "Available Documents",
        data: (quoteData.files || []).map(file => ({
          label: "Document",
          value: `${file.text} (${file.type}) - ${file.status}`
        }))
      },

    ];

    return (
      <Collapse defaultActiveKey={['0']}>
        {sections.map((section, idx) => (
          section.data.length > 0 && (
            <Panel header={<Text strong>{section.title}</Text>} key={idx}>
              {section.data.map((item, i) => (
                <div key={i} className="detail-item">
                  <Text type="secondary">{item.label}</Text>
                  <div>{item.value}</div>
                  {i < section.data.length - 1 && <Divider />}
                </div>
              ))}
            </Panel>
          )
        ))}
      </Collapse>
    );
  };
  const getStatusTag = (status) => {
    const statusConfig = {
      active: { color: 'success', text: 'Active' },
      rejected: { color: 'error', text: 'Rejected' },
      declined: { color: 'error', text: 'Declined' },
      referral: { color: 'warning', text: 'Referral' }
    };

    const config = statusConfig[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const handleDownloadFile = async (quote, fileType) => {
    try {
      setLoading(true);
      // Check if quote status is active
      if (quote.status !== 'active') {
        message.error('Quote is not in an active state');
        return;
      }

      // Fetch quote details if not already loaded
      if (!detailedQuoteData[quote.quote_id]) {
        await fetchQuoteDetails(quote.quote_id);
      }

      const quoteData = detailedQuoteData[quote.quote_id];

      // Find the specific file
      const file = quoteData.files?.find(
        f => f.type === fileType && f.status === "available"
      );

      if (!file) {
        throw new Error(`No ${fileType.replace('_', ' ')} file available`);
      }

      const response = await axios.post(
        `https://sandbox.heraldapi.com/files/${file.id}/get_temporary_link`,
        null,
        {
          headers: {
            Authorization: `Bearer E4xGG8aD+6kcbID50Z7dfntunn8wsHvXKxb5gBB1pdw=`,
          },
        }
      );

      const fileUrl = response.data?.temporary_link?.link;
      if (fileUrl) {
        window.open(fileUrl, '_blank');
        message.success(`${fileType.replace('_', ' ').toUpperCase()} opened successfully`);
      } else {
        throw new Error("Failed to retrieve the download link");
      }
    } catch (error) {
      console.error(`Error fetching ${fileType} link:`, error);
      message.error(error.message || `An error occurred while fetching the ${fileType} link`);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={() => navigate('/bulk-quote')}>
              Return to Quote Selection
            </Button>
          }
        />
      </div>
    );
  }
  if (!quotes.length) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <Card>
          <Alert
            message="No Quotes Available"
            description="No quotes are available for the selected products. Please try selecting different products."
            type="info"
            showIcon
            action={
              <Button type="primary" onClick={() => navigate('/bulk-quote')}>
                Select Different Products
              </Button>
            }
          />
        </Card>
      </div>
    );
  }
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <h2>View Quote Details</h2>
          <Text type="secondary" style={{ fontSize: 18, fontWeight: 500 }}>Business Name: {businessName}</Text>
        </div>
        {quotes.map((quote) => (
          <Card
            key={quote.quote_id}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4} style={{ margin: 0 }}>
                  {getProductName(quote.product_id)}
                  <Text type="secondary" style={{ marginLeft: 10, color: 'black', fontSize: 20 }}>
                    {formatCurrency(quote.totalPremium)}
                  </Text>
                </Title>
                {getStatusTag(quote.status)}
              </div>
            }
          >
            {quote.status === "rejected" && (
              <Alert
                message="Quote has been rejected"
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            {loadingQuoteDetails[quote.quote_id] ? (
              <Spin />
            ) : (
              renderQuoteDetails(quote)
            )}
            <Space size="middle" style={{ marginTop: 16 }}>
              <Button
                type="primary"
                disabled={quote.status !== "referral"}
              >
                Bind Quote
              </Button>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'quote_summary',
                      label: 'Quote Summary',
                      icon: <DownloadOutlined />,
                      onClick: () => handleDownloadFile(quote, 'quote_summary')
                    },
                    {
                      key: 'application',
                      label: 'Application',
                      icon: <FileTextOutlined />,
                      onClick: () => handleDownloadFile(quote, 'application')
                    },
                    {
                      key: 'risk_assessment',
                      label: 'Risk Assessment',
                      icon: <SecurityScanOutlined />,
                      onClick: () => handleDownloadFile(quote, 'risk_assessment')
                    }
                  ]
                }}
              >
                <Button icon={<DownloadOutlined />}>
                  Download <DownOutlined />
                </Button>
              </Dropdown>
              <Button
                icon={<AntCloudOutlined />}
                onClick={() => window.open(quote.portal_link, '_blank')}
                disabled={quote.status !== 'active'}
              >
                View in Carrier Portal
              </Button>
            </Space>
          </Card>
        ))}
      </Space>
    </div>
  );
};

export default QuotePage;