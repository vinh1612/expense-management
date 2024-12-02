import React from 'react';
import { Svg, Path } from 'react-native-svg';

interface ArrowIconProps {
    direction?: 'left' | 'up' | 'down' | 'right';
    color?: string;
    size?: number;
    width?: number;

}
const ArrowIcon = ({ direction = 'right', color = 'black', size = 24, width = 2 }: ArrowIconProps) => {

    const rotations = {
        left: 'rotate(180 12 12)',
        up: 'rotate(-90 12 12)',
        down: 'rotate(90 12 12)',
        right: 'rotate(0 12 12)',
    };

    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" className='w-full h-full'>
            <Path
                d="M9 5L16 12L9 19"
                stroke={color}
                strokeWidth={width}
                strokeLinecap="round"
                strokeLinejoin="round"
                transform={rotations[direction]}
            />
        </Svg>
    );
};

export default ArrowIcon;
