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
        data: (number | { name: string; y: number })[]; // support both formats
        type: "line" | "area" | "column" | "bar" | "pie";
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
            formatter: function (this: any) {
                // Pie chart points with a "name"
                if (this.point && this.point.name && this.series.type === "pie") {
                  return `<b>${this.point.name}</b>: ₹${this.y?.toLocaleString()}`;
                }
                // Line/Area/Column/Bar series
                return `<b>${this.series.name}</b><br/>${this.x}: ₹${this.y?.toLocaleString()}`;
              }
            
          },          
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                distance: 20,
                color: '#000000',   // force black text
                style: {
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textOutline: 'none'  // 👈 prevents Highcharts from adding white stroke that can "erase" text
                },
                allowOverlap: true, // 👈 ensures label won’t be hidden if overlapping
                crop: false,        // 👈 don’t crop outside plot area
                overflow: 'allow',  // 👈 let labels overflow chart bounds
                format: '{point.name}'
              }      
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