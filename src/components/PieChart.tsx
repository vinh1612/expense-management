import React from 'react'
import { PieChart, pieDataItem } from "react-native-gifted-charts";
import { Text as SvgText } from 'react-native-svg';

const PieChartComponent = ({ pieData }: { pieData: pieDataItem[] }) => {

    return (
        <PieChart
            donut
            data={pieData}
            innerCircleColor={'#374151'}
            showExternalLabels
            labelLineConfig={{
                color: 'white',
                length: 4,
                labelComponentWidth: 40,
                avoidOverlappingOfLabels: false
            }}
            extraRadius={60}
            externalLabelComponent={item => (
                <SvgText fill={'white'}>{item?.text ?? ''}</SvgText>
            )}
        />
    )
}

export default PieChartComponent