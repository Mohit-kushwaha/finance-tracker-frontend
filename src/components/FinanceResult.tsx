// components/FinanceResult.tsx
"use client";

import { Card, Row, Col, Typography, Statistic, List, Tag, Divider, Progress } from "antd";
import FinanceChart from "./FinanceChart";
import { ArrowUpOutlined, ArrowDownOutlined, WarningOutlined, DollarOutlined, CalendarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface SeriesData {
    name: string;
    data: number[];
    type: "line" | "area";
    color?: string;
}

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
        recommendedInvestments
    } = data;

    // Prepare chart data
    const categories = monthlyAnalysis.savingsProjection.map((item: any) => `Month ${item.month}`);
    const savingsData = monthlyAnalysis.savingsProjection.map((item: any) => item.amount);
    const cumulativeSavingsData = monthlyAnalysis.savingsProjection.map((item: any) => item.cumulative);
    const investmentData = monthlyAnalysis.investmentProjection.map((item: any) => item.value);
    const expensesData = monthlyAnalysis.monthlyCashFlow.expenses;
    const emiData = Array(monthlyAnalysis.savingsProjection.length).fill(monthlyAnalysis.debtRepayment.totalEMI);

    // Expense breakdown data
    const expenseCategories = Object.keys(optimizedExpenses);
    const expenseData = expenseCategories.map(category => ({
        name: category,
        value: optimizedExpenses[category]
    })).sort((a, b) => b.value - a.value);

    // Financial summary cards
    const summaryCards = [
        { title: "Total Income", value: totalIncome, trend: "up", suffix: "₹" },
        { title: "Optimized Expenses", value: totalOptimizedExpenses, trend: "down", suffix: "₹" },
        { title: "Remaining Budget", value: finalRemainingBudget, suffix: "₹" },
        { title: "Recommended Savings", value: recommendedSavings, suffix: "₹/mo" },
        { title: "Recommended Investments", value: recommendedInvestments, suffix: "₹/mo" },
    ];

    // Emergency fund progress
    const emergencyFundProgress = Math.min(
        (monthlyAnalysis.emergencyFundProgress.current / monthlyAnalysis.emergencyFundProgress.target) * 100,
        100
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <Title level={2} className="mb-6">Financial Health Dashboard</Title>

                {/* Summary Cards */}
                <Row gutter={[16, 16]} className="mb-6">
                    {summaryCards.map((card, index) => (
                        <Col xs={24} sm={12} md={8} lg={4} key={index}>
                            <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
                                <Statistic
                                    title={card.title}
                                    value={card.value}
                                    precision={0}
                                    valueStyle={{
                                        color: card.trend === "up" ? "#3f8600" :
                                            card.trend === "down" ? "#cf1322" : "#333"
                                    }}
                                    prefix={card.trend === "up" ? <ArrowUpOutlined /> :
                                        card.trend === "down" ? <ArrowDownOutlined /> : null}
                                    suffix={card.suffix}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Emergency Fund Status */}
                <Card title="Emergency Fund Status" className="mb-6 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <Text className="block mb-2">{emergencyFundStatus}</Text>
                            <Progress
                                percent={emergencyFundProgress}
                                status={emergencyFundProgress >= 100 ? "success" : "active"}
                                strokeColor={emergencyFundProgress >= 100 ? "#52c41a" : "#1890ff"}
                            />
                            <div className="mt-2 flex justify-between">
                                <Text>Current: ₹{monthlyAnalysis.emergencyFundProgress.current.toLocaleString()}</Text>
                                <Text>Target: ₹{monthlyAnalysis.emergencyFundProgress.target.toLocaleString()}</Text>
                            </div>

                            {/* New: Emergency Fund Projection */}
                            <div className="mt-4 space-y-2">
                                <Text strong>Projected Completion:</Text>
                                <div className="flex items-center gap-2">
                                    <CalendarOutlined />
                                    <Text>
                                        {monthlyAnalysis.emergencyFundProgress.monthsToTarget} months (
                                        {new Date(
                                            new Date().setMonth(
                                                new Date().getMonth() + monthlyAnalysis.emergencyFundProgress.monthsToTarget
                                            )
                                        ).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})
                                    </Text>
                                </div>

                                <div className="flex items-center gap-2">
                                    <DollarOutlined />
                                    <Text>
                                        Monthly contribution needed: ₹{monthlyAnalysis.emergencyFundProgress.monthlyContribution.toLocaleString()}
                                    </Text>
                                </div>

                                {/* New: Combined Savings + Investments */}
                                {monthlyAnalysis.savingsProjection.length > 0 && (
                                    <>
                                        <Divider className="my-3" />
                                        <Text strong>Current Projections:</Text>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <div className="bg-blue-50 p-2 rounded">
                                                <Text className="text-xs text-gray-500">Total Savings</Text>
                                                <Text strong className="text-blue-600">
                                                    ₹{monthlyAnalysis.savingsProjection[monthlyAnalysis.savingsProjection.length - 1].cumulative.toLocaleString()}
                                                </Text>
                                            </div>
                                            <div className="bg-green-50 p-2 rounded">
                                                <Text className="text-xs text-gray-500">Total Investments</Text>
                                                <Text strong className="text-green-600">
                                                    ₹{monthlyAnalysis.investmentProjection[monthlyAnalysis.investmentProjection.length - 1].value.toLocaleString()}
                                                </Text>
                                            </div>
                                            <div className="bg-purple-50 p-2 rounded col-span-2">
                                                <Text className="text-xs text-gray-500">Combined (Savings + Investments)</Text>
                                                <Text strong className="text-purple-600">
                                                    ₹{(
                                                        monthlyAnalysis.savingsProjection[monthlyAnalysis.savingsProjection.length - 1].cumulative +
                                                        monthlyAnalysis.investmentProjection[monthlyAnalysis.investmentProjection.length - 1].value
                                                    ).toLocaleString()}
                                                </Text>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Rest of the warning section remains the same */}
                        <div className="flex-1">
                            <Title level={5} className="mb-2">Optimization Warnings</Title>
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
                        </div>
                    </div>
                </Card>

                {/* Expense Breakdown */}
                <Card title="Expense Breakdown" className="mb-6 shadow-sm">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            <FinanceChart
                                title="Monthly Expenses"
                                categories={expenseData.map(item => item.name)}
                                seriesData={[{
                                    name: "Expenses",
                                    data: expenseData.map(item => item.value),
                                    type: "bar",
                                    color: "#FF5722"
                                }]}
                                chartType="bar"
                            />
                        </Col>
                        <Col xs={24} md={12}>
                            <List
                                header={<Text strong>Detailed Expense Allocation</Text>}
                                bordered
                                dataSource={expenseData}
                                renderItem={(item: any) => (
                                    <List.Item>
                                        <div className="flex justify-between w-full">
                                            <Text>{item.name}</Text>
                                            <Text strong>₹{item.value.toLocaleString()}</Text>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </Col>
                    </Row>
                </Card>

                {/* Financial Projections */}
                <Card title="Financial Projections" className="mb-6 shadow-sm">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={12}>
                            <FinanceChart
                                title="Savings Projection"
                                categories={categories}
                                seriesData={[
                                    { name: "Monthly Savings", data: savingsData, type: "column", color: "#4CAF50" },
                                    { name: "Cumulative Savings", data: cumulativeSavingsData, type: "line", color: "#2E7D32" }
                                ]}
                            />
                        </Col>
                        <Col xs={24} lg={12}>
                            <FinanceChart
                                title="Investment Growth"
                                categories={categories}
                                seriesData={[
                                    { name: "Portfolio Value", data: investmentData, type: "area", color: "#2196F3" }
                                ]}
                            />
                        </Col>
                    </Row>
                </Card>

                {/* Combined Analysis */}
                <Card title="Combined Financial Analysis" className="shadow-sm">
                    <FinanceChart
                        title="Cash Flow Overview"
                        categories={categories}
                        seriesData={[
                            { name: "Income", data: Array(categories.length).fill(totalIncome), type: "line", color: "#4CAF50", dashStyle: "Dash" },
                            { name: "Expenses", data: expensesData, type: "line", color: "#FF5722" },
                            { name: "Loan EMI", data: emiData, type: "line", color: "#3F51B5" },
                            { name: "Investments", data: investmentData, type: "area", color: "#2196F3", opacity: 0.3 }
                        ]}
                    />
                </Card>
            </div>
        </div>
    );
}