import React from 'react';
import {Modal, TouchableOpacity, View, Text} from 'react-native';

export type ModalErrorProps = {
    errorText: string;
    visible: boolean;
    handleCloseModal: () => void;
};

const ModalError: React.FC<ModalErrorProps> = ({ errorText, visible, handleCloseModal }) => {
    return <Modal visible={visible} transparent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: '#fff', padding: 20 }}>
                <Text>{errorText}</Text>
                <TouchableOpacity onPress={handleCloseModal}>
                    <Text>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>;
};

export default ModalError;
