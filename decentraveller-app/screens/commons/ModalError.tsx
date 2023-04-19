import React from 'react';
import { View } from 'react-native';

export type ModalErrorProps = {
    errorText: string;
};

const ModalError: React.FC<ModalErrorProps> = ({ errorText }) => {
    return <View>{errorText}</View>;
};

export default ModalError;
