import React, { useEffect } from "react";
import Header from "../Header/index";
import Footer from "../Footer/index";
import Modal from "components/Modal";
import ProlongCart from "components/ProlongCart";
import { useSelector, useDispatch } from "react-redux";
import { clearStorage, getTime, storage } from "helper/utils";
import { actions} from "store/actions/signIn";
import { PROLONG_CART_EXPIRATION } from "api/mutation";
import { useMutation } from "@apollo/react-hooks";
import classes from "./root.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { withRouter } from "react-router-dom";
import { STORAGE_DONT_SHOW_AGAIN } from "conf/consts";
dayjs.extend(utc);
dayjs.extend(timezone);

const sw = typeof window !== "undefined" && navigator.serviceWorker;

const Root = (props) => {
  const dispatch = useDispatch();
  const isExpired = useSelector((state) => state.signin.isExpired);
  const customerData = useSelector((state) => state.signin.customerData);
  const cartToken = useSelector((state) => state.signin.cartToken);
  const cartData = useSelector((state) => state.signin.cartData);
  const [prolongExpiration] = useMutation(PROLONG_CART_EXPIRATION);
  const dontShow = useSelector(
    (state) => state.signin.dontShowCartExpiresModal
  );
  useEffect(() => {
    if (cartData && cartData.expiresAt && !dontShow) {
      getExpires(cartData.expiresAt);
    }
  }, [cartData]);
  useEffect(() => {
    if (dontShow) {
      dispatch(actions.addExpired(false));
    }
  }, [dontShow]);
  const extendCart = async () => {
    const currentDate = dayjs().utc().format("YYYY-MM-DD HH:mm:ss");
    const expDiffSeconds = dayjs(cartData.expiresAt).diff(
      dayjs(currentDate),
      "second"
    );
    const prevSeconds = expDiffSeconds >= 0 ? expDiffSeconds : 0;
    try {
      const res = await prolongExpiration({
        variables: {
          cartToken: cartToken,
          customerToken: customerData.customerToken
            ? customerData.customerToken
            : "",
          seconds: prevSeconds + 900,
          // 
        },
      });
      if (res) {
        dispatch(actions.addExpired(false));
        dispatch(
          actions.addCart({
            ...cartData,
            expiresAt: res.data.prolongCartExpiration.expiresAt,
          })
        );
        clearStorage(STORAGE_DONT_SHOW_AGAIN);
      }
    } catch (err) {
      const parseError = JSON.parse(JSON.stringify(err));
      const code = parseError.graphQLErrors[0].code;
      if (code === 31) {
	      dispatch(actions.clearCart());
        window.location.replace("/");
        dispatch(actions.addExpired(false));
      }
    }
  };
  // useEffect(() => {
  //   console.log("working ", props.location);
  //   getExpires(cartData.expiresAt);
  // }, []);
  useEffect(() => {
  	if (cartData.expiresAt) {
		  getExpires(cartData.expiresAt);
	  }
  }, [props.location]);
  useEffect(() => {
    if (sw) {
      sw.register("../../../sw.js").then(() => sw.ready);
      sw.addEventListener("message", () => {
        dispatch(actions.addExpired(false));
        clearStorage("cartData");
        clearStorage("cartToken");
        dispatch(actions.deleteCartData());
        
        clearStorage(STORAGE_DONT_SHOW_AGAIN);
      });
    }
  }, []);
  const getExpires = (expireDate) => {
    const currentDate = dayjs().utc().format("YYYY-MM-DD HH:mm:ss");
    const expDiff = dayjs(expireDate).diff(dayjs(currentDate), "minute");
    const expDiffSeconds = dayjs(expireDate).diff(dayjs(currentDate), "second");
    // console.log(expDiff,expDiffSeconds,  "expDiff");
    // console.log(currentDate, expireDate, "asdqwe");
    const dontShow = storage(STORAGE_DONT_SHOW_AGAIN);
    if (expDiff <= 10 && expDiffSeconds >= 0 && !dontShow) {
      //  TODO:: add here setinterval
      sw.register("../../../sw.js")
        .then(() => sw.ready)
        .then((worker) => {
          worker.active.postMessage(expDiffSeconds + 10);
        });
      dispatch(actions.addExpired(true));
      window.scrollTo(0, 0);
    }
  };

  return (
    <div>
      <Header />
      {props.children}
      <Footer />
      <Modal
        className={classes.dialog}
        isShown={isExpired && !dontShow}
        onClose={() => {
          dispatch(actions.addExpired(false));
        }}
      >
        <ProlongCart
          expired={cartData.expiresAt && `${getTime(cartData.expiresAt)}`}
          onClose={() => dispatch(actions.addExpired(false))}
          extend={() => extendCart()}
          dontShow={dontShow}
        />
      </Modal>
    </div>
  );
};
export default withRouter(Root);
