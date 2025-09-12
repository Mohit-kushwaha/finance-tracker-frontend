"use client";

import { Form, InputNumber, Button, Card, Select } from "antd";
import { useState } from "react";
const { Option } = Select;

export default function FinanceForm({ onAnalyze }: { onAnalyze: (formData: any) => void }) {
    const [form] = Form.useForm();
    const yearOptions = [1, 5, 10];  // years

    const handleFinish = (values: any) => {
        // Prepare the request format as backend expects
        const formattedData = {
            income: values.income,
            expenses: {
                rent: values.rent,
                groceries: values.groceries,
                utilities: values.utilities,
                transport: values.transport,
                childrenEducation: values.childrenEducation,
                medicalExpenses: values.medicalExpenses,
                entertainment: values.entertainment,
                miscellaneous: values.miscellaneous,
                parentsSupport: values.parentsSupport,
            },
            loans: [
                {
                    type: "home",
                    amount: values.loanAmount,
                    emi: values.loanEmi,
                    interestRate: values.loanInterestRate,
                    tenure: values.loanTenure,
                },
            ],
            investments: [
                {
                    type: "mutual fund",
                    invested: values.investedMF,
                    amount: values.amountMF,
                    expectedReturnRate: values.returnMF,
                },
                {
                    type: "PPF",
                    invested: values.investedPPF,
                    amount: values.amountPPF,
                    expectedReturnRate: values.returnPPF,
                },
            ],
            emergencyFund: values.emergencyFund,
            month: values.years * 12,
        };

        onAnalyze(formattedData);
    };

    return (
        <Card className="max-w-4xl mx-auto">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    income: 80000,
                    rent: 20000,
                    groceries: 12000,
                    utilities: 6000,
                    transport: 5000,
                    childrenEducation: 10000,
                    medicalExpenses: 4000,
                    entertainment: 3000,
                    miscellaneous: 3000,
                    parentsSupport: 8000,
                    loanAmount: 4000000,
                    loanEmi: 25000,
                    loanInterestRate: 7.0,
                    loanTenure: 5,
                    investedMF: 100000,
                    amountMF: 10000,
                    returnMF: 12,
                    investedPPF: 100000,
                    amountPPF: 5000,
                    returnPPF: 7,
                    emergencyFund: 60000,
                }}
            >
                <Form.Item
                    label="Years"
                    name="years"
                    rules={[{ required: true, message: "Please select a time period in years" }]}
                >
                    <Select placeholder="Select Years" style={{ width: "100%" }}>
                        {yearOptions.map((year) => (
                            <Option key={year} value={year}>
                                {year} Year(s)
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <h2 className="text-2xl font-semibold mb-4">Income</h2>
                <Form.Item label="Monthly Income" name="income" rules={[{ required: true }]}>
                    <InputNumber addonBefore="₹" className="w-full" />
                </Form.Item>

                <h2 className="text-2xl font-semibold mt-6 mb-4">Expenses</h2>
                <div className="grid grid-cols-2 gap-4">
                    {["rent", "groceries", "utilities", "transport", "childrenEducation", "medicalExpenses", "entertainment", "miscellaneous", "parentsSupport"].map((field) => (
                        <Form.Item key={field} label={field.charAt(0).toUpperCase() + field.slice(1)} name={field} rules={[{ required: true }]}>
                            <InputNumber addonBefore="₹" className="w-full" />
                        </Form.Item>
                    ))}
                </div>

                <h2 className="text-2xl font-semibold mt-6 mb-4">Loans</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item label="Loan Amount" name="loanAmount" rules={[{ required: true }]}>
                        <InputNumber addonBefore="₹" className="w-full" />
                    </Form.Item>
                    <Form.Item label="Monthly EMI" name="loanEmi" rules={[{ required: true }]}>
                        <InputNumber addonBefore="₹" className="w-full" />
                    </Form.Item>
                    <Form.Item label="Interest Rate (%)" name="loanInterestRate" rules={[{ required: true }]}>
                        <InputNumber addonAfter="%" className="w-full" />
                    </Form.Item>
                    <Form.Item label="Loan Tenure (Month left)" name="loanTenure" rules={[{ required: true }]}>
                        <InputNumber className="w-full" />
                    </Form.Item>
                </div>

                <h2 className="text-2xl font-semibold mt-6 mb-4">Investments</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item label="Mutual Fund Invested Amount" name="investedMF" rules={[{ required: true }]}>
                        <InputNumber addonBefore="₹" className="w-full" />
                    </Form.Item>
                    <Form.Item label="Mutual Fund Monthly Amount" name="amountMF" rules={[{ required: true }]}>
                        <InputNumber addonBefore="₹" className="w-full" />
                    </Form.Item>
                    <Form.Item label="Mutual Fund Return (%)" name="returnMF" rules={[{ required: true }]}>
                        <InputNumber addonAfter="%" className="w-full" />
                    </Form.Item>

                    <Form.Item label="PPF Invested Amount" name="investedPPF" rules={[{ required: true }]}>
                        <InputNumber addonBefore="₹" className="w-full" />
                    </Form.Item>
                    <Form.Item label="PPF Monthly Amount" name="amountPPF" rules={[{ required: true }]}>
                        <InputNumber addonBefore="₹" className="w-full" />
                    </Form.Item>
                    <Form.Item label="PPF Return (%)" name="returnPPF" rules={[{ required: true }]}>
                        <InputNumber addonAfter="%" className="w-full" />
                    </Form.Item>
                </div>

                <h2 className="text-2xl font-semibold mt-6 mb-4">Emergency Fund</h2>
                <Form.Item label="Current Emergency Fund" name="emergencyFund" rules={[{ required: true }]}>
                    <InputNumber addonBefore="₹" className="w-full" />
                </Form.Item>

                <Form.Item className="mt-6">
                    <Button type="primary" htmlType="submit" className="w-full">
                        Analyze
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}
