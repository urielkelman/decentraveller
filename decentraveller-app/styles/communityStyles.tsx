import { StyleSheet } from 'react-native';
import { DECENTRAVELLER_DEFAULT_BACKGROUND_COLOR } from '../commons/global';

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
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
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
        fontWeight: 'bold',
        marginLeft: -150,
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
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
    },
    label: {
        fontSize: 14,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        fontStyle: 'italic',
        marginBottom: 20,
    },
    italic: {
        fontStyle: 'italic',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 50,
    },
    buttonImage: {
        width: 100,
        height: 100,
        marginTop: 20,
    },

    buttonMargin: {
        marginLeft: 20,
    },
    disabledButton: {
        opacity: 0.1,
    },
});

export { communityScreenStyles, ruleDetailStyles };
