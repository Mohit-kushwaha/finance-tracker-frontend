"use client";

import {
  Card,
  Row,
  Col,
  Typography,
  Statistic,
  List,
  Tag,
  Divider,
  Progress,
  Tabs,
  Collapse,
} from "antd";
import FinanceChart from "./FinanceChart";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  WarningOutlined,
  DollarOutlined,
  CalendarOutlined,
  RiseOutlined,
  FallOutlined,
  PieChartOutlined,
  FundOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Panel } = Collapse;

export default function FinanceResult({ data }: { data: any }) {
  const {
    monthlyAnalysis,
    emergencyFundStatus,
    optimizedExpenses,
    warnings,
    totalIncome,
    totalOptimizedExpenses,
    finalRemainingBudget,
    recommendedSavings,
    recommendedInvestments,
    inflationAdjustedAnalysis,
  } = data;

  // Prepare chart data
  const categories = monthlyAnalysis.savingsProjection.map(
    (item: any) => `Month ${item.month}`
  );
  const savingsData = monthlyAnalysis.savingsProjection.map(
    (item: any) => item.amount
  );
  const cumulativeSavingsData = monthlyAnalysis.savingsProjection.map(
    (item: any) => item.cumulative
  );
  const investmentData = monthlyAnalysis.investmentProjection.map(
    (item: any) => item.value
  );
  const expensesData = monthlyAnalysis.monthlyCashFlow.expenses;
  const emiData = Array(monthlyAnalysis.debtRepayment.monthsRemaining).fill(
    monthlyAnalysis.debtRepayment.totalEMI / monthlyAnalysis.debtRepayment.monthsRemaining
  );
  // Expense breakdown data
  const expenseCategories = Object.keys(optimizedExpenses);
  const expenseData = expenseCategories
    .map((category) => ({
      name: category,
      value: optimizedExpenses[category],
    }))
    .sort((a, b) => b.value - a.value);

  // Financial summary cards
  const summaryCards = [
    { title: "Total Income", value: totalIncome, trend: "up", suffix: "₹" },
    {
      title: "Optimized Expenses",
      value: totalOptimizedExpenses,
      trend: "down",
      suffix: "₹",
    },
    { title: "Remaining Budget", value: finalRemainingBudget, suffix: "₹" },
    {
      title: "Recommended Savings",
      value: recommendedSavings,
      suffix: "₹/mo",
    },
    {
      title: "Recommended Investments",
      value: recommendedInvestments,
      suffix: "₹/mo",
    },
  ];

  // Emergency fund progress
  const emergencyFundProgress = Math.min(
    (monthlyAnalysis.emergencyFundProgress.current /
      monthlyAnalysis.emergencyFundProgress.target) *
      100,
    100
  );

  // Tabs data for inflation-adjusted analysis
  const inflationTabs = [
    {
      key: "conservative",
      label: "Conservative (8% Growth)",
      children: (
        <InflationProjectionTab
          data={inflationAdjustedAnalysis.projections.conservative}
          title="Conservative Income Growth (8% annually)"
        />
      ),
    },
    {
      key: "moderate",
      label: "Moderate (12% Growth)",
      children: (
        <InflationProjectionTab
          data={inflationAdjustedAnalysis.projections.moderate}
          title="Moderate Income Growth (12% annually)"
        />
      ),
    },
    {
      key: "optimistic",
      label: "Optimistic (18% Growth)",
      children: (
        <InflationProjectionTab
          data={inflationAdjustedAnalysis.projections.optimistic}
          title="Optimistic Income Growth (18% annually)"
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Title level={2} className="mb-6">
          Financial Health Dashboard
        </Title>

        {/* Summary Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          {summaryCards.map((card, index) => (
            <Col xs={24} sm={12} md={8} lg={4} key={index}>
              <Card
                className="h-full rounded-xl shadow-md hover:shadow-lg transition"
                style={{
                  borderTop: `4px solid ${
                    card.trend === "up"
                      ? "#3f8600"
                      : card.trend === "down"
                      ? "#cf1322"
                      : "#1890ff"
                  }`,
                }}
              >
                <Statistic
                  title={card.title}
                  value={card.value}
                  precision={0}
                  valueStyle={{
                    fontWeight: 600,
                    color:
                      card.trend === "up"
                        ? "#3f8600"
                        : card.trend === "down"
                        ? "#cf1322"
                        : "#333",
                  }}
                  prefix={
                    card.trend === "up" ? (
                      <ArrowUpOutlined />
                    ) : card.trend === "down" ? (
                      <ArrowDownOutlined />
                    ) : null
                  }
                  suffix={card.suffix}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Emergency Fund Status */}
        <Card
          title={
            <>
              <DollarOutlined /> Emergency Fund
            </>
          }
          className="mb-6 shadow-md rounded-xl"
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Text className="block mb-2">{emergencyFundStatus}</Text>
              <Progress
                percent={emergencyFundProgress}
                status={emergencyFundProgress >= 100 ? "success" : "active"}
                strokeColor={
                  emergencyFundProgress >= 100 ? "#52c41a" : "#1890ff"
                }
              />
              <div className="mt-2 flex justify-between">
                <Text>
                  Current: ₹
                  {monthlyAnalysis.emergencyFundProgress.current.toLocaleString()}
                </Text>
                <Text>
                  Target: ₹
                  {monthlyAnalysis.emergencyFundProgress.target.toLocaleString()}
                </Text>
              </div>

              {/* Projection */}
              <div className="mt-4 space-y-2">
                <Text strong>Projected Completion:</Text>
                <div className="flex items-center gap-2">
                  <CalendarOutlined />
                  <Text>
                    {monthlyAnalysis.emergencyFundProgress.monthsToTarget} months
                    (
                    {new Date(
                      new Date().setMonth(
                        new Date().getMonth() +
                          monthlyAnalysis.emergencyFundProgress.monthsToTarget
                      )
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                    )
                  </Text>
                </div>

                <div className="flex items-center gap-2">
                  <DollarOutlined />
                  <Text>
                    Monthly contribution needed: ₹
                    {monthlyAnalysis.emergencyFundProgress.monthlyContribution.toLocaleString()}
                  </Text>
                </div>
              </div>
            </Col>

            <Col xs={24} md={12}>
              <Title level={5} className="mb-2">
                Optimization Warnings
              </Title>
              <List
                size="small"
                dataSource={warnings}
                renderItem={(item: string) => (
                  <List.Item>
                    <Tag icon={<WarningOutlined />} color="warning">
                      {item}
                    </Tag>
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </Card>

        {/* Expense Breakdown */}
        <Card
          title={
            <>
              <PieChartOutlined /> Expense Breakdown
            </>
          }
          className="mb-6 shadow-md rounded-xl"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
            <FinanceChart
            title="Expense Allocation"
            categories={expenseData.map((item) => item.name)}
            seriesData={[
                {
                name: "Expenses",
                data: expenseData.map((item) => ({
                    name: item.name,  // <-- label for slice
                    y: item.value,    // <-- numeric value
                })) as any, // allow objects
                type: "pie",
                },
            ]}
            />
            </Col>
            <Col xs={24} md={12}>
              <List
                header={<Text strong>Top 3 Expense Categories</Text>}
                bordered
                dataSource={expenseData.slice(0, 3)}
                renderItem={(item: any) => (
                  <List.Item>
                    <div className="flex justify-between w-full">
                      <Tag color="blue">{item.name}</Tag>
                      <Text strong>₹{item.value.toLocaleString()}</Text>
                    </div>
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </Card>

        {/* Financial Projections */}
        <Card
          title={
            <>
              <FundOutlined /> Financial Projections
            </>
          }
          className="mb-6 shadow-md rounded-xl"
        >
          <Tabs
            defaultActiveKey="savings"
            items={[
              {
                key: "savings",
                label: "Savings Projection",
                children: (
                  <FinanceChart
                    title="Savings Projection"
                    categories={categories}
                    seriesData={[
                      {
                        name: "Monthly Savings",
                        data: savingsData,
                        type: "column",
                        color: "#4CAF50",
                      },
                      {
                        name: "Cumulative Savings",
                        data: cumulativeSavingsData,
                        type: "line",
                        color: "#2E7D32",
                      },
                    ]}
                  />
                ),
              },
              {
                key: "investments",
                label: "Investment Growth",
                children: (
                  <FinanceChart
                    title="Investment Growth"
                    categories={categories}
                    seriesData={[
                      {
                        name: "Portfolio Value",
                        data: investmentData,
                        type: "area",
                        color: "#2196F3",
                      },
                    ]}
                  />
                ),
              },
              {
                key: "cashflow",
                label: "Cash Flow Overview",
                children: (
                  <FinanceChart
                    title="Cash Flow Overview"
                    categories={categories}
                    seriesData={[
                      {
                        name: "Income",
                        data: Array(categories.length).fill(totalIncome),
                        type: "line",
                        color: "#4CAF50",
                        dashStyle: "Dash",
                      },
                      {
                        name: "Expenses",
                        data: expensesData,
                        type: "line",
                        color: "#FF5722",
                      },
                      {
                        name: "Loan EMI",
                        data: emiData,
                        type: "line",
                        color: "#3F51B5",
                      },
                      {
                        name: "Investments",
                        data: investmentData,
                        type: "area",
                        color: "#2196F3",
                        opacity: 0.3,
                      },
                    ]}
                  />
                ),
              },
            ]}
          />
        </Card>

        {/* Inflation Adjusted Analysis */}
        {inflationAdjustedAnalysis && (
          <Card
            title="Long-Term Financial Outlook (Inflation Adjusted)"
            className="mb-6 shadow-md rounded-xl"
          >
            <Tabs defaultActiveKey="conservative" items={inflationTabs} />
          </Card>
        )}
      </div>
    </div>
  );
}

// Inflation Projection Tab
const InflationProjectionTab = ({
  data,
  title,
}: {
  data: any[];
  title: string;
}) => {
  const getHealthTag = (status: string) => {
    switch (status) {
      case "HEALTHY":
        return <Tag color="green">HEALTHY</Tag>;
      case "MODERATE":
        return <Tag color="orange">MODERATE</Tag>;
      case "TIGHT":
        return <Tag color="red">TIGHT</Tag>;
      default:
        return <Tag>UNKNOWN</Tag>;
    }
  };

  return (
    <div>
      <Title level={5}>{title}</Title>
      <Collapse accordion>
        {data.map((yearData: any) => (
          <Panel
            header={
              <div className="flex justify-between items-center">
                <span>
                  Year {yearData.year} – Disposable: ₹
                  {yearData.disposableIncome.toLocaleString()}
                </span>
                {getHealthTag(yearData?.financialHealth)}
              </div>
            }
            key={yearData.year}
          >
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Statistic title="Income" value={yearData.income} prefix="₹" />
              </Col>
              <Col xs={24} md={8}>
                <Statistic
                  title="Total Expenses"
                  value={yearData.totalExpenses}
                  prefix="₹"
                />
              </Col>
              <Col xs={24} md={8}>
                <Statistic
                  title="Disposable Income"
                  value={yearData.disposableIncome}
                  prefix="₹"
                  valueStyle={{
                    color:
                      yearData.disposableIncome > 0 ? "#3f8600" : "#cf1322",
                  }}
                />
              </Col>
            </Row>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};
