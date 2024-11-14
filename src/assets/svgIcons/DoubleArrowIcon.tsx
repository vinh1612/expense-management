// DoubleArrow.tsx
import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface DoubleArrowIconProps {
    direction?: 'left' | 'right' | 'up' | 'down';
    color?: string;
    size?: number;
    width?: number;
}

const DoubleArrowIcon: React.FC<DoubleArrowIconProps> = ({
    direction = 'right',
    color = 'black',
    size = 24,
    width = 2,
}) => {

    const rotations = {
        left: 'rotate(180 12 12)',
        up: 'rotate(-90 12 12)',
        down: 'rotate(90 12 12)',
        right: 'rotate(0 12 12)',
    };

    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={width}
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={rotations[direction]}
            className='transition-all duration-500 ease-in-out'
        >
            <Path d="M13 17l5-5-5-5" />
            <Path d="M6 17l5-5-5-5" />
        </Svg>
    );
};

export default DoubleArrowIcon;
