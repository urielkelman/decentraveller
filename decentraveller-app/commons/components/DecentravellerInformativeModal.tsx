import React from 'react';
import { Modal, TouchableOpacity, View, Text } from 'react-native';
import { modalStyles } from '../../styles/commons';

export type ModalErrorProps = {
    informativeText: string;
    visible: boolean;
    closeModalText: string;
    handleCloseModal: () => void;
};

const DecentravellerInformativeModal: React.FC<ModalErrorProps> = ({
    informativeText,
    visible,
    closeModalText,
    handleCloseModal,
}) => {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={modalStyles.modalContainer}>
                <View style={modalStyles.modalContent}>
                    <Text style={modalStyles.modalText}>{informativeText}</Text>
                    <TouchableOpacity style={modalStyles.modalButton} onPress={handleCloseModal}>
                        <Text style={modalStyles.modalButtonText}>{closeModalText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default DecentravellerInformativeModal;
