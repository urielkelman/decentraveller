import React, { useState } from 'react';

import { Text, View } from 'react-native';

export type CreateProgressBarProps = {
    progress: number;
    height: number;
    color: string;
    unfilledColor: string;
    label: string;
};

const DecentravellerProgressBar: React.FC<CreateProgressBarProps> = ({
    progress,
    height,
    color: color,
    unfilledColor: unfilledColor,
    label,
}) => {
    const [getPercentage, setPercentage] = useState(`${Math.floor(Math.min(progress, 1) * 100)}%`);

    return (
        <View style={{ flexDirection: 'column' }}>
            <View style={{ justifyContent: 'center' }}>
                <View
                    style={{
                        width: '100%',
                        height: height,
                        marginVertical: 10,
                        borderRadius: 5,
                        borderColor: 'black',
                        backgroundColor: unfilledColor,
                        borderWidth: 1,
                    }}
                />
                <View
                    style={{
                        width: getPercentage ? getPercentage : 0,
                        height: height,
                        marginVertical: 10,
                        borderRadius: 5,
                        backgroundColor: color,
                        position: 'absolute',
                        bottom: height,
                        borderColor: 'black',
                        borderWidth: 1,
                    }}
                />
                <View
                    style={{
                        width: '100%',
                        height: height,
                        bottom: 10,
                    }}
                >
                    <Text style={{ textAlign: 'center' }}>{label}</Text>
                </View>
            </View>
        </View>
    );
};

export default DecentravellerProgressBar;
