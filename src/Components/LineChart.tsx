import React from "react";
import { useEffect } from "react";
import * as Highcharts from "highcharts";
import { observer } from "mobx-react-lite";
import { useStore } from "../Stores";
import ErrorBoundary from "./ErrorBoundary";
import { get } from "lodash";

/**
 * LineChart component
 * To Visualise the stock data in charts
 */
export const LineChart = observer(() => {
    const { stocksStore } = useStore();
    useEffect(() => {
        let company: any = stocksStore.displayedStock;
        let timeSeriesData = processData(stocksStore.timeSeriesData);
        (Highcharts as any).chart('line_chart', {
            chart: {
                borderRadius: 8,
                height: 350,
                backgroundColor: "#AFD3E2",
                style: {
                    fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
                    fontSize: "12px",
                    padding: 10,
                    boxSizing: "border-box"
                }
            },
            title: {
                text: get(company, "Name") ? get(company, "Name") + " : " + get(company, "Symbol") : "Line Chart"
            },
            xAxis: {
                type: "datetime",
                startOnTick: true,
                endOnTick: true
            },
            yAxis: {
                gridLineColor: "grey",
                startOnTick: true,
                endOnTick: true
            },
            credits: {
                enabled: false
            },
            series: [{
                name: stocksStore.currentSymbol,
                data: timeSeriesData,
                color: "#146C94"
            }]
        });
    }, [stocksStore.timeSeriesData, stocksStore.currentSymbol])

    /**
     * function processData
     * Params: timeSeriesData
     * Comment: to parse the data to feed into linechart
     */
    const processData = (timeSeriesData: any) => {
        return timeSeriesData.length &&
            timeSeriesData.map(data => {
                return [new Date(data.datetime).getTime(), parseFloat(data.close)]
            });
    }
    return (
        <ErrorBoundary>
            <div id="line_chart"></div>
        </ErrorBoundary>
    )
});

