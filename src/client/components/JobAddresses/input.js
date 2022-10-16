import React, { useRef } from "react";
import useTranslation from 'talons/useTranslation';

let autoComplete;
const componentForm = {
  street_number: "short_name",
  route: "long_name",
  locality: "long_name",
  postal_code: "short_name",
  administrative_area_level_1: "long_name"
};

const GOOGLE_FORMIK_FORM = {
  route: "address_1",
  locality: "city",
  postal_code: "zip",
  administrative_area_level_1: "state"
};

const API_KEY = "AIzaSyAyIIxJ2pgNJcPWoyTI77tmcNaeVoBnU54";
const url = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;

const loadScript = (url, callback) => {
    
    let script = document.createElement("script");

    script.type = "text/javascript";
    script.className = "google-script";
    if (script.readyState) {
      script.onreadystatechange = function () {
        if (
          script.readyState === "loaded" ||
          script.readyState === "complete"
        ) {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else { 
      script.onload = () => callback();
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
 
};

function handleScriptLoad(onChange, autoCompleteRef, onTouched, onError, placeholder, setError) {
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,
    { types: ["geocode"], componentRestrictions: { country: "us" } }
  );

  autoComplete.setFields(["address_component"]);
  autoComplete.addListener("place_changed", () => fillInAddress(onChange, onTouched, onError, placeholder, setError));
}

async function fillInAddress(onChange, onTouched, onError, placeholder, setError) {
  Object.values(GOOGLE_FORMIK_FORM).map((el) => onChange(el, ""));
  const place = autoComplete.getPlace();
  const streetNumberObject = place && place.address_components.find(
    (el) => el.types[0] === "street_number"
  );
  const streetNumber = streetNumberObject
    ? streetNumberObject[componentForm["street_number"]]
    : "";
  let value = "";
  let hasZip = false;
  for (const component of place.address_components) {
    const addressType = component.types[0];
    if(placeholder && addressType === "postal_code") {
      hasZip = true;
    }
    if (componentForm[addressType]) {
      const val = component[componentForm[addressType]];
      if(placeholder && addressType === "postal_code") {
        onChange(
          `${placeholder.toLowerCase()}Zip`,
          val,
          true
        );
      }
      onChange(
        GOOGLE_FORMIK_FORM[addressType],
        addressType === "route" ? `${streetNumber} ${val}`.trim() : val,
        true
      );
      value += addressType === "street_number" ? val + " " :  val + ", ",
      onTouched(
        GOOGLE_FORMIK_FORM[addressType]
      );
      onError(GOOGLE_FORMIK_FORM[addressType], "" )
    }
  }
  if(placeholder && value) {
    if(hasZip) {
      setError("");
      onChange(placeholder.toLowerCase(), value.trim().substring(0, value.trim().length - 1));
    }
    else {
      onChange(placeholder.toLowerCase(), "");
      setError("Zip code is missing.");
    }
  }
}

function SearchLocationInput(props) {
  const { classes, name, onChange, value, onBlur, onTouched, onError, placeholder, setError, onPaste } = props;
  const autoCompleteRef = useRef(null);
  const __ = useTranslation();

  const removeScript = () => {
    const googleScript = document.querySelectorAll(
      'script[src*="maps.googleapis"]'
    );
    googleScript.forEach(el => el.remove())
    window.google = null;
  }

  return (
    <div className="search-location-input">
      <input
        ref={autoCompleteRef}
        onChange={(event) => {
          onChange(name, event.target.value);
        }}
        placeholder={placeholder ? placeholder :__("Address 1")}
        value={value}
        autoComplete="false"
        className={classes}
        id={name}
        name={name}
        onBlur={(e) => { onBlur(e); removeScript() }}
        onFocus={() => loadScript(url, () => handleScriptLoad(onChange, autoCompleteRef, onTouched, onError, placeholder, setError))}
        onPaste={onPaste}
      />
    </div>
  );
}

export default SearchLocationInput;
