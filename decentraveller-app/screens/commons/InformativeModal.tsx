import React from 'react';
import { Modal, TouchableOpacity, View, Text } from 'react-native';

export type ModalErrorProps = {
    informativeText: string;
    visible: boolean;
    closeModalText: string;
    handleCloseModal: () => void;
};

const InformativeModal: React.FC<ModalErrorProps> = ({
    informativeText,
    visible,
    closeModalText,
    handleCloseModal,
}) => {
    return (
        <Modal visible={visible} transparent>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
            >
                <View style={{ backgroundColor: '#fff', padding: 20 }}>
                    <Text>{informativeText}</Text>
                    <TouchableOpacity onPress={handleCloseModal}>
                        <Text>{closeModalText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default InformativeModal;
