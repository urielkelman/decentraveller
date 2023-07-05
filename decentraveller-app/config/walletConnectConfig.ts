export const WALLET_CONNECT_PROJECT_ID = '0796da7712aba2acab6735c1c6091a82';

export const clientMeta = {
    name: 'Decentraveller',
    description: 'RN dApp by WalletConnect',
    url: 'https://walletconnect.com/',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
    redirect: {
        native: 'YOUR_APP_SCHEME://',
        // universal: 'YOUR_APP_UNIVERSAL_LINK.com',
    },
};

export const sessionParams = {
    namespaces: {
        eip155: {
            methods: ['eth_sendTransaction', 'eth_signTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData'],
            chains: ['eip155:1'],
            events: ['chainChanged', 'accountsChanged'],
            rpcMap: {},
        },
    },
};
