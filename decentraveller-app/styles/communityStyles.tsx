import { StyleSheet } from 'react-native';
import { DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR } from '../commons/global';
import { Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const communityScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFE1E1',
    },
    content: {
        flex: 1,
        paddingBottom: 100,
    },
    section: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    title: {
        fontSize: 24,
        fontFamily: 'Montserrat_800ExtraBold',
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Montserrat_400Regular',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    dropContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropdown: {
        width: 200,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#ffffff',
        borderRadius: 5,
        padding: 5,
    },
    dropdownText: {
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Montserrat_400Regular',
    },
    dropdownMenu: {
        width: 200,
    },
});

const ruleDetailStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR,
    },
    header: {
        backgroundColor: 'transparent',
        padding: 10,
        borderRadius: 10,
    },
    headerText: {
        fontSize: 18,
        fontFamily: 'Montserrat_700Bold',
    },
    descriptionContainer: {
        backgroundColor: 'transparent',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: 'black',
    },
    description: {
        fontSize: 24,
        textAlign: 'center',
        fontFamily: 'Montserrat_700Bold',
    },
    label: {
        fontSize: 14,
        marginBottom: 10,
        fontFamily: 'Montserrat_500Medium',
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Montserrat_400Regular',
    },
    explanationText: {
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
    },
    italic: {
        fontFamily: 'Montserrat_400Regular',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 0,
    },

    buttonVoteContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonImage: {
        width: 60,
        height: 60,
        marginTop: 10,
    },
    buttonMargin: {
        marginLeft: 20,
    },
    disabledButton: {
        opacity: 0.1,
    },
    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4,
        padding: 8,
        margin: 10,
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 8,
        marginLeft: 4,
        resizeMode: 'contain',
    },
    textContainer: {
        marginLeft: 4,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});


const proposeRuleStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR,
        padding: 16,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontFamily: 'Montserrat_700Bold',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Montserrat_400Regular',
        textAlign: 'center',
        marginBottom: 16,
    },
    textInput: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 2,
        padding: 16,
        marginBottom: 16,
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: -25,
    },
});


const votingResultsStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4,
        padding: 8,
        margin: 10,
    },
    header: {
        backgroundColor: 'transparent',
        padding: 10,
        borderRadius: 10,
    },
    headerText: {
        fontSize: 18,
        fontFamily: 'Montserrat_700Bold',
    },
    descriptionContainer: {
        backgroundColor: 'transparent',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: 'black',
    },
    description: {
        fontSize: 24,
        textAlign: 'center',
        fontFamily: 'Montserrat_700Bold',
    },
    label: {
        fontSize: 14,
        marginBottom: 10,
        fontFamily: 'Montserrat_500Medium',
        maxWidth: '95%',
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Montserrat_400Regular',
        marginBottom: 20,
    },
    explanationText: {
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
        marginBottom: 20,
        maxWidth: '100%',
    },
    italic: {
        fontFamily: 'Montserrat_400Regular',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: -25,
    },
    buttonVoteContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 0,
    },
    buttonImage: {
        width: 100,
        height: 100,
        marginTop: 10,
    },
    buttonMargin: {
        marginLeft: 20,
    },
    disabledButton: {
        opacity: 0.1,
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 8,
        resizeMode: 'contain',
    },
    textContainer: {
        marginLeft: 4,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    legendColorBox: {
        width: 10,
        height: 10,
        marginRight: 5,
    },
    quorumProgressBar: {
        width: '100%',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        fontFamily: 'Montserrat_400Regular',
    },
});

export { communityScreenStyles, ruleDetailStyles, proposeRuleStyles, votingResultsStyles };
