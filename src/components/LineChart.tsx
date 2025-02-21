import { LineChart, lineDataItem } from "react-native-gifted-charts";
import { formatMoneyWithUnitShort } from "../utils/NumberUtils";

const LineChartComponent = ({ lineData, lineData2, color1, color2 }: {
    lineData: lineDataItem[], lineData2?: lineDataItem[],
    color1: string, color2?: string,
}) => {

    return (
        <LineChart
            curved
            hideRules
            data={lineData}
            data2={lineData2}
            overflowBottom={50}
            animateOnDataChange
            isAnimated
            animationDuration={500}
            onDataChangeAnimationDuration={500}
            scrollAnimation
            animateTogether
            renderDataPointsAfterAnimationEnds
            maxValue={lineData2
                ? Math.max(...lineData.map(item => item.value ?? 0), ...lineData2.map(item => item.value ?? 0))
                : Math.max(...lineData.map(item => item.value ?? 0))
            }
            yAxisColor={'white'}
            xAxisColor={'white'}
            yAxisLabelWidth={55}
            xAxisThickness={0}
            color1={color1}
            color2={color2}
            dataPointsColor1={color1}
            dataPointsColor2={color2}
            textShiftY={20}
            textShiftX={-10}
            textFontSize={13}
            textColor1="white"
            textColor2="white"
            showDataPointLabelOnFocus
            yAxisTextStyle={{ color: 'white' }}
            xAxisLabelTextStyle={{ color: 'white' }}
            formatYLabel={(value: string) => formatMoneyWithUnitShort(Number(value))}
        />
    );

};
export default LineChartComponent;