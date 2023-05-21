import {StyleSheet} from "react-native";

const drawerStyles = StyleSheet.create({
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    profileImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 8,
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    userName: {
        fontSize: 21,
        fontWeight: 'bold',
        fontFamily: 'sans-serif-medium',
    },
    userWallet: {
        fontSize: 16,
        fontWeight: '100',
        fontFamily: 'sans-serif-light',

    },
    drawerContent: {
        flex: 1,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 1,
        backgroundColor: '#FD6868',
        borderRadius: 10,
        marginHorizontal: 8,
        marginVertical: 12,
    },
});

export {
    drawerStyles
}
