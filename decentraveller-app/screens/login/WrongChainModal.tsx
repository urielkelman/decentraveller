import { Modal, Pressable, View, Text, StyleSheet } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { useWalletConnect } from '@walletconnect/react-native-dapp';

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

const WrongChainModal = () => {
    const appContext = useAppContext();

    return (
        <Modal
            visible={appContext.connectionContext && appContext.connectionContext.isWrongChain}
            animationType="slide"
            transparent={false}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Update to correct chain!</Text>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => appContext.pushChangeUpdate()}
                    >
                        <Text style={styles.textStyle}>Update</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

export default WrongChainModal;
