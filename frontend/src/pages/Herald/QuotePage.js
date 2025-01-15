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
    const location = useLocation();
    const selectedProducts = location.state?.selectedProducts || [];
 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://sandbox.heraldapi.com/quotes", {
                    headers: {
                        Authorization: `Bearer E4xGG8aD+6kcbID50Z7dfntunn8wsHvXKxb5gBB1pdw=`,
                      },
                });
               
                // Process quotes for each selected product
                const processedQuotes = selectedProducts.map(productId => {
                    // Get all quotes for this product
                    const productQuotes = response.data.quotes.filter(quote =>
                        quote.product.id === productId
                    );
 
                    // Try to find a successful quote first
                    const successfulQuote = productQuotes.find(quote => quote.status === "active");
                   
                    // If no successful quote, get the first quote of any status
                    return successfulQuote || productQuotes[0];
                }).filter(Boolean); // Remove null entries
 
                setQuotes(processedQuotes);
            } catch (error) {
                console.error("Error fetching data:", error);
                message.error("Failed to fetch quotes.");
            } finally {
                setLoading(false);
            }
        };
 
        fetchData();
    }, [selectedProducts]);
 
    const renderStatusTag = (status) => {
        switch (status) {
            case "active":
                return <Tag color="green">Success</Tag>;
            case "declined":
                return <Tag color="red">Declined</Tag>;
            case "rejected":
                return <Tag color="red">Rejected</Tag>;
            default:
                return <Tag color="default">{status}</Tag>;
        }
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

            const response = await axios.post(
                "https://sandbox.heraldapi.com/files/3d7cd53b-f73f-4257-a9ea-8ac955329693/get_temporary_link",
                null,
                {
                  headers: {
                    Authorization: `Bearer E4xGG8aD+6kcbID50Z7dfntunn8wsHvXKxb5gBB1pdw=`,
                  },
                }
              );
           
    
            const temporaryLink = response.data?.temporary_link;
            if (temporaryLink) {
                window.open(temporaryLink, "_blank");
            } else {
                message.error("Failed to retrieve the download link.");
            }
        } catch (error) {
            console.error("Error fetching temporary link:", error.response?.data || error.message);
            message.error("An error occurred while fetching the download link.");
        }
    };
    
 
    const handleViewFullDetails = (quote) => {
        setSelectedQuote(quote);
        setIsDetailsModalVisible(true);
    };
 
    const QuoteDetailsModal = ({ quote, visible, onClose }) => {
        if (!quote) return null;
 
        return (
            <Modal
                title="Full Quote Details"
                open={visible}
                onCancel={onClose}
                width={800}
                footer={[
                    <Button key="download" onClick={() => handleDownloadQuote(quote)}>
                        Download Quote
                    </Button>,
                    <Button key="close" type="primary" onClick={onClose}>
                        Close
                    </Button>
                ]}
            >
                <Card>
                    <Descriptions bordered column={1}>
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
                        <Panel header="Coverage Details" key="1">
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
                       
                        <Panel header="Risk Details" key="2">
                            <Descriptions bordered column={1}>
                                {quote.risk_values?.map((risk, index) => (
                                    <Descriptions.Item
                                        key={index}
                                        label={risk.parameter_text.agent_facing_text}
                                    >
                                        {risk.value}
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
                        <Collapse style={{ marginTop: "20px" }}>
                            <Panel header="Coverage Details" key="1">
                                {quote?.coverage_values?.map((coverage, index) => (
                                    <p key={index}>
                                        <strong>{coverage.parameter_text.agent_facing_text}:</strong> {coverage.value}
                                    </p>
                                ))}
                            </Panel>
                        </Collapse>
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