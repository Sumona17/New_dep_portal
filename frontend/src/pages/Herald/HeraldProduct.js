import React from "react";
import { Form, Button, Card } from "antd";
import FormCheckBox from "components/FormControl/FormCheckBox";
import { HeraldProductWrapper } from "styles/pages/Herald";
import useMetaData from "context/metaData";
import { Container } from "styles/pages/Login";


const HeraldProduct = () => {
  const { theme } = useMetaData();
  const cyberRiskOptions = [
    { label: "At-Bay Cyber", value: "at-bay" },
    { label: "Cowbell Cyber", value: "cowbell" },
    { label: "Herald Cyber", value: "herald" },
  ];

  return (
    <HeraldProductWrapper theme={theme}>
        <Container>
        <h1 className="topsection">
            Create a New Application
        </h1>
      
      <p className="subtext">
        An <a href="/applications">application</a> is a series of inputs for a product or set of products. You can create an application using 
        <code> /applications API </code> and including the <code>products</code> you&apos;d like.
      </p>
      <Card>
      <h2>Cyber Risk</h2>
      <Form>
        <FormCheckBox
          name="cyberRisk"
          label=""
          options={cyberRiskOptions}
          required={false}
        />
        <Button type="primary" className="create-application-btn">
          Create Application
        </Button>
      </Form>
      </Card>
      </Container>
    </HeraldProductWrapper>
  );
};

export default HeraldProduct;
