import upperFirst from "lodash/upperFirst";
import toLower from "lodash/toLower";
import get from "lodash/get";
import set from "lodash/set";
import isEmpty from "lodash/isEmpty";
import getZoneCode from "./getZoneCode";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const storage = (key, value) => {
  if (!value) {
    return localStorage.getItem(key) || "";
  } else {
    localStorage.setItem(key, "");
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const clearStorage = (key) => {
  if (!key) {
    return;
  } else {
    localStorage.removeItem(key);
  }
};

export const firstUpperCase = (str) => {
  return upperFirst(toLower(str));
};

export function isPageRefreshed() {
  if(typeof window !== "undefined") {
    return window.performance && performance.navigation.type === 1;
  }
}

export function clsx(obj) {
  return Object.keys(obj)
    .map((key) => obj[key])
    .join(" ");
}

export function getPriceByZip(product) {
	if (!product.prices) {
		return product.price.toFixed(2)
	} else if (product.prices[getZoneCode()] && product.prices[getZoneCode()].price){
		return product.prices[getZoneCode()].price.toFixed(2)
	} else {
		return product.price.toFixed(2)
	}
}

export const  getParameterByName = (name, url ) => {
	name = name.replace(/[\[\]]/g, '\\$&');//eslint-disable-line
	var regex = new RegExp('[?&]' + name + '(=([^&]*)|&|$)'),//eslint-disable-line
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export const getUrlParts = (url) => {
	const urlParts = /^(?:\w+\:\/\/)?([^\/]+)([^\?]*)\??(.*)$/.exec(url);//eslint-disable-line
	
	return {
		hostName: urlParts[1],
		path: urlParts[2]
	}
}

export const getTime = (date) => {
  const expiresDate = new Date(date.replace(/-/g, "/"));
  const hour = expiresDate.getHours();
  const minute = expiresDate.getMinutes();
  return `${hour}:${minute}`;
};

export const getArrivalDate = (date) => {
  if(date) {
    if(typeof date !== "object" && date.includes('.')) {
      const parts = date.split('.')
      const arrivalDate = new Date(+parts[2], parts[1] - 1, +parts[0]);
      const day = arrivalDate.getDate()
      const weekDay = days[arrivalDate.getDay()];
      const monthIndex = arrivalDate.getMonth();
      const month = months[monthIndex]
      return `${weekDay}, ${month} ${day}`;
    }
    else {
      const day = date.getDate()
      const weekDay = days[date.getDay()];
      const monthIndex = date.getMonth();
      const month = months[monthIndex]
      return `${weekDay}, ${month} ${day}`;
     }
  }
};

const fillValues = (fields, values) => {
  const formValues = {};
  Object.keys(fields).map((item) => {
    const field = fields[item];
    if (!field.omit) {
      const value = get(values, item);
      set(formValues, `${item}`, value);
    }
  });
  return formValues;
};

export const sendForm = (
  { values, submitForm, validateForm, setFieldTouched },
  fields
) => {
  return new Promise((resolve, reject) => {
    submitForm()
      .then(validateForm)
      .then((errors) => {
        const isValid = Object.keys(errors).length === 0;
        if (isValid) {
          resolve(fillValues(fields, values));
        } else {
          Object.keys(fields).map((key) => setFieldTouched(key, true));
          reject(errors);
        }
      });
  });
};

export const getParamFromQueryString = (key, isAll) => {
  if(typeof window !== "undefined") {
    const splitted = window.location.search.split("/");
    if(splitted && (splitted.length === 3 || splitted.length === 2) && !splitted[1].includes('lang')) {
      if(splitted.length === 3) {
        return new URLSearchParams(splitted[0]).get(key) + "/" + splitted[1];
      }
    }
    else
    if (isAll) {
      return new URLSearchParams(splitted[0]).getAll(key);
    } else {
      return new URLSearchParams(splitted[0]).get(key);
    }
  }
};

export const getDeliveryTime = (day) => {
  if(day) {
    const currentDate = new Date();
    const deliveryTime = new Date(currentDate.setDate(currentDate.getDate() + day));
    const currentDay = deliveryTime.getDate();
    const currentMonthIndex = currentDate.getMonth();
    const intervalTime = new Date(deliveryTime.setDate(deliveryTime.getDate() + 2));
    const dayWithInterval = intervalTime .getDate();
    const intervalMonth = months[intervalTime.getMonth()]
    const currentMonth = months[currentMonthIndex];
    if(currentMonth === intervalMonth) {
      return `${currentMonth} ${currentDay} - ${dayWithInterval}`
    }
    else {
      return `${currentMonth} ${currentDay} - ${intervalMonth} ${dayWithInterval}`
    }
  }
}

export const separateProductTypes = items => {
  if(items.length) {
    const instants = items.filter(el => (el.deliveryOption === 0 && !el.sku.includes("service")));
    const others = items.filter(el => (el.deliveryOption !== 0 && !el.sku.includes("service")));
    const virtual = items.filter(el => el.sku.includes("service"));
    return {
      instants,
      others,
      virtual
    };
  }
}

export const emptyCache = (version) => {
  if('caches' in window){
    caches.keys().then((names) => {
      // Delete all the cache files
      names.forEach(name => {
          caches.delete(name);
      })
    });
    localStorage.setItem('version', version);
    // Makes sure the page reloads. Changes are only visible after you refresh.
    window.location.reload();
  }
}

export const isVisible = (elem) => {
  let vpH = window.innerHeight, // Viewport Height
    st = window.scrollY, // Scroll Top
    y = document.getElementById(elem)
      ? document.getElementById(elem).offsetTop
      : 0,
    headerHeight = document.getElementById("header")
      ? document.getElementById("header").offsetHeight
      : 0;
  return y <= vpH + st - headerHeight;
}

export const toTimestamp = strDate => {
  let datum = Date.parse(strDate);
  return datum/1000;
}

export const DATE_OPTIONS = { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };

export const dateWithTimeZone = (timeZone, year, month, day, hour, minute, second) => {
  let date = new Date(Date.UTC(year, month, day, hour, minute, second));

  let utcDate = new Date(date.toLocaleString('en-US', { timeZone: "UTC" }));
  let tzDate = new Date(date.toLocaleString('en-US', { timeZone: timeZone }));
  let offset = utcDate.getTime() - tzDate.getTime();

  date.setTime( date.getTime() + offset );

  return date;
}

export const deleteWord = (str, searchTerm) => {
  let n = str.search(searchTerm);
  while (str.search(searchTerm) > -1) {
    n = str.search(searchTerm);
    str = str.substring(0, n) + str.substring(n + searchTerm.length, str.length);
  }
  return str;
}

export const isToday = date => {
  if(date) {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear().toString();
      if(date === `${day < 10 ? `0${day}` : day}.${month < 10 ? `0${month}` : month}.${year}`) {
          return true
      }
      else {
          return false;
      }
  }
}

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const numericSort = (myArrayObjects) => {
  return myArrayObjects.sort(function(a, b) {
    return a.label.localeCompare(b.label, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  });
}

export const pageTitle = (product) => {
  if(!isEmpty(product) && product.name) {
    let str = "";
    const splitted = product.category.split("|");
    const category = splitted.length ? splitted[splitted.length - 1] : "";
    if(product.brand) {
      str = `${product.brand} ${deleteWord(product.name, product.brand).replace(/^(.{50}[^\s]*).*/, "$1").trim()} | ${category || ""} | The BuildClub`;
    }
    else {
      str = `${product.name.replace(/^(.{50}[^\s]*).*/, "$1").trim()} | ${category || ""} | The BuildClub`;
    }
    return str;
  }
};

export const bytesForHuman = (bytes) => {
  let units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let i = 0
  for (i; bytes > 1024; i++) {
    bytes /= 1024;
  }
  return bytes.toFixed(1) + ' ' + units[i];
}

export const parameterizedString = (...args) => {
  const str = args[0];
  const params = args.filter((arg, index) => index !== 0);
  if (!str) return "";
  return str.replace(/%s[0-9]+/g, matchedStr => {
    const variableIndex = matchedStr.replace("%s", "") - 1;
    return params[variableIndex];
  });
}