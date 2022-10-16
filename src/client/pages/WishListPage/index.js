import React from 'react' 
import Head from 'components/Head';
import WishList from 'components/WishList';
import { STATIC_DESCRIPTION } from 'conf/consts';

const WishListPage = () => 
    <div>
        <Head canonical="/favorites/" description={STATIC_DESCRIPTION}>
            Favorites
        </Head>
        <WishList />
    </div> 

export default WishListPage;