import { StyleSheet } from 'react-native';

const addReviewCommentStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFE1E1',
        padding: 25,
    },
    commentExampleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginHorizontal: 30,
        marginLeft: -10,
    },

    imageUserExample: {
        width: 50,
        height: 50,
        borderRadius: 50,
        marginLeft: 25,
        marginTop: 20,
    },
    commentTitle: {
        fontSize: 15,
        fontFamily: 'Montserrat_700Bold',
        textAlign: 'left',
        marginRight: 10,
        marginLeft: 10,
    },
    commentSubtitle: {
        fontSize: 15,
        fontFamily: 'Montserrat_700Bold',
        textAlign: 'left',
        marginTop: 10,
        marginRight: 10,
        marginLeft: 10,
    },
    dialogText: {
        position: 'absolute',
        top: '20%',
        color: 'gray',
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    dialogContainer: {
        alignItems: 'center',
        marginLeft: -10,
    },
    inputContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 10,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 5,
        minHeight: 200,
        backgroundColor: 'white',
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: 'black',
        position: 'absolute',
        top: 10,
        left: 10,
    },
    placeholderText: {
        position: 'absolute',
        top: 10,
        left: 10,
        fontSize: 16,
        color: 'gray',
    },
    starContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
    },
});

const addReviewImagesStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFE1E1',
        padding: 25,
    },
    commentExampleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginHorizontal: -5,
    },
    circleImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleUpload: {
        width: 200,
        height: 200,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageUpload: {
        width: 180,
        height: 180,
        borderRadius: 90,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 50,
    },
    smallCircleButton: {
        position: 'absolute',
        top: -70,
        right: -60,
        width: 45,
        height: 45,
        borderRadius: 100,
        backgroundColor: '#983B46',
        justifyContent: 'center',
        alignItems: 'center',
    },
    smallCircleImage: {
        width: 24,
        height: 24,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Montserrat_700Bold',
        textAlign: 'center',
        marginRight: 10,
        marginLeft: 10,
        marginTop: 50,
    },
});

export { addReviewCommentStyles, addReviewImagesStyles };
