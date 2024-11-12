import React from 'react'
import { LineChart } from 'react-native-gifted-charts';

const LineChartComponent = () => {

    const data1 = [
        { value: 12e6, label: 'T1' },
        { value: 12e6, label: 'T2' },
        { value: 12e6, label: 'T3' },
        { value: 12e6, label: 'T4' },
        { value: 12e6, label: 'T5' },
        { value: 12e6, label: 'T6' },
        { value: 12e6, label: 'T7' },
        { value: 12e6, label: 'T8' },
        { value: 12e6, label: 'T9' },
        { value: 12e6, label: 'T10' },
        { value: 12e6, label: 'T11' },
        { value: 12e6, label: 'T12' },
    ];
    const data2 = [
        { value: 6e6, label: 'T1' },
        { value: 3e6, label: 'T2' },
        { value: 7_500_000, label: 'T3' },
        { value: 1_200_000, label: 'T4' },
        { value: 5e6, label: 'T5' },
        { value: 3e6, label: 'T6' },
        { value: 2e6, label: 'T7' },
        { value: 9e6, label: 'T8' },
        { value: 12e6, label: 'T9' },
        { value: 11e6, label: 'T10' },
        { value: 7e6, label: 'T11' },
        { value: 9e6, label: 'T12' },
    ];

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
            data={data1}
            data2={data2}
            hideDataPoints
            color1="#FC00A8"
            color2="#46BB1D"
            startFillColor1="#FC00A8"
            startFillColor2="#46BB1D"
            endFillColor1="#FC00A8"
            endFillColor2="#46BB1D"
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