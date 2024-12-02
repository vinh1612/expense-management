import React from 'react'
import { LineChart, lineDataItem } from 'react-native-gifted-charts';

const LineChartComponent = ({ lineData1, lineData2, color1, color2 }: {
    lineData1: lineDataItem[],
    color1: string,
    lineData2?: lineDataItem[],
    color2?: string,
}) => {



    const formatValue = (num: number) => {
        if (num >= 1e9) {
            return (num / 1e9).toFixed(0) + ' Tỷ';
        } else if (num >= 1e6) {
            return (num / 1e6).toFixed(0) + ' Triệu';
        } else if (num >= 1e3) {
            return (num / 1e3).toFixed(0) + ' K';
        } else {
            return num.toString();
        }
    }

    return (
        <LineChart
            // curved
            // areaChart
            isAnimated
            animateOnDataChange
            animationDuration={1500}
            onDataChangeAnimationDuration={1500}
            adjustToWidth
            data={lineData1}
            data2={lineData2}
            hideDataPoints
            color1={color1}
            color2={color2}
            startFillColor1={color1}
            startFillColor2={color2}
            endFillColor1={color1}
            endFillColor2={color2}
            startOpacity={0.9}
            endOpacity={0.2}
            noOfSections={5}
            yAxisColor="white"
            yAxisThickness={0}
            xAxisThickness={0}
            hideRules
            yAxisTextStyle={{ color: 'white' }}
            xAxisLabelTextStyle={{ color: 'white' }}
            xAxisColor="white"
            formatYLabel={(value: string) => formatValue(Number(value))}
            yAxisLabelWidth={60}
        />
    )
}

export default LineChartComponent