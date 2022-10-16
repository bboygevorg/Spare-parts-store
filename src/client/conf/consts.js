import config from "../../config";
import { algoliaIndexForBrowser } from "conf/main";

export const validateRules = {
    required: "required",
    max: "max",
    min: "min",
    email: "email",
    round: "round",
    phone: "phone",
    password: "password",
};

export const storageKeys = {
    STORES: "stores",
    CATEGORIES: "categories"
}

export const ATTRIBUTES = ["name", "price", "prices", "images", "category", "model_number", "description", "features", "brand", "msku", "sku", "vendorcode", "in_stock", "is_action", "action_type", "action_icon_url", "action_info_text", "action_text", "action_additional_text", "store_sku_number", "epa_certification_required", "hvac_license_required", "url", "delivery_option", "stores", "categories", "website_product_id", "bc_categories"];

export const STORES = [
  {
    vendorcode: "8",
    label: "Safety and PPE",
    img: `${config.BASE_URL}images/stores/ppe-store.svg`,
    original: `${config.BASE_URL}images/stores/original/ppe-store.svg`,
    brandIcon: "ppe.svg",
    firebaseKey: "show_ppe_icon",
    firebaseStoreKey: "show_ppe_store"
  },
  {
    vendorcode: "0",
    label: "The Home Depot",
    img: `${config.BASE_URL}images/stores/bc-homedepot.svg`,
    original: `${config.BASE_URL}images/stores/original/the-home-depot.svg`,
    brandIcon: "the-home-depot.svg",
    firebaseKey: "show_hd_icon",
    firebaseStoreKey: "show_hd_store"
  },
  {
    vendorcode: "7",
    label: "Heating and Cooling Supply",
    img: `${config.BASE_URL}images/stores/gemaire.svg`,
    original: `${config.BASE_URL}images/stores/original/cooling-supply.png`,
    brandIcon: "gemaire.png",
    firebaseKey: "show_gm_icon",
    firebaseStoreKey: "show_gm_store"
  },
  {
    vendorcode: "1",
    label: "Ferguson",
    img: `${config.BASE_URL}images/stores/bc-ferguson.svg`,
    original: `${config.BASE_URL}images/stores/original/ferguson.svg`,
    brandIcon: "ferguson.svg",
    firebaseKey: "show_fg_icon",
    firebaseStoreKey: "show_fg_store"
  },
  {
    vendorcode: "2",
    label: "Grainger",
    img: `${config.BASE_URL}images/stores/bc-grainger.svg`,
    original: `${config.BASE_URL}images/stores/original/grainger.svg`,
    brandIcon: "grainger.svg",
    firebaseKey: "show_gr_icon",
    firebaseStoreKey: "show_gr_store"
  },
  {
    vendorcode: "3",
    label: "Walters Wholesale Electric",
    img: `${config.BASE_URL}images/stores/bc-walters.svg`,
    original: `${config.BASE_URL}images/stores/original/walters.svg`,
    brandIcon: "walters.svg",
    firebaseKey: "show_wt_icon",
    firebaseStoreKey: "show_wt_store"
  },
  {
    vendorcode: "4",
    label: "Lowe's",
    img: `${config.BASE_URL}images/stores/lowes.svg`,
    original: `${config.BASE_URL}/images/stores/original/lowes.svg`,
    brandIcon: "lowes.svg",
    firebaseKey: "show_lw_icon",
    firebaseStoreKey: "show_lw_store"
  },
  {
    vendorcode: "5",
    label: "Ace West LA",
    img: `${config.BASE_URL}images/stores/ace-west-la.svg`,
    original: `${config.BASE_URL}images/stores/original/ace-hardware.svg`,
    brandIcon: "ace-west-la.svg",
    firebaseKey: "show_ace_icon",
    firebaseStoreKey: "show_acw_store"
  },
  {
    vendorcode: "6",
    label: "Ace Culver City",
    img: `${config.BASE_URL}images/stores/ace-culver-city.svg`,
    original: `${config.BASE_URL}images/stores/original/ace-hardware.svg`,
    brandIcon: "ace-culver-city.svg",
    firebaseKey: "show_ace_icon",
    firebaseStoreKey: "show_acc_store"
  },
  {
    vendorcode: "9",
    label: "Floor and decor",
    img: `${config.BASE_URL}images/stores/floor-decor.svg`,
    original: `${config.BASE_URL}images/stores/original/floor-decor.svg`,
    brandIcon: "floor-decor.svg",
    firebaseKey: "show_fd_icon",
    firebaseStoreKey: "show_fd_store"
  }
];

export const STORE_PATHS = {
  bc0: "hd_",
  bc1: "fg_",
  bc2: "gr_",
  bc3: "wt_",
  bc4: "lw_",
  bc5: "acw_",
  bc6: "acc_",
  bc7: "gm_",
  bc8: "ppe_",
  bc9: "fl_"   
}

export const VENDORS = {
   hd : "bc0",
   fg : "bc1",
   gr : "bc2",
   wt : "bc3",
   lw : "bc4",
   acw: "bc5",
   acc: "bc6",
   gm : "bc7",
   ppe: "bc8",
   fl : "bc9",
}

export const decodeMask = (mask, count) => {
  if(!mask) {
    return "";
  }
  let newString = [];
  let newMask = ""
  newMask =  mask.replace(/-/g, ":");
  newMask = newMask.replace(/\+/g, "{");
  newMask = newMask.replace(/\*/g, "[");
  for(let i = 0; i < mask.length; i++){
      newString[i] = String.fromCharCode(newMask[i].charCodeAt() - count);
  }
  newString = newString.join('');
  return newString;
}

export const createMask = (string, count) => {
  let newString = [];
  for(let i = 0; i < string.length; i++){
      newString[i] = String.fromCharCode(string[i].charCodeAt() + count);
  }
  newString = newString.join('');
  newString = newString.replace(/:/g, "-");
  newString = newString.replace(/{/g, "+");
  newString = newString.replace(/\[/g, "*");
  return newString;
}

const buffItems = [
    {label: "8", value: "8", isRefined: false},
    {label: "0", value: "0", isRefined: false},
    {label: "7", value: "7", isRefined: false},
    {label: "2", value: "2", isRefined: false},
    {label: "1", value: "1", isRefined: false},
    {label: "3", value: "3", isRefined: false},
    {label: "4", value: "4", isRefined: false},
    {label: "5", value: "5", isRefined: false},
    {label: "6", value: "6", isRefined: false},
    {label: "9", value: "9", isRefined: false},
]

export const storesElements = buffItems.map(item => ({...item, value: item.label, label: STORES.find(el => el.vendorcode === item.label).label}))


export const TABLET_SIZE = 1240
export const MOBILE_SIZE = 784 
export const FOOTER_MENU = [
  {
    title: "CAREERS",
    url: "https://buildclub.rippling-ats.com/",
    items: [
      // {
      //   url: "#",
      //   label: "About us",
      // },
      // {
      //   url: "/product-categories",
      //   label: "Product categories",
      // },
      //   {
      //     url: "#",
      //     label: "Specials & offers",
      //   },
    ],
    text: "Join the next Silicon Valley Unicorn! We are always looking for talent."
  },
  {
    title: "POLICIES & FAQ",
    items: [
      {
        url: "/return",
        // address: "https://buildclub.com/home/return/",
        label: "Return Policy",
      },
      {
        url: "/privacy",
        // address: "https://buildclub.com/home/privacy-policy/",
        label: "Privacy Policy",
      },
      {
        url: "#",
        label: "Terms & Conditions",
      },
      {
        url: "/faq",
        // address: "https://buildclub.com/home/faq/",
        label: "FAQ",
      },
    ],
  },
  {
    title: "CUSTOMER SUPPORT",
    items: [
      // {
      //   url: "#",
      //   label: "Monday - Friday 8:30 AM to 4:30 PM",
      // },
      // {
      //   url: "#",
      //   label: "Saturday 8:30 AM to 12 PM",
      // },
      {
        url: "",
        label: "Tel: ",
        isTel: true,
      },
      {
        url: "sales@buildclub.com",
        label: "Email: ",
        isMail: true,
      },
      //   {
      //     url: "#",
      //     label: "Feedback",
      //   },
    ],
  },
];

export const errorMessage = (key="", message="") => `${key} ${message}`;

export const STATUSES = [
    // {
    //     name: "Canceled",
    //     icon: ""
    // },
    {
        name: "Pending",
        icon: "calendar.svg"
    },
    {
        name: "Pending Payment",
        icon: "price.svg"
    },
    {
        name: "Processing",
        icon: "box.svg"
    },    
    {
        name: "Out For Delivery",
        icon: "delivery.svg"
    },
    {
        name: "Delivered",
        icon: "home.svg"
    }
];

export const LANGUAGES = [
  {code: "default", name: "En", icon: "/icons/flags/usa.svg" },
  {code: "es_ES", name: "Es", icon: "/icons/flags/spain.svg" },
  {code: "ru_RU", name: "Ru", icon: "/icons/flags/russia.svg" },
  {code: "hy_AM", name: "Hy", icon: "/icons/flags/armenia.svg" },
  {code: "he_IL", name: "He", icon: "/icons/flags/hebrew.svg" },
  {code: "zh_Hans_CN", name: "Zh_CN", icon: "/icons/flags/chinese.svg" },
  {code: "zh_Hant_TW", name: "Zh_TW", icon: "/icons/flags/chinese.svg" },
  {code: "ko_KR", name: "Ko", icon: "/icons/flags/korea.svg" }
];

export const LANGUAGEKEYS = [
  {code: "default", name: 'en'},
  {code: "es_ES", name: 'es'},
  {code: "ru_RU", name: 'ru'},
  {code: "hy_AM", name: 'hy'},
  {code: "he_IL", name: 'he'},
  {code: "zh_Hans_CN", name: 'cn'},
  {code: "zh_Hant_TW", name: 'cn'},
  {code: "ko_KR", name: 'ko'}
];

export const USER_ROLES = [
  { name: "Shopper", value: 1},
  { name: "Shop admin", value: 2},
  { name: "Admin", value: 3}
];

export const ALL_ROLES = [
  { name: "Shopper", value: 1},
  { name: "Shop admin", value: 2},
  { name: "Admin", value: 3},
  { name: "Owner", value: 4 }
];

export const getProducts = async () => {
  let hits = [];
  let urls = [];
  try {
    await algoliaIndexForBrowser.browseObjects({
      query: '', // Empty query will match all records
      filters: 'bc_categories.lvl0:"building supplies" AND in_stock:true',
      attributesToRetrieve: ATTRIBUTES,
      batch: batch => {
        hits = hits.concat(batch);
      }
    })

    hits.map(el => {
      urls.push({ url: `/product/${el.website_product_id}`})
    });
  }
  catch(err) {
    console.log('err', err)
  }

  return urls;
}

export const createXmlUrls = async () => {
  const arr = await getProducts();
  return arr;
}

export const STORAGE_STEP_DATA_KEY = "stepData";
export const STORAGE_REFRESH_TOKEN = "refreshToken";
export const STORAGE_DONT_SHOW_AGAIN = "expiredNotShow";
export const SERVICE_OFF_KEY = "tmp_service_shut_down";
export const VALID_KEY = "tablerate";
export const STATIC_DESCRIPTION = "Skip the trip & get what you need delivered where & when you need it. Discover BuildClub. Shop 150,000+ items available for immediate delivery."
export const ROLES_INFO = [
  { roleName: "Shopper", text: "has limited rights. Can see company templates and place orders in the system, but the order will require approval from Admins or Shop admins."},
  { roleName: "Shop admin", text: "can see user list. Manage their shopping carts. Approve / edit or decline pending orders. Generate company based reports."},
  { roleName: "Admin", text: "has all above privileges plus full user management including inviting new users, deactivating existing users and attaching company cards to other users."}
];