import React from "react";
import classes from "./footer.css";
import AppWrapper from "ui/AppWrapper";
import Typo from "components/UI/Typo";
import useWindowDimensions from "talons/useWindowDimensions";
import { FOOTER_MENU, MOBILE_SIZE } from "conf/consts";
import Link from 'components/Link';
import useFirebaseInfo from "talons/useFirebaseInfo";
import useTranslation from 'talons/useTranslation';

const Footer = () => {
  const { width } = useWindowDimensions();
  const {phone} = useFirebaseInfo();
  const __ = useTranslation();
  const version = typeof window !== "undefined" && localStorage.getItem('version');

  return (
    <AppWrapper>
      <div className={classes.root} id="footer">
        <div className={classes.apps}>
          <Typo className={classes.footerAppLinks} variant={"p"} font={"bold"}>
            {__("CHECK OUT OUR MOBILE APPS!")}
          </Typo>
          <div className={classes.app_images}>
            <a
              href="https://apps.apple.com/us/app/buildclub-hardware-delivery/id1493952151"
              target="blank"
            >
              <img src={"/images/App Store.png"} />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=app.aimotion.buildclub"
              target="blank"
            >
              <img src={"/images/Google_Play.png"} />
            </a>
          </div>
          <Typo className={classes.footerAppLinks} variant={"p"} font={"bold"}>
            {__("CONNECT WITH US")}
          </Typo>
          <div className={classes.connectLinks}>
            <a href="http://twitter.com/buildclubapp" target="blank"><img src="/images/twitter.png" /></a>
            <a href="http://facebook.com/buildclubapp" target="blank"><img src="/images/facebook.svg" /></a>
            <a href="http://instagram.com/buildclubapp" target="blank"><img src="/images/instagram.png" /></a>
            <a href="https://www.linkedin.com/company/buildclub/about/" className={classes.linkedin} target="blank"><img src="/images/linkedin.png" /></a>
          </div>
        </div>
        {width > MOBILE_SIZE &&
          FOOTER_MENU.map((cat) => (
            <div className={classes.navigation} key={cat.title}>
              {cat.url ?
                <a href={cat.url} target="blank">
                  <Typo className={classes.footerTitleUrl} variant={"p"} font={"bold"}>
                    {__(cat.title)}
                  </Typo>
                </a>
              : 
                <Typo className={classes.footerTitles} variant={"p"} font={"bold"}>
                  {__(cat.title)}
                </Typo>
              }
              {cat.text ? <Typo as="p" variant="px" font="regular" className={classes.text}>{__(cat.text)}</Typo> : null}
              {cat.items.map((it) =>
                it.isMail ? (
                  <a href={`mailto:${it.url}`} key={it.label}>
                    <Typo className={classes.footerLinks} font={"regular"}>
                      {__(it.label)} {it.url}
                    </Typo>
                  </a>
                ) : it.isTel ? (
                  <a href={`tel:${phone}`} key={it.label}>
                    <Typo className={classes.footerLinks} font={"regular"}>
                      {__(it.label)} {phone}
                    </Typo>
                  </a>
                ) : 
                it.address ?
                  <a href={it.address} key={it.label} target="blank">
                    <Typo className={it.url === "#" ? classes.text : classes.footerLinks} font={"regular"}>
                      {__(it.label)}
                    </Typo>
                  </a>
                : (
                  <Link to={it.url} key={it.label}>
                    <Typo className={it.url === "#" ? classes.text : classes.footerLinks} font={"regular"}>
                      {__(it.label)}
                    </Typo>
                  </Link>
                )
              )}
            </div>
          ))}
      </div>
      <div className={classes.buildclub_rights}>
        <Typo variant={"p"} font={"regular"}>
          {__("Unless otherwise indicated, The BuildClub is not affiliated with, sponsored or endorsed by, nor is BuildClub an authorized reseller of any manufacturer or reseller whose products are sold on this website.")}
        </Typo>
        <Typo as="p" variant="pxs" font="regular">{__("*Free car delivery promotion is only available for orders of items that fit in a standard car seat or trunk, and may be modified or canceled at any time.")}</Typo>
        <Typo variant={"p"} font={"regular"}>
          © {__("2021 BuildClub. All rights reserved")}.
        </Typo>
      </div>
      <span className={classes.version}>{version ? `Version: ${version}` : ""}</span>
    </AppWrapper>
  );
};

export default Footer;
