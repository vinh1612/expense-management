import React from 'react'
import { PieChart, pieDataItem } from "react-native-gifted-charts";

const PieChartComponent = ({ pieData }: { pieData: pieDataItem[] }) => {

    return (
        <PieChart
            donut
            data={pieData}
            innerCircleColor={'#374151'}
            showText
            showValuesAsLabels
            textColor='white'
            textSize={16}
        />
    )
}

export default PieChartComponent