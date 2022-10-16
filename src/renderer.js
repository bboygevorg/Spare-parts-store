import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import AppContainer from "./client/containers/AppContainer";
import {ApolloProvider} from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import fetch from 'node-fetch';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const client = new ApolloClient({
    uri: process.env.BACKEND_URL,
    fetch: fetch
});
const stripePromise = loadStripe(process.env.STRIPE_KEY);

module.exports = (req, store, hash) => {
    
    const content = renderToString(
        <ApolloProvider client={client}>
            <Provider store={store}>
                <Elements stripe={stripePromise}>
                    <StaticRouter location={req.path} context={{}}>
                        <AppContainer />
                    </StaticRouter>
                </Elements>
            </Provider>
        </ApolloProvider>
    );
    const helmet = Helmet.renderStatic();

    const html = `
         <html>
            <head>
                <!-- Global site tag (gtag.js) - Google Analytics -->
                <script async src="https://www.googletagmanager.com/gtag/js?id=UA-69660844-8"></script>
                <script>
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'UA-69660844-8');
                </script>
                <base href="/">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta name=“google-site-verification” content=“VMMz2mE06ZdBdQpDjkLOHo5rpe_OuhHJJkSKX9DIDFo” />
                <link href="https://fonts.googleapis.com/css?family=Teko&display=swap" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css?family=Muli&display=swap" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css?family=Oswald&display=swap" rel="stylesheet">
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
                    rel="stylesheet">
                <link rel="icon" type="image/png" href="/images/favicon.ico">
                <link rel="stylesheet" href="/css/critical.css" />
                <link rel="stylesheet" href="/css/react-carousel.css" />
                <link rel="canonical" href="https://buildclub.com/" />
                ${helmet.title.toString()}
                ${helmet.meta.toString()}
                ${helmet.link.toString()}
                <!-- Google Tag Manager -->
                <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-KMTZBRX');</script>
                <!-- End Google Tag Manager -->
                <!-- Facebook Pixel Code -->
                <script>
                    !function (f, b, e, v, n, t, s) {
                        if (f.fbq) return; n = f.fbq = function () {
                            n.callMethod ?
                            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                        };
                        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
                        n.queue = []; t = b.createElement(e); t.async = !0;
                        t.src = v; s = b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t, s)
                    }(window, document, 'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '919657431898087');
                    fbq('track', 'PageView');
                </script>
                <noscript>
                    <img height="1" width="1" src="https://www.facebook.com/tr?id=919657431898087&ev=PageView
                &noscript=1" />
                </noscript>
                <!-- End Facebook Pixel Code -->
                <!-- Global site tag (gtag.js) - Google Ads: 1030715705 -->
                <script async src="https://www.googletagmanager.com/gtag/js?id=AW-1030715705"></script>
                 <script>
                 			var host = window.location.protocol + "//" + window.location.host;
        							if (host === 'https://www.buildclub.com') {
													var meta = document.createElement('meta');
													meta.setAttribute('name', 'facebook-domain-verification');
													meta.setAttribute('content', '34yfsxlhikjwf87tac9ryp7lj5apux');
													document.getElementsByTagName('head')[0].appendChild(meta);
											}
    						</script>
                <script> window.dataLayer = window.dataLayer || []; function gtag() { dataLayer.push(arguments); } gtag('js', new Date()); gtag('config', 'AW-1030715705'); </script>
                <!-- Event snippet for Purchase conversion page In your html page, add the snippet and call gtag_report_conversion when someone clicks on the chosen link or button. -->
                <script> function gtag_report_conversion(url) { var callback = function () { if (typeof (url) != 'undefined') { window.location = url; } }; gtag('event', 'conversion', { 'send_to': 'AW-1030715705/BHeWCInh--kBELnyvesD', 'value': 1.0, 'currency': 'USD', 'transaction_id': '', 'event_callback': callback }); return false; } </script>
                <script>
                    var ALGOLIA_INSIGHTS_SRC = "https://cdn.jsdelivr.net/npm/search-insights@1.8.0";

                    !function(e,a,t,n,s,i,c){e.AlgoliaAnalyticsObject=s,e[s]=e[s]||function(){
                    (e[s].queue=e[s].queue||[]).push(arguments)},i=a.createElement(t),c=a.getElementsByTagName(t)[0],
                    i.async=1,i.src=n,c.parentNode.insertBefore(i,c)
                    }(window,document,"script",ALGOLIA_INSIGHTS_SRC,"aa");
                </script>
                <!-- Google Analytics -->
                <script>
                (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

                ga('create', 'UA-69660844-8', 'auto');
                ga('send', 'pageview');
                </script>
                <!-- End Google Analytics -->
            </head>
            <body>
                <!-- Google Tag Manager (noscript) -->
                <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KMTZBRX"
                height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
                <!-- End Google Tag Manager (noscript) -->
                <div id="root">${content}</div>
                <script>
                    window.INITIAL_STATE=${JSON.stringify(store.getState())}
                </script>
                <script src="bundle.${hash}.js"></script>
                <script type="text/javascript" src="//cdn.callrail.com/companies/545594966/ac7e7d704f7e160dbeab/12/swap.js"></script>
            </body>
         </html>`;

    return html;
}