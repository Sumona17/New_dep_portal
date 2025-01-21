import React, { useState, useEffect } from 'react';
import {
    Button,
    Card,
    Descriptions,
    Space,
    message,
    Tag,
    Collapse,
    Spin,
    Modal
} from 'antd';
import axios from 'axios';
import { Container } from 'styles/pages/Login';
import { useLocation } from 'react-router-dom';

const { Panel } = Collapse;

const QuotePage = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [applicationData, setApplicationData] = useState(null);
    const location = useLocation();
    const selectedProducts = location.state?.selectedProducts || [];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch quotes
                const quotesResponse = await axios.get("https://sandbox.heraldapi.com/quotes", {
                    headers: {
                        Authorization: `Bearer E4xGG8aD+6kcbID50Z7dfntunn8wsHvXKxb5gBB1pdw=`,
                    },
                });

                // Process quotes for each selected product
                const processedQuotes = selectedProducts.map(productId => {
                    const productQuotes = quotesResponse.data.quotes.filter(quote =>
                        quote.product.id === productId
                    );
                    return productQuotes.find(quote => quote.status === "active") || productQuotes[0];
                }).filter(Boolean);

                setQuotes(processedQuotes);

                // Fetch application data
                const applicationResponse = await axios.get(
                    "https://sandbox.heraldapi.com/applications/b110ff4b-e28a-4a8f-9d6a-84a1e1d21328",
                    {
                        headers: {
                            Authorization: `Bearer E4xGG8aD+6kcbID50Z7dfntunn8wsHvXKxb5gBB1pdw=`,
                        },
                    }
                );

                setApplicationData(applicationResponse.data.application);
            } catch (error) {
                console.error("Error fetching data:", error);
                message.error("Failed to fetch data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedProducts]);

    const renderStatusTag = (status) => {
        const statusColors = {
            active: "green",
            declined: "red",
            rejected: "red",
            default: "default"
        };
        return <Tag color={statusColors[status] || statusColors.default}>{status}</Tag>;
    };

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        if (typeof price === 'object') {
            const priceValue = price.value || price.amount || Object.values(price)[0];
            return typeof priceValue === 'number' ? `$${priceValue.toLocaleString()}` : 'N/A';
        }
        return typeof price === 'number' ? `$${price.toLocaleString()}` : 'N/A';
    };

    const handleDownloadQuote = async () => {
        try {
            setLoading(true);
            const response = await axios.post(
                "https://sandbox.heraldapi.com/files/3d7cd53b-f73f-4257-a9ea-8ac955329693/get_temporary_link",
                null,
                {
                    headers: {
                        Authorization: `Bearer E4xGG8aD+6kcbID50Z7dfntunn8wsHvXKxb5gBB1pdw=`,
                    },
                }
            );
            const pdfUrl = response.data?.temporary_link?.link;
            if (pdfUrl) {
                window.open(pdfUrl, '_blank');
                message.success('PDF opened successfully');
            } else {
                message.error("Failed to retrieve the download link.");
            }
        } catch (error) {
            console.error("Error fetching temporary link:", error);
            message.error("An error occurred while fetching the download link.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewFullDetails = (quote) => {
        setSelectedQuote(quote);
        setIsDetailsModalVisible(true);
    };

    const QuoteDetailsModal = ({ quote, visible, onClose }) => {
        if (!quote || !applicationData) return null;

        const formatFieldValue = (value) => {
            if (Array.isArray(value)) return value.join(', ');
            if (typeof value === 'object' && value !== null) {
                if (value.line1) return `${value.line1}, ${value.city}, ${value.state} ${value.postal_code}`;
                return JSON.stringify(value);
            }
            return value?.toString() || 'N/A';
        };

        return (
            <Modal
                title="Full Quote Details"
                open={visible}
                onCancel={onClose}
                width={800}
                footer={[
                    <Button 
                        key="download" 
                        onClick={() => handleDownloadQuote(quote)}
                        loading={loading}
                    >
                        Download Quote
                    </Button>,
                    <Button key="close" type="primary" onClick={onClose}>
                        Close
                    </Button>
                ]}
            >
                <Card>
                    <Descriptions title="Quote Information" bordered column={1}>
                        <Descriptions.Item label="Product Name">{quote.product.name}</Descriptions.Item>
                        <Descriptions.Item label="Price">{formatPrice(quote.prices)}</Descriptions.Item>
                        <Descriptions.Item label="Status">
                            {renderStatusTag(quote.status)} {quote.status}
                        </Descriptions.Item>
                        {quote.portal_link && (
                            <Descriptions.Item label="Portal Link">
                                <a href={quote.portal_link} target="_blank" rel="noopener noreferrer">
                                    View in Carrier Portal
                                </a>
                            </Descriptions.Item>
                        )}
                    </Descriptions>

                    <Collapse style={{ marginTop: "20px" }}>
                        <Panel header="Risk Information" key="1">
                            <Descriptions bordered column={1}>
                                {applicationData.risk_values.map((field, index) => (
                                    <Descriptions.Item
                                        key={index}
                                        label={field.parameter_text.agent_facing_text}
                                    >
                                        {formatFieldValue(field.value)}
                                    </Descriptions.Item>
                                ))}
                            </Descriptions>
                        </Panel>

                        <Panel header="Coverage Information" key="2">
                            <Descriptions bordered column={1}>
                                {applicationData.coverage_values.map((field, index) => (
                                    <Descriptions.Item
                                        key={index}
                                        label={field.parameter_text.agent_facing_text}
                                    >
                                        {formatFieldValue(field.value)}
                                    </Descriptions.Item>
                                ))}
                            </Descriptions>
                        </Panel>

                        <Panel header="Quote Coverage Details" key="3">
                            <Descriptions bordered column={1}>
                                {quote.coverage_values?.map((coverage, index) => (
                                    <Descriptions.Item
                                        key={index}
                                        label={coverage.parameter_text.agent_facing_text}
                                    >
                                        {coverage.value}
                                    </Descriptions.Item>
                                ))}
                            </Descriptions>
                        </Panel>
                    </Collapse>
                </Card>
            </Modal>
        );
    };

    if (loading) {
        return (
            <Container>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Spin size="large" />
                </div>
            </Container>
        );
    }

    if (quotes.length === 0) {
        return (
            <Container>
                <Card>
                    <p>No quotes available for the selected products.</p>
                </Card>
            </Container>
        );
    }

    return (
        <Container title="Available Quotes">
            <div>
                {quotes.map((quote) => (
                    <Card
                        key={quote.id}
                        title={`${quote.product.name}`}
                        extra={renderStatusTag(quote.status)}
                        style={{ marginBottom: "20px" }}
                    >
                        <p>
                            <strong>Price:</strong> {formatPrice(quote.prices)}
                        </p>
                        {quote.portal_link && (
                            <a href={quote.portal_link} target="_blank" rel="noopener noreferrer">
                                View in Carrier Portal
                            </a>
                        )}
                        <div style={{ marginTop: "10px" }}>
                            <Space>
                                <Button
                                    type="primary"
                                    disabled={quote.status !== "referral"}
                                >
                                    Bind
                                </Button>
                                <Button onClick={() => handleViewFullDetails(quote)}>
                                    Full Details
                                </Button>
                            </Space>
                        </div>
                    </Card>
                ))}
            </div>

            <QuoteDetailsModal
                quote={selectedQuote}
                visible={isDetailsModalVisible}
                onClose={() => {
                    setIsDetailsModalVisible(false);
                    setSelectedQuote(null);
                }}
            />
        </Container>
    );
};

export default QuotePage;