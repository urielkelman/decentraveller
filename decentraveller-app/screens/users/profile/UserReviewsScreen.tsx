import React from 'react';
import UserReviewsBox from './UserReviewsBox';
import { WalletIdProps } from './types';

const UserReviewsScreen: React.FC<WalletIdProps> = ({ route }) => {
    const { walletId } = route.params;

    return <UserReviewsBox walletId={walletId} />;
};

export default UserReviewsScreen;
