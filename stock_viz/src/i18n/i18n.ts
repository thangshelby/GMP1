import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import homeEn from "./en/home.json";
import homeVi from "./vi/home.json";
import commonEn from "./en/common.json";
import commonVi from "./vi/common.json";
import stockchartEn from "./en/stockchart.json";
import stockchartVi from "./vi/stockchart.json";
import screenerEn from "./en/screener.json";
import screenerVi from "./vi/screener.json";
import mapsEn from "./en/maps.json";
import mapsVi from "./vi/maps.json";

// Define all resources
const resources = {
  en: {
    home: homeEn,
    common: commonEn,
    stockchart: stockchartEn,
    screener: screenerEn,
    maps: mapsEn,
  },
  vi: {
    home: homeVi,
    common: commonVi,
    stockchart: stockchartVi,
    screener: screenerVi,
    maps: mapsVi,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  ns: ["home", "common", "stockchart", "screener"],
  defaultNS: "home",
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
  },
});

export default i18n;


