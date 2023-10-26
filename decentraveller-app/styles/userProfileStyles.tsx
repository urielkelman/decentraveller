import { StyleSheet } from 'react-native';
import { DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR } from '../commons/global';

const userProfileMainStyles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR,
    },
    mainContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginHorizontal: 13,
        marginTop: 20,
        width: 338,
        height: 247,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
    },
    imageCircle: {
        backgroundColor: 'lightgray',
        borderRadius: 50,
        width: 100,
        height: 100,
        overflow: 'hidden',
    },
    circleDimensions: {
        width: 100,
        height: 100,
    },
    titleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    nicknameTitle: {
        fontFamily: 'Montserrat_700Bold',
        fontSize: 18,
        textAlign: 'center',
    },
    walletSubtitle: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 11,
        textAlign: 'center',
    },
    joinedAtContainer: {
        backgroundColor: '#F3F3F3',
        borderRadius: 5,
        marginHorizontal: 14,
        marginTop: 15,
        height: 41,
        justifyContent: 'center',
    },
    joinedAtText: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 11,
        color: '#020202',
        paddingHorizontal: 10,
    },
    informationContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginHorizontal: 13,
        marginTop: 10,
    },
    spacedBetweenView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    spacedButtonBetweenView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    leftText: {
        fontFamily: 'Montserrat_700Bold',
        fontSize: 15,
        textAlign: 'left',
        fontWeight: 'bold',
    },
    rightText: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 15,
        textAlign: 'right',
        fontWeight: '100',
    },
    rightBlueText: {
        fontFamily: 'Montserrat_500Medium',
        fontSize: 15,
        textAlign: 'right',
        fontWeight: 'bold',
        color: 'blue',
    },
    smallCircleButton: {
        position: 'absolute',
        top: -10,
        right: 110,
        width: 35,
        height: 35,
        borderRadius: 100,
        backgroundColor: '#983B46',
        justifyContent: 'center',
        alignItems: 'center',
    },
    smallCircleImage: {
        width: 24,
        height: 24,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalOption: {
        fontSize: 18,
        paddingVertical: 10,
        textAlign: 'center',
    },
});

export { userProfileMainStyles };
