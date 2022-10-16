import {getUrlParts} from "./helper/utils";

require("@babel/polyfill");
const PORT = process.env.PORT || 3000;
const express = require("express");
const compression = require("compression");
const path = require("path");
const proxy = require("express-http-proxy");
const config = require("./config");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const renderer = require('./renderer');
var serveStatic = require('serve-static')
const createStore = require('./createStore').default;
const { matchRoutes } = require('react-router-config');
const Routes = require('./client/routes');
const otherDataLoaders = require('./client/components/dataLoaders');
const admin = require("firebase-admin");
const { SitemapStream, streamToPromise } = require('sitemap'); 
const { Readable } = require('stream')
const cron = require('node-cron');
const fs = require('fs');
const { searchClient } = require("conf/main");
const { createXmlUrls  } = require("conf/consts");
const verify = require('googlebot-verify');
const app = express();

const createXml = async (content, sitemap, fileName) => {
  const data = await streamToPromise(Readable.from(content).pipe(sitemap));
  const decodedData = data.toString().replace("%EF%BB%BF/", '');
  fs.writeFile(fileName, decodedData, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
  });
};

cron.schedule(`20 10 * * *`, () => {
  const forceUrl = process.env.FORCE_URL;
  const sitemap = new SitemapStream({ hostname: forceUrl ? forceUrl : process.env.REACT_APP_BASE_URL });
  return fs.readFile('./sitemap.csv', function read(err, data) {
    if (err) {
        throw err;
    }
    const content = data.toString().split(/\r?\n/);
    createXml(content, sitemap, './sitemap.xml');
  });
});

// cron.schedule(`20 10 * * *`, () => {
//   const forceUrl = process.env.FORCE_URL;
//   const sitemap = new SitemapStream({ hostname: forceUrl ? forceUrl : process.env.REACT_APP_BASE_URL });
//   return fs.readFile('./index_sitemap.csv', function read(err, data) {
//     if (err) {
//         throw err;
//     }
//     const content = data.toString().split(/\r?\n/);
//     createXml(content, sitemap, './index_sitemap.xml');
//   });
// });

cron.schedule(`20 10 * * *`,  async () => {
  const forceUrl = process.env.FORCE_URL;
  const sitemap = new SitemapStream({ hostname: forceUrl ? forceUrl : process.env.REACT_APP_BASE_URL });
  const content = await createXmlUrls();
  createXml(content, sitemap, './products_index.xml');
});

cron.schedule(`30 09 * * *`, () => {
    searchClient.clearCache();
  },
  {
    scheduled: true,
    timezone: "America/Los_Angeles"
  }
);

const serviceAccount = {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
}
const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Gzip compression
app.use(compression());
app.use(morgan("tiny"));

// Express should accept requests to static files and respond from public folder
app.use(serveStatic(path.join(__dirname, `../public`), { maxAge: '1y', extensions:['css', 'js', 'map'], index: false, fallthrough: true }));

app.use(
  "/api/*",
  proxy(`${config.WP_URL}/`, {
    proxyReqPathResolver: function (req) {
      return req.originalUrl.substring(4);
    },
  })
);

app.get(`/rest/V1/price-zones/${process.env.ZONE_API_KEY}/all-zones`, proxy(`${process.env.MAGENTO_BASE_URL}/rest/V1/price-zones/${process.env.ZONE_API_KEY}/all-zones`, {
	proxyReqPathResolver: function (req) {
		return req.originalUrl;
	}
}));

app.get(`/rest/V1/price-zones/${process.env.ZONE_API_KEY}/zone/:zip`, proxy(`${process.env.MAGENTO_BASE_URL}/rest/V1/price-zones/${process.env.ZONE_API_KEY}/zone/:zip`, {
	proxyReqPathResolver: function (req) {
		return req.originalUrl;
	}
}));

app.post(`${getUrlParts(process.env.BC_PROMOTION_FORM_URL).path}`, proxy(`${process.env.BC_PROMOTION_FORM_URL}`, {
	headers: {
		'x-api-key': process.env.BC_PROMOTION_FORM_API_KEY
	},
	proxyReqPathResolver: function (req) {
		req.header('x-api-key', process.env.BC_PROMOTION_FORM_API_KEY)
		return req.originalUrl;
	}
}));

app.get('/sitemap.xml', (_, res) => {
  fs.access('sitemap.xml', fs.F_OK, (err) => {
    if (err) {
      console.error(err)
      return;
    }
    res.set('Content-Type', 'text/xml');
    res.sendFile('sitemap.xml', { root: '.' });
  })
});

// app.get('/index_sitemap.xml', (_, res) => {
//   fs.access('index_sitemap.xml', fs.F_OK, (err) => {
//     if (err) {
//       console.error(err)
//       return;
//     }
//     res.set('Content-Type', 'text/xml');
//     res.sendFile('index_sitemap.xml', { root: '.' });
//   })
// });

app.get('/products_index.xml', (_, res) => {
  fs.access('products_index.xml', fs.F_OK, (err) => {
    if (err) {
      console.error(err)
      return;
    }
    res.set('Content-Type', 'text/xml');
    res.sendFile('products_index.xml', { root: '.' });
  })
});

app.get('/robots.txt', (_, res) => {
  fs.access('robots.txt', fs.F_OK, (err) => {
    if (err) {
      console.error(err)
      return;
    }
    res.set('Content-Type', 'text');
    res.sendFile('robots.txt', { root: '.' });
  })
});

const testFolder = './public/';
// All requests should be passed to renderer, which will render react
app.get("*", (req, res) => { 
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const requestedUrl = 'https' + '://' + req.get('Host');
  const forceUrl = process.env.FORCE_URL;
  if(forceUrl && forceUrl !== requestedUrl) {
    res.redirect(`${forceUrl}${req.path}${req._parsedOriginalUrl.search || ''}`);
    return;
  }
  let param = '';
  if(req._parsedOriginalUrl.search && req._parsedOriginalUrl.search.includes("query")) {
    const params = req._parsedOriginalUrl.search.split("/");
    param = new URLSearchParams(params[1]).get('lang')
  }
  else {
    param =  new URLSearchParams(req._parsedOriginalUrl.search).get('lang');
  }
  const store = createStore();
  const matchedRoutes = matchRoutes(Routes.default, req.path);
  const promises = matchedRoutes.map(({ route }) => {
      return route.loadData ? route.loadData(store, req) : null;
  });
  otherDataLoaders.default.map(loader => { 
    if(loader.name === 'setLocaleId') {
      param = "";
      promises.push(loader(store, param));
    }
    else
    if(loader.name === 'setIsBot') {
      verify(ip, (error, isGoogle) => {
        if(error) {
          console.log('error', error);
        }
        if (isGoogle) {
          promises.push(loader(store, true));
        }
        else {
          promises.push(loader(store, false));
        }
      });
    }
    else {
      promises.push(loader(store, firebase))
    }
  });

  Promise.all(promises).then(() => {
      fs.readdir(testFolder, (err, files) => {
        files.forEach(file => {
          if(file.includes('bundle')) {
            const hash = file.split('.')[1];
            const content = renderer(req, store, hash);
            res.send(content);
          }
        });
      });
  });
});

app.listen(PORT, () => {
  console.log(`Listing to port ${PORT}`);
});
