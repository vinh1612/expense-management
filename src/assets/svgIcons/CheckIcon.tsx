import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface CheckIconProps {
    size?: number; // Size of the icon (width & height)
    color?: string; // Color of the check mark
}

const CheckIcon: React.FC<CheckIconProps> = ({ size = 24, color = 'white' }) => {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className='w-full h-full'
        >
            <Path
                d="M20 6L9 17L4 12"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default CheckIcon;
