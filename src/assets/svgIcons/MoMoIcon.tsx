import React from 'react';
import { Svg, Path, Circle, G } from 'react-native-svg';

interface MoMoIconProps {
    type?: 'circle' | 'square' | 'transparent';
    size?: number;

}
const MoMoIcon = ({ type = 'circle', size = 336 }: MoMoIconProps) => {
    switch (type) {
        case 'transparent':
            return (
                <Svg width={size} height={size} viewBox="0 0 60 60" className='w-full h-full'>
                    <G stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <G>
                            <Path
                                d="M55.9459459,0 L4.05405405,0 C2.56756757,0 1.21621622,0 0,0 L0,55.9459459 C0,57.4324324 0,58.7837838 0,60 L60,60 C60,58.7837838 60,57.4324324 60,55.9459459 L60,0 C58.7837838,0 57.4324324,0 55.9459459,0 Z"
                                id="Path"
                            />
                            <G id="Group" transform="translate(4.000000, 5.500000)" fill="#A50064" fillRule="nonzero">
                                <Path
                                    d="M40.9111892,22.0954907 C47.0426493,22.0954907 52,17.1564987 52,11.0477454 C52,4.93899204 47.0426493,0 40.9111892,0 C34.7797291,0 29.8223783,4.93899204 29.8223783,11.0477454 C29.8223783,17.1564987 34.7797291,22.0954907 40.9111892,22.0954907 Z M40.9111892,6.34270557 C43.5203211,6.34270557 45.633718,8.44827586 45.633718,11.0477454 C45.633718,13.6472149 43.5203211,15.7527851 40.9111892,15.7527851 C38.3020572,15.7527851 36.1886603,13.6472149 36.1886603,11.0477454 C36.1886603,8.44827586 38.3020572,6.34270557 40.9111892,6.34270557 Z"
                                    id="Shape"
                                />
                                <Path
                                    d="M40.9111892,26.8785146 C34.7797291,26.8785146 29.8223783,31.8175066 29.8223783,37.9262599 C29.8223783,44.0350133 34.7797291,48.9740053 40.9111892,48.9740053 C47.0426493,48.9740053 52,44.0350133 52,37.9262599 C52,31.8175066 47.0426493,26.8785146 40.9111892,26.8785146 Z M40.9111892,42.6312997 C38.3020572,42.6312997 36.1886603,40.5257294 36.1886603,37.9262599 C36.1886603,35.3267905 38.3020572,33.2212202 40.9111892,33.2212202 C43.5203211,33.2212202 45.633718,35.3267905 45.633718,37.9262599 C45.633718,40.5257294 43.5203211,42.6312997 40.9111892,42.6312997 Z"
                                    id="Shape"
                                />
                                <Path
                                    d="M18.3161064,26.8785146 C16.4375314,26.8785146 14.7155043,27.5023873 13.3326643,28.5421751 C11.9498244,27.5023873 10.201706,26.8785146 8.34922228,26.8785146 C3.75715003,26.8785146 0.0260913196,30.595756 0.0260913196,35.1708223 L0.0260913196,49 L6.39237331,49 L6.39237331,35.0928382 C6.39237331,34.0530504 7.22729553,33.2212202 8.27094832,33.2212202 C9.3146011,33.2212202 10.1495233,34.0530504 10.1495233,35.0928382 L10.1495233,48.9740053 L16.5158053,48.9740053 L16.5158053,35.0928382 C16.5158053,34.0530504 17.3507275,33.2212202 18.3943803,33.2212202 C19.4380331,33.2212202 20.2729553,34.0530504 20.2729553,35.0928382 L20.2729553,48.9740053 L26.613146,48.9740053 L26.613146,35.1448276 C26.613146,30.595756 22.9081786,26.8785146 18.3161064,26.8785146 Z"
                                    id="Path"
                                />
                                <Path
                                    d="M18.3161064,0 C16.4375314,0 14.7155043,0.623872679 13.3326643,1.66366048 C11.9498244,0.623872679 10.201706,0 8.34922228,0 C3.73105871,0 0,3.71724138 0,8.29230769 L0,22.0954907 L6.36628199,22.0954907 L6.36628199,8.21432361 C6.36628199,7.17453581 7.20120421,6.34270557 8.244857,6.34270557 C9.28850978,6.34270557 10.123432,7.17453581 10.123432,8.21432361 L10.123432,22.0954907 L16.489714,22.0954907 L16.489714,8.21432361 C16.489714,7.17453581 17.3246362,6.34270557 18.368289,6.34270557 C19.4119418,6.34270557 20.246864,7.17453581 20.246864,8.21432361 L20.246864,22.0954907 L26.613146,22.0954907 L26.613146,8.29230769 C26.613146,3.71724138 22.9081786,0 18.3161064,0 Z"
                                    id="Path"
                                />
                            </G>
                        </G>
                    </G>
                </Svg>
            );

        case 'square':
            return (
                <Svg viewBox="0 0 296 296" width={size} height={size} >
                    <Path
                        fill="#A50064"
                        d="M276,0H20C9,0,0,9,0,20v256c0,11,9,20,20,20h256c11,0,20-9,20-20V20C296,9,287,0,276,0z"
                    />
                    <G>
                        <Path
                            fill="#FFFFFF"
                            d="M204.8,139c23.5,0,42.5-19,42.5-42.5c0-23.5-19-42.5-42.5-42.5c-23.5,0-42.5,19-42.5,42.5
              C162.3,120,181.3,139,204.8,139z M204.8,78.4c10,0,18.1,8.1,18.1,18.1c0,10-8.1,18.1-18.1,18.1c-10,0-18.1-8.1-18.1-18.1
              C186.7,86.5,194.8,78.4,204.8,78.4z"
                        />
                        <Path
                            fill="#FFFFFF"
                            d="M204.8,157.4c-23.5,0-42.5,19-42.5,42.5c0,23.5,19,42.5,42.5,42.5c23.5,0,42.5-19,42.5-42.5
              C247.3,176.4,228.3,157.4,204.8,157.4z M204.8,218c-10,0-18.1-8.1-18.1-18.1c0-10,8.1-18.1,18.1-18.1c10,0,18.1,8.1,18.1,18.1
              C222.9,209.9,214.8,218,204.8,218z"
                        />
                        <Path
                            fill="#FFFFFF"
                            d="M118.2,157.4c-7.2,0-13.8,2.4-19.1,6.4c-5.3-4-12-6.4-19.1-6.4c-17.6,0-31.9,14.3-31.9,31.9v53.2h24.4V189
              c0-4,3.2-7.2,7.2-7.2c4,0,7.2,3.2,7.2,7.2v53.4h24.4V189c0-4,3.2-7.2,7.2-7.2c4,0,7.2,3.2,7.2,7.2v53.4H150v-53.2
              C150,171.7,135.8,157.4,118.2,157.4z"
                        />
                        <Path
                            fill="#FFFFFF"
                            d="M118.2,54c-7.2,0-13.8,2.4-19.1,6.4c-5.3-4-12-6.4-19.1-6.4C62.3,54,48,68.3,48,85.9V139h24.4V85.6
              c0-4,3.2-7.2,7.2-7.2c4,0,7.2,3.2,7.2,7.2V139h24.4V85.6c0-4,3.2-7.2,7.2-7.2c4,0,7.2,3.2,7.2,7.2V139H150V85.9
              C150,68.3,135.8,54,118.2,54z"
                        />
                    </G>
                </Svg>
            );

        case 'circle':
        default:
            return (
                <Svg viewBox="0 0 336 336" width={size} height={size} >
                    <Circle cx="168" cy="168" r="168" fill="#A50064" />
                    <G>
                        <Path
                            fill="#FFFFFF"
                            d="M224.8,159c23.5,0,42.5-19,42.5-42.5c0-23.5-19-42.5-42.5-42.5c-23.5,0-42.5,19-42.5,42.5   C182.3,140,201.3,159,224.8,159z M224.8,98.4c10,0,18.1,8.1,18.1,18.1c0,10-8.1,18.1-18.1,18.1c-10,0-18.1-8.1-18.1-18.1   C206.7,106.5,214.8,98.4,224.8,98.4z"
                        />
                        <Path
                            fill="#FFFFFF"
                            d="M138.2,74c-7.2,0-13.8,2.4-19.1,6.4c-5.3-4-12-6.4-19.1-6.4C82.3,74,68,88.3,68,105.9V159h24.4v-53.4   c0-4,3.2-7.2,7.2-7.2c4,0,7.2,3.2,7.2,7.2V159h24.4v-53.4c0-4,3.2-7.2,7.2-7.2c4,0,7.2,3.2,7.2,7.2V159H170v-53.1   C170,88.3,155.8,74,138.2,74z"
                        />
                        <Path
                            fill="#FFFFFF"
                            d="M224.8,177.4c-23.5,0-42.5,19-42.5,42.5c0,23.5,19,42.5,42.5,42.5c23.5,0,42.5-19,42.5-42.5   C267.3,196.4,248.3,177.4,224.8,177.4z M224.8,238c-10,0-18.1-8.1-18.1-18.1c0-10,8.1-18.1,18.1-18.1c10,0,18.1,8.1,18.1,18.1   C242.9,229.9,234.8,238,224.8,238z"
                        />
                        <Path
                            fill="#FFFFFF"
                            d="M138.2,177.4c-7.2,0-13.8,2.4-19.1,6.4c-5.3-4-12-6.4-19.1-6.4c-17.6,0-31.9,14.3-31.9,31.9v53.2h24.4V209   c0-4,3.2-7.2,7.2-7.2c4,0,7.2,3.2,7.2,7.2v53.4h24.4V209c0-4,3.2-7.2,7.2-7.2c4,0,7.2,3.2,7.2,7.2v53.4H170v-53.2   C170,191.7,155.8,177.4,138.2,177.4z"
                        />
                    </G>
                </Svg>
            );
    }
};

export default MoMoIcon;
