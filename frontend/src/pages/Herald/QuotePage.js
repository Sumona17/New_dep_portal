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
import jsPDF from 'jspdf';
import axios from 'axios';
import { Container } from 'styles/pages/Login';

const { Panel } = Collapse;

const QuotePage = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
   

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://sandbox.heraldapi.com/quotes", {
                    headers: {
                        Authorization: "Bearer E4xGG8aD+6kcbID50Z7dfntunn8wsHvXKxb5gBB1pdw=",
                    },
                });
                setQuotes(response.data.quotes);
            } catch (error) {
                console.error("Error fetching data:", error);
                message.error("Failed to fetch quotes.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderStatusTag = (status) => {
        switch (status) {
            case "active":
                return <Tag color="green">Success</Tag>;
            case "declined":
                return <Tag color="red">Declined</Tag>;
            case "rejected":
                return <Tag color="red">Rejected</Tag>;
            default:
                return null;
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

    const handleDownloadQuote = (quote) => {
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text('Quote Details', 10, 20);

        let yPosition = 40;
        doc.setFontSize(12);
        
        doc.text(`Product: ${quote.product.name}`, 10, yPosition);
        yPosition += 10;
        doc.text(`Price: ${formatPrice(quote.prices)}`, 10, yPosition);
        yPosition += 10;
        doc.text(`Status: ${quote.status}`, 10, yPosition);
        yPosition += 20;

        if (quote.coverage_values?.length) {
            doc.text('Coverage Details:', 10, yPosition);
            yPosition += 10;
            quote.coverage_values.forEach(coverage => {
                doc.text(`${coverage.parameter_text.agent_facing_text}: ${coverage.value}`, 10, yPosition);
                yPosition += 10;
            });
        }

        if (quote.risk_values?.length) {
            doc.text('Risk Details:', 10, yPosition);
            yPosition += 10;
            quote.risk_values.forEach(risk => {
                doc.text(`${risk.parameter_text.agent_facing_text}: ${risk.value}`, 10, yPosition);
                yPosition += 10;
            });
        }

        doc.save('quote_details.pdf');
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
                                {/* <Button onClick={() => handleDownloadQuote(quote)}>
                                    Download Quote
                                </Button> */}
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