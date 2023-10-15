import { StyleSheet } from 'react-native';
import { DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR } from '../commons/global';
import { Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const communityScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR,
    },
    scrollView: {
    },
    content: {
        flex: 1,
    },
    section: {
        padding: 16,
        paddingBottom: 0,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Montserrat_800ExtraBold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Montserrat_400Regular',
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    dropContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    picker: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 10,
        fontSize: 16,
        fontFamily: 'Montserrat_400Regular',
    },
    ruleContainer: {
        marginTop: 10
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
    halfScreenCard: {
        flex: 0.45,
    }
});

const ruleDetailStyles = StyleSheet.create({
    main: {
        backgroundColor: DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR,
        flex: 1
    },
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
    title: {
        fontSize: 18,
        fontFamily: 'Montserrat_500Medium',
        alignSelf: "center",
    },
    subsubtitle: {
        alignSelf: "center",
        fontSize: 14,
        fontFamily: 'Montserrat_400Regular',
    },
    subtitle: {
        alignSelf: "center",
        fontSize: 18,
        fontFamily: 'Montserrat_400Regular',
        marginBottom: 10
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
