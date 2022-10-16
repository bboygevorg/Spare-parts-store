import React, { useMemo } from 'react'; 
import classes from './item.css';
import { useHistory } from 'react-router-dom';
import { useItem } from 'talons/Gallery/useItem';
import Button from 'components/Button/index';
import { ADD_TO_CART } from 'api/mutation';
import { useDispatch } from 'react-redux';
import { productActions } from 'store/actions/products';
import { STORES } from 'conf/consts';
import { isEmpty } from 'lodash';
import useWindowDimensions from 'talons/useWindowDimensions';
import Close from 'icons/Close';
import useTranslation from 'talons/useTranslation';
import { createMask } from 'conf/consts';
import {replaceId} from "../../../helper/replaceId";

const Item = (props) => {
    const { hit } = props;
    const dispatch = useDispatch()
    const __ = useTranslation();
    const { handleAddToCart, isSubmitting } = useItem({ item: hit, addToCartMutation: ADD_TO_CART })
    const vendorCode = useMemo(() => STORES.find(brand => brand.vendorcode === hit.vendorcode), [hit.vendorcode])
    const {width} = useWindowDimensions();
    const history = useHistory();
    const handleAddToWishList = (event, id) => {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        dispatch(productActions.toggleAddToWishList(id))
    }

    return (
        <div
            className={classes.hit}
            onClick={() => history.replace(`/product/bc${hit.vendorcode}_${createMask(replaceId(hit.objectID), 1)}`)}
        >
            <div className={classes.header}>
                    {!isEmpty(vendorCode)
                        && vendorCode.brandIcon
                        && <img className={classes.brandImg} src={require(`../../assets/images/brands/${vendorCode.brandIcon}`)} />
                    }
                    <span onClick={(event) => handleAddToWishList(event, hit.objectID)}><Close /></span>     
            </div>
            <header className={classes.hitImageContainer}>
                <img src={hit.images[0].imageURL} alt={hit.name} className={classes.hitImage} />
            </header>

            <div className={classes.hitInfoContainer}>
                <p className={classes.hitCategory}>{hit.categories && hit.categories[0]}</p>
                <h1 className={classes.name}>{hit.name}</h1>
                <p className={classes.hitDescription}>
                    {/* <Snippet attribute="description" tagName="mark" hit={hit} /> */}
                </p>

            <footer className={classes.footer}>
                <p>
                    <span className={classes.hitEm}>{`$${Number(hit.price).toFixed(2).toLocaleString()}`}</span>{' '}
                    {/* <span>{Number(hit.price).toLocaleString()}</span>{' '} */}
                </p>
                {width > 784
                    ?
                    <div className={classes.button}>
                        <Button
                            label={__("ADD TO CART")}
                            type="primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation(); 
                                handleAddToCart({});
                            }}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                    :
                    null
                }
            </footer>
            </div>
        </div>
    );
}

export default Item;