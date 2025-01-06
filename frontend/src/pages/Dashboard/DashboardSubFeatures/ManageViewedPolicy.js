import React from "react";
import { Container } from "styles/pages/Login";
import { useNavigate } from "react-router-dom";
import TableComponent from "components/Table";
import { columns,dataSource } from "pages/Dashboard/DashboardSubFeatures/dummyData";

import {
  SearchPolicyTitle,
  SearchPolicySection,
  FormSection,
} from "styles/pages/SearchPolicy";

const RecentlyViewedPolicy = ({theme}) => {
  const navigate = useNavigate();
    const editQuote = (route, data) => {
      navigate(route, {
          state: data
      })
  }
  return (
    <SearchPolicySection >
      <Container>
        <div className="topsection">
          <div>
            <SearchPolicyTitle theme={theme}>
              Recently Viewed Policy <br />
            </SearchPolicyTitle>
          </div>
        </div>
        <FormSection>
           <TableComponent theme={theme} title="Results" columns={columns(editQuote)} data={dataSource} />
        </FormSection>
      </Container>
    </SearchPolicySection>
  );
};

export default RecentlyViewedPolicy;
