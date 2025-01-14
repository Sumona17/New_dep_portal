import { Row, Col, Card } from "antd";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Container } from "styles/components/Layout";
import ShareIcon from "assets/svg/share.svg";
// import ViewIcon from "assets/svg/view.svg";
import QuickLionk from "assets/svg/quicklink.svg";
import QuickLinkDark from "assets/images/quicklink-dark.png";
import TargetDashboard from "assets/images/taget-dashboard.png";
import {
  DashboardCard,
  DashboardSection,
  BannerImage,
  GraphTitle,
  ProgressBarTable,
} from "styles/pages/Dashboard";
import ColumnChart from "components/Graphs/ColumnChart";
import AreaChart from "components/Graphs/AreaChart";
import ProgressBar from "components/ProgressBar";
// import GeoMap from "components/GeoMap";
import { jsonData } from "components/Graphs/AreaChart/areaChartDummyData";
import QuoteReprintModal from "components/PopupModal/QuoteReprintModal";
import PieChartNew from "components/Graphs/PieChart/PieChartNew";
import useMetaData from "context/metaData";

const Dashboard = () => {
  const { theme } = useMetaData();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  // const nfipBindRatio = jsonData.data.map((item) => item.nfip);
  // const privateFloodBindRatio = jsonData.data.map((item) => item.privateFlood);
  console.log("jsonData", jsonData);
  const modeofpayment = jsonData.data.map((item) => item.modeofpayment);
  console.log("mode of paymennt", modeofpayment);
  const Amountrecieved = jsonData.data.map((item) => item.Amountrecieved);
  console.log("Amountrecieved", Amountrecieved);

  const handleReprintQuote = () => {
    setOpen(true);
  };

  const series = [
    {
      name: "Method",
      data: modeofpayment,
    },
    {
      name: "Amount Received",
      data: Amountrecieved,
    },
  ];

  return (
    <>
      <DashboardSection theme={theme}>
        <BannerImage theme={theme}>
          <Container>
            <Row>
              <Col span={16}>
                <p className="subtitle">Welcome</p>
                <h3 className="name">Hi, Michael Doe</h3>
                <p className="content">
                  Let’s make sure your clients are covered, and their journey is
                  smooth
                </p>
              </Col>
              <Col span={6} className="ta">
                <img src={TargetDashboard} />
              </Col>
            </Row>
          </Container>
        </BannerImage>
        <DashboardCard theme={theme}>
          <Container>
            <Row gutter={16} className="mt-negative">
              <Col className="gutter-row" span={9}>
                <Card>
                  <div>
                    {/* <div className="cardvalue-data">
                      <span className="viewicon">
                        <img src={ViewIcon} />
                      </span>
                      TOTAL<span className="card-value">15</span>
                    </div> */}
                    <div className="card-content">
                      <h5 className="card-title">Insights</h5>
                      <div className="card-desc">
                        <Row gutter={16}>
                          <Col span={9}>Product</Col>
                          <Col span={9}>Better Conversion</Col>
                          <Col span={6}>Rated or Referred</Col>
                        </Row>
                        <hr/>
                        <Row gutter={16}>
                          <Col span={9}>Cyber</Col>
                          <Col span={9}>$50K - $1mn</Col>
                          <Col span={6}>47%</Col>
                        </Row>
                        <br/>
                        <Row gutter={16}>
                          <Col span={9}>Product</Col>
                          <Col span={9}>Least Conversion</Col>
                          <Col span={6}>Rejected or Abandoned</Col>
                        </Row>
                        <hr/>
                        <Row gutter={16}>
                          <Col span={9}>Excess Liability</Col>
                          <Col span={9}>$10mn - $50mn</Col>
                          <Col span={6}>37%</Col>
                        </Row>
                      </div>
                      {/* <p className="card-desc">
                        View list of policies that need review along with the
                        transaction details
                      </p>
                      <div
                        className="redirect-link"
                        onClick={() => navigate("/policy-transactions")}
                      >
                        <span>
                          <img src={ShareIcon} alt="Share" />
                        </span>
                      </div> */}
                    </div>
                  </div>
                </Card>
              </Col>
              <Col className="gutter-row" span={6}>
                <Card>
                  <div>
                    {/* <div className="cardvalue-data">
                      <span className="viewicon">
                        {" "}
                        <img src={ViewIcon} />
                      </span>
                      TOTAL<span className="card-value">18</span>
                    </div> */}
                    <div className="card-content">
                      <h5 className="card-title">Alerts and Reminders</h5>
                      {/* <p className="card-desc">
                        View list of Policies that are active as of today
                      </p> */}
                      <div className="card-desc">
                        <Row gutter={16}>
                          <Col span={18}>Renewal Due</Col>
                          <Col span={6}>17</Col>
                        </Row>
                        <hr/>
                        <Row gutter={16}>
                          <Col span={18}>Conversion Deadline</Col>
                          <Col span={6}>22</Col>
                        </Row>
                        <hr/>
                        <Row gutter={16}>
                          <Col span={18}>Followups Due</Col>
                          <Col span={6}>15</Col>
                        </Row>
                        <hr/>
                        <Row gutter={16}>
                          <Col span={18}>Approval Due</Col>
                          <Col span={6}>10</Col>
                        </Row>
                        <hr/>
                        <Row gutter={16}>
                          <Col span={18}>New Requests</Col>
                          <Col span={6}>12</Col>
                        </Row>
                      </div>
                      {/* <div
                        className="redirect-link"
                        onClick={() => navigate("/policies-in-force")}
                      >
                        <span>
                          <img src={ShareIcon} alt="Share" />
                        </span>
                      </div> */}
                    </div>
                  </div>
                </Card>
              </Col>
              <Col className="gutter-row" span={9}>
                <Card>
                  <div>
                    {/* <div className="cardvalue-data">
                      <span className="viewicon">
                        {" "}
                        <img src={ViewIcon} />
                      </span>
                      TOTAL<span className="card-value">12</span>
                    </div> */}
                    <div className="card-content">
                      <h5 className="card-title">Top Market Demand</h5>
                      <div className="card-desc">
                        <Row gutter={16}>
                          <Col span={9}>Annual Revenue</Col>
                          <Col span={9}>Line</Col>
                          <Col span={6}>Applied</Col>
                        </Row>
                        <hr/>
                        <Row gutter={16}>
                          <Col span={9}>$500K - $5 mn</Col>
                          <Col span={9}>Excess Liability</Col>
                          <Col span={6}>30% (+3%)</Col>
                        </Row><br/>
                        <Row gutter={16}>
                          <Col span={9}>$100K - $50 mn</Col>
                          <Col span={9}>Cyber</Col>
                          <Col span={6}>27% (-5%)</Col>
                        </Row><br/>
                        <Row gutter={16}>
                          <Col span={9}>$100K - $50mn</Col>
                          <Col span={9}>Personal Auto</Col>
                          <Col span={6}>22% (-5%)</Col>
                        </Row><br/>
                        <Row gutter={16}>
                          <Col span={9}>$5mn - $10mn</Col>
                          <Col span={9}>BoP</Col>
                          <Col span={6}>25% (+3%)</Col>
                        </Row>
                      </div>
                      {/* <p className="card-desc">
                        View list of pending ESignature and its summary
                      </p>
                      <div
                        className="redirect-link"
                        onClick={() => navigate("/pending-esignature")}
                      >
                        <span>
                          <img src={ShareIcon} />
                        </span>
                      </div> */}
                    </div>
                  </div>
                </Card>
              </Col>
              {/* <Col className="gutter-row" span={6}>
                <Card>
                  <div>
                    <div className="cardvalue-data">
                      <span className="viewicon">
                        {" "}
                        <img src={ViewIcon} />
                      </span>
                      TOTAL<span className="card-value">10</span>
                    </div>
                    <div className="card-content">
                      <h5 className="card-title">Unpaid Cancels</h5>
                      <p className="card-desc">
                        View list of all future cancels if payment is not
                        received.
                      </p>
                      <div
                        className="redirect-link"
                        onClick={() => navigate("/unpaid-cancels")}
                      >
                        <span>
                          <img src={ShareIcon} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col> */}
            </Row>
          </Container>
        </DashboardCard>
        <Container className="mt-positive pb">
          <Row gutter={16} className="gp">
            <Col className="gutter-row" span={10}>
              <Card className="graph-card">
                <GraphTitle theme={theme}>All Payments Received</GraphTitle>
                <ColumnChart theme={theme} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/allpayment")}
                >
                  <span>
                    <img src={ShareIcon} />
                  </span>
                </div>
              </Card>
              <Card className="graph-card mt">
                <GraphTitle theme={theme}>Producer Product Details</GraphTitle>
                <ProgressBarTable theme={theme}>
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Transaction</th>
                        <th>Popularity</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Total Net Written</td>
                        <td>
                          <ProgressBar
                            percent={45}
                            status="active"
                            strokeColor="#0095FF"
                          />
                        </td>
                        <td>
                          <span className="progressvalue nfip-progressvalue">
                            45
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Renewal</td>
                        <td>
                          <ProgressBar
                            percent={29}
                            status="active"
                            strokeColor="#9DC8BE"
                          />
                        </td>
                        <td>
                          <span className="progressvalue focusflood-progressvalue">
                            29
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>Endorsement</td>
                        <td>
                          <ProgressBar
                            percent={18}
                            status="active"
                            strokeColor="#884DFF"
                          />
                        </td>
                        <td>
                          <span className="progressvalue excess-progressvalue">
                            18
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>Cancel Premiums</td>
                        <td>
                          <ProgressBar
                            percent={10}
                            status="active"
                            strokeColor="#FF0000"
                          />
                        </td>
                        <td>
                          <span className="progressvalue brokerage-progressvalue">
                            10
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </ProgressBarTable>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/producerproduction")}
                >
                  <span>
                    <img src={ShareIcon} />
                  </span>
                </div>
              </Card>
            </Col>
            <Col className="gutter-row" span={7}>
              <Card className="graph-card area-chart-card">
                <GraphTitle theme={theme}>Premium Trust Deposits</GraphTitle>
                <AreaChart theme={theme} data={jsonData.data} series={series} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/Premiumtrust")}
                >
                  <span>
                    <img src={ShareIcon} />
                  </span>
                </div>
              </Card>
              <Card className="graph-card mt">
                <GraphTitle theme={theme}>
                  Producer Loss Ratio by Coverage
                </GraphTitle>
                <PieChartNew />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/producerlossratio")}
                >
                  <span>
                    <img src={ShareIcon} />
                  </span>
                </div>
              </Card>
            </Col>
            <Col className="gutter-row gutter-row full-height-col" span={7}>
              <div className="col-content full-height">
                <Card className="quick-link">
                  <h4 className="quick-title">
                    {" "}
                    {theme === "dark" ? (
                      <img src={QuickLinkDark} />
                    ) : (
                      <img src={QuickLionk} />
                    )}
                    Quick links
                  </h4>
                  <div className="linkbox">
                    <a onClick={() => navigate("/uploadDocuments")}>
                      File Upload
                    </a>
                    <a onClick={() => navigate("/create-quote")}>
                      Create Quote
                    </a>
                    <a onClick={() => handleReprintQuote()}>Reprint Quote</a>
                    <QuoteReprintModal open={open} setOpen={setOpen} />
                    <a onClick={() => navigate("/claim")}>Create FNOL</a>
                    <a onClick={() => navigate("/viewed-policy")}>
                      Recently Viewed Policies
                    </a>
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </DashboardSection>
    </>
  );
};

export default Dashboard;
