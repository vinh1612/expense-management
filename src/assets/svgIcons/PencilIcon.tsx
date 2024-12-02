import React from 'react';
import Svg, { G, Path, ClipPath, Rect, Defs } from 'react-native-svg';

interface PencilIconProps {
    size?: number;
    color?: string;
}

const PencilIcon: React.FC<PencilIconProps> = ({ size = 18, color = '#C5C6C9' }) => {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 18 18"
            fill="none"
        >
            <G clipPath="url(#clip0)">
                <Path
                    d="M15.2142 14.4081H10.773C10.3397 14.4081 9.9873 14.7651 9.9873 15.204C9.9873 15.6438 10.3397 16 10.773 16H15.2142C15.6475 16 15.9999 15.6438 15.9999 15.204C15.9999 14.7651 15.6475 14.4081 15.2142 14.4081Z"
                    fill={color}
                />
                <Path
                    d="M2.68367 13.1527C2.24605 13.5902 2.00013 14.1836 2 14.8024V16H3.19758C3.81637 15.9999 4.40977 15.7539 4.84725 15.3163L12.6307 7.53291L10.4671 5.36932L2.68367 13.1527Z"
                    fill={color}
                />
                <Path
                    d="M15.5012 2.49878C15.3592 2.35658 15.1905 2.24378 15.0048 2.16681C14.8192 2.08985 14.6202 2.05023 14.4192 2.05023C14.2182 2.05023 14.0192 2.08985 13.8335 2.16681C13.6478 2.24378 13.4791 2.35658 13.3371 2.49878L11.2919 4.54453L13.4555 6.70811L15.5012 4.66294C15.6434 4.52089 15.7563 4.35221 15.8332 4.16654C15.9102 3.98087 15.9498 3.78185 15.9498 3.58086C15.9498 3.37987 15.9102 3.18085 15.8332 2.99518C15.7563 2.80951 15.6434 2.64082 15.5012 2.49878Z"
                    fill={color}
                />
            </G>
            <Defs>
                <ClipPath id="clip0">
                    <Rect width="14" height="14" fill="white" transform="translate(2 2)" />
                </ClipPath>
            </Defs>
        </Svg>
    );
};

export default PencilIcon;
