import React from 'react'
import { PieChart, pieDataItem } from "react-native-gifted-charts";
import { G, Rect, Text as SvgText } from 'react-native-svg';

const PieChartComponent = ({ pieData }: { pieData: pieDataItem[] }) => {

    return (
        <PieChart
            donut
            data={pieData}
            innerCircleColor={'#374151'}
            showExternalLabels
            labelLineConfig={{
                color: 'white',
                length: 10,
                labelComponentWidth: 40,
            }}
            extraRadius={60}
            externalLabelComponent={item => (
                <SvgText fill={'white'} fontSize={12} fontWeight={'bold'}>{item?.text ?? ''}</SvgText>
            )}
        />
    )
}

export default PieChartComponent