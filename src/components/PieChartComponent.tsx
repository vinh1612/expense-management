import React from 'react'
import { PieChart } from "react-native-gifted-charts";

const PieChartComponent = () => {

    const pieData = [
        { value: 47, color: '#FFA84A', text: '47%' },
        { value: 20, color: '#FB67CA', text: '20%' },
        { value: 23, color: '#9B88ED', text: '23%' },
        { value: 40, color: '#04BFDA', text: '40%' },
    ];

    return (
        <PieChart
            data={pieData}
            donut
            innerCircleColor={'#111827'}
            showText
            textColor="white"
            textBackgroundColor='transparent'
            focusOnPress
            showValuesAsLabels
            showTextBackground
        />
    )
}

export default PieChartComponent