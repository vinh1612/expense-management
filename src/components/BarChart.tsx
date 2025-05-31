import React from 'react'
import { Text, View } from 'react-native';
import { BarChart, barDataItem } from 'react-native-gifted-charts';
import { formatMoney, formatMoneyWithUnitShort } from '../utils/NumberUtils';

const BarChartComponent = ({ barData }: { barData: barDataItem[] }) => {

    const yAxisTextStyle = { color: 'white' }
    const xAxisLabelTextStyle = { color: 'white', textAlign: 'center' }

    return (
        <BarChart
            isAnimated
            hideRules
            data={barData}
            initialSpacing={10}
            spacing={14}
            xAxisColor={'white'}
            yAxisColor={'white'}
            yAxisTextStyle={yAxisTextStyle}
            xAxisLabelTextStyle={xAxisLabelTextStyle}
            formatYLabel={(value: string) => formatMoneyWithUnitShort(Number(value))}
            yAxisLabelWidth={55}
            maxValue={barData.length > 0 ? Math.max(...barData.map(item => item.value ?? 0)) : 0}
            renderTooltip={(item: barDataItem) => {
                return (
                    <View
                        className='rounded-md px-2 py-1 bg-[#ffcefe] -mb-5'
                    >
                        <Text>{formatMoney(item.value ?? 0)}</Text>
                    </View>
                );
            }}
        />
    )
}

export default BarChartComponent