import React from "react";
import { Svg, Path } from "react-native-svg";

interface TransactionArrowProps {
    type: "income" | "expense";
    size?: number;
}

const TransactionArrow = ({ type, size = 24 }: TransactionArrowProps) => {
    const isIncome = type === "income";

    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d={isIncome ? "M12 4L6 10H10V20H14V10H18L12 4Z" : "M12 20L18 14H14V4H10V14H6L12 20Z"}
                fill={isIncome ? "#00C853" : "#D50000"}
            />
        </Svg>
    );
};

export default TransactionArrow;
