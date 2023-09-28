import { DEFAULT_CHAIN_ID } from '../context/AppContext';

const { scheme } = require('expo');

export const WALLET_CONNECT_PROJECT_ID = '0796da7712aba2acab6735c1c6091a82';

import { IProviderMetadata } from '@walletconnect/modal-react-native';

export const providerMetadata: IProviderMetadata = {
    name: 'Decentraveller',
    description: 'Decentraveller app',
    url: 'https://walletconnect.com/',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
    redirect: {
        native: 'w3msample://',
    },
};

export const sessionParams = {
    namespaces: {
        eip155: {
            methods: ['eth_sendTransaction', 'eth_signTransaction', 'eth_sign', 'personal_sign', 'eth_signTypedData'],
            chains: [`eip155:${DEFAULT_CHAIN_ID}`],
            events: ['chainChanged', 'accountsChanged'],
            rpcMap: {
                31337: 'https://dtblockchainls.loca.lt',
            },
        },
    },
};
