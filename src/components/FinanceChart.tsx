// components/FinanceChart.tsx
"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card } from "antd";

interface FinanceChartProps {
    title: string;
    categories: string[];
    seriesData: {
        name: string;
        data: number[];
        type: "line" | "area" | "column" | "bar";
        color?: string;
        dashStyle?: string;
        opacity?: number;
    }[];
    chartType?: string;
}

const FinanceChart = ({ title, categories, seriesData, chartType }: FinanceChartProps) => {
    const options: Highcharts.Options = {
        title: {
            text: title,
            style: {
                fontSize: '16px',
                fontWeight: 'bold'
            }
        },
        chart: {
            type: chartType as any,
            backgroundColor: 'transparent',
            height: 300
        },
        xAxis: {
            categories,
            crosshair: true
        },
        yAxis: {
            title: {
                text: "Amount (₹)"
            },
            labels: {
                formatter: function () {
                    return '₹' + this.value.toLocaleString();
                }
            }
        },
        tooltip: {
            formatter: function () {
                return `<b>${this.series.name}</b><br/>${this.x}: ₹${this.y?.toLocaleString()}`;
            }
        },
        plotOptions: {
            series: {
                marker: {
                    radius: 4
                }
            },
            column: {
                borderRadius: 3
            }
        },
        series: seriesData.map(data => ({
            name: data.name,
            data: data.data,
            type: data.type as any,
            color: data.color || "#4CAF50",
            dashStyle: data.dashStyle as any,
            fillOpacity: data.opacity,
            lineWidth: 2
        })),
        credits: {
            enabled: false
        }
    };

    return (
        <Card bordered={false} className="h-full shadow-sm">
            <HighchartsReact highcharts={Highcharts} options={options} />
        </Card>
    );
};

export default FinanceChart;