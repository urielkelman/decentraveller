import { RouteProp } from '@react-navigation/native';

type WalletIdParams = {
    walletId: string;
};

export type WalletIdProps = {
    route: RouteProp<Record<string, WalletIdParams>, string>;
};
