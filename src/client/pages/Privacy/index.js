import React from "react";
import AppWrapper from "components/UI/AppWrapper";
// import Typo from "ui/Typo";
import classes from "./privacy.css";
import Typo from "components/UI/Typo/index";
import Head from "components/Head";
import useTranslation from 'talons/useTranslation';
import { STATIC_DESCRIPTION } from 'conf/consts';

const Privacy = () => {
  const __ = useTranslation();

  return (
    <div style={{ marginBottom: "-50px" }} className={classes.root}>
      <Head description={STATIC_DESCRIPTION}>Privacy</Head>
      <div className={classes.overlay}></div>
      <AppWrapper>
        {/* <AccordeonWrapper />   */}
        <Typo variant="h1" className={classes.pageTitle}>
          {__("PRIVACY POLICY")}
        </Typo>

        <div className={classes.privacyWrapper}>
          <Typo font="regular">Last updated: October 01, 2017</Typo>
          <Typo font="regular">
            {`AI Motion, Inc ("us", "we", or "our") operates The BuildClub mobile
            application (the "Service").`}
          </Typo>
          <Typo font="regular">
            This page informs you of our policies regarding the collection, use
            and disclosure of Personal Information when you use our Service.
          </Typo>
          <Typo font="regular">
            We will not use or share your information with anyone except as
            described in this Privacy Policy.
          </Typo>
          <Typo font="regular">
            We use your Personal Information for providing and improving the
            Service. By using the Service, you agree to the collection and use
            of information in accordance with this policy. Unless otherwise
            defined in this Privacy Policy, terms used in this Privacy Policy
            have the same meanings as in our Terms and Conditions.
          </Typo>
          <Typo variant="h3" className={classes.subTitle}>
            Information Collection And Use
          </Typo>
          <Typo font="regular">
            While using our Service, we may ask you to provide us with certain
            personally identifiable information that can be used to contact or
            identify you. We collect this information for the purpose of
            providing the Service, identifying and communicating with you,
            responding to your requests/inquiries, servicing your purchase
            orders, and improving our services.
          </Typo>
          <Typo variant="h3" className={classes.subTitle}>
            Log Data
          </Typo>
          <Typo font="regular">
            When you access the Service by or through a mobile device, we may
            collect certain information automatically, including, but not
            limited to, the type of mobile device you use, your mobile device
            unique ID, the IP address of your mobile device, your mobile
            operating system, the type of mobile Internet browser you use and
            other statistics (&quot;Log Data&quot;).
          </Typo>
          <Typo font="regular">
            In addition, we may use third party services such as Google
            Analytics that collect, monitor and analyze this type of information
            in order to increase our Service&apos;s functionality. These third
            party service providers have their own privacy policies addressing
            how they use such information.
          </Typo>
          <Typo variant="h3" className={classes.subTitle}>
            Cookies
          </Typo>
          <Typo font="regular">
            Cookies are files with a small amount of data, which may include an
            anonymous unique identifier. Cookies are sent to your browser from a
            web site and transferred to your device. We use cookies to collect
            information in order to improve our services for you.
          </Typo>
          <Typo font="regular">
            You can instruct your browser to refuse all cookies or to indicate
            when a cookie is being sent. The Help feature on most browsers
            provide information on how to accept cookies, disable cookies or to
            notify you when receiving a new cookie.
          </Typo>
          <Typo font="regular">
            If you do not accept cookies, you may not be able to use some
            features of our Service and we recommend that you leave them turned
            on.
          </Typo>
          <Typo variant="h3" className={classes.subTitle}>
            Service Providers
          </Typo>
          <Typo font="regular">
            We may employ third party companies and individuals to facilitate
            our Service, to provide the Service on our behalf, to perform
            Service-related services and/or to assist us in analyzing how our
            Service is used.
          </Typo>
          <Typo font="regular">
            These third parties have access to your Personal Information only to
            perform specific tasks on our behalf and are obligated not to
            disclose or use your information for any other purpose.
          </Typo>
          <Typo variant="h3" className={classes.subTitle}>
            Compliance With Laws
          </Typo>
          <Typo font="regular">
            We will disclose your Personal Information where required to do so
            by law or subpoena or if we believe that such action is necessary to
            comply with the law and the reasonable requests of law enforcement
            or to protect the security or integrity of our Service.
          </Typo>
          <Typo variant="h3" className={classes.subTitle}>
            Business Transaction
          </Typo>
          <Typo font="regular">
            If Collar.Tech, Inc is involved in a merger, acquisition or asset
            sale, your Personal Information may be transferred as a business
            asset. In such cases, we will provide notice before your Personal
            Information is transferred and/or becomes subject to a different
            Privacy Policy.
          </Typo>
          <Typo variant="h3" className={classes.subTitle}>
            Security
          </Typo>
          <Typo font="regular">
            The security of your Personal Information is important to us, and we
            strive to implement and maintain reasonable, commercially acceptable
            security procedures and practices appropriate to the nature of the
            information we store, in order to protect it from unauthorized
            access, destruction, use, modification, or disclosure.
          </Typo>
          <Typo font="regular">
            However, please be aware that no method of transmission over the
            internet, or method of electronic storage is 100% secure and we are
            unable to guarantee the absolute security of the Personal
            Information we have collected from you.
          </Typo>
          <Typo variant="h3" className={classes.subTitle}>
            International Transfer
          </Typo>
          <Typo font="regular">
            Your information, including Personal Information, may be transferred
            to — and maintained on — computers located outside of your state,
            province, country or other governmental jurisdiction where the data
            protection laws may differ than those from your jurisdiction.
          </Typo>
          <Typo font="regular">
            If you are located outside United States and choose to provide
            information to us, please note that we transfer the information,
            including Personal Information, to United States and process it
            there.
          </Typo>
          <Typo font="regular">
            Your consent to this Privacy Policy followed by your submission of
            such information represents your agreement to that transfer.
          </Typo>
          <Typo variant="h3" className={classes.subTitle}>
            Links To Other Sites
          </Typo>
          <Typo font="regular">
            Our Service may contain links to other sites that are not operated
            by us. If you click on a third party link, you will be directed to
            that third party&apos;s site. We strongly advise you to review the
            Privacy Policy of every site you visit.
          </Typo>
          <Typo font="regular">
            We have no control over, and assume no responsibility for the
            content, privacy policies or practices of any third party sites or
            services.
          </Typo>
          <Typo variant="h3" className={classes.subTitle}>
            Children&apos;s Privacy
          </Typo>
          <Typo font="regular">
            Only persons age 18 or older have permission to access our Service.
            Our Service does not address anyone under the age of 13
            (&quot;Children&quot;).
          </Typo>
          <Typo font="regular">
            We do not knowingly collect personally identifiable information from
            children under 13. If you are a parent or guardian and you learn
            that your Children have provided us with Personal Information,
            please contact us. If we become aware that we have collected
            Personal Information from a children under age 13 without
            verification of parental consent, we take steps to remove that
            information from our servers.
          </Typo>
          <Typo variant="h3" className={classes.subTitle}>
            Changes To This Privacy Policy
          </Typo>
          <Typo font="regular">
            This Privacy Policy is effective as of October 01, 2017 and will
            remain in effect except with respect to any changes in its
            provisions in the future, which will be in effect immediately after
            being posted on this page.
          </Typo>
          <Typo font="regular">
            We reserve the right to update or change our Privacy Policy at any
            time and you should check this Privacy Policy periodically. Your
            continued use of the Service after we post any modifications to the
            Privacy Policy on this page will constitute your acknowledgment of
            the modifications and your consent to abide and be bound by the
            modified Privacy Policy.
          </Typo>
          <Typo font="regular">
            If we make any material changes to this Privacy Policy, we will
            notify you either through the email address you have provided us, or
            by placing a prominent notice on our website.
          </Typo>
          <Typo font="regular">
            If you have any questions about this Privacy Policy, please contact
            us.
          </Typo>
        </div>
      </AppWrapper>
    </div>
  );
};

export default Privacy;
