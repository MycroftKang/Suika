import React from 'react';
import ReactDOM from 'react-dom/client';
import Test from './test';
import { } from "./firebase";
import "./i18n"
import i18next from "i18next";
import { HelmetProvider } from "react-helmet-async";
// eslint-disable-next-line no-restricted-globals
// history.pushState(null, '', window.location.href);

// const preventGoBack = () => {
//   console.log("pop");
//   const result = window.confirm("게임을 종료할까요?");
//   if (result) {
//     window.removeEventListener('popstate', preventGoBack);
//   } else {
//     // eslint-disable-next-line no-restricted-globals
//     history.pushState(null, '', window.location.href);
//   }
// };
  
// window.addEventListener('popstate', preventGoBack);

window.addEventListener('appinstalled', () => {
  gtag("event", "PWAInstalled", {})
});

function isStandalone() {
    return !!(navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;
}

// Depends on bowser but wouldn't be hard to use a
// different approach to identifying that we're running on Android
function exitsOnBack () {
  return isStandalone() && (window.navigator as any).userAgentData?.platform === 'Android';
}

function handleBackEvents() {
  
  // eslint-disable-next-line no-restricted-globals
  if (history.length < 2) {
    // eslint-disable-next-line no-restricted-globals
    history.pushState(null, '', window.location.href);
  }
  
  window.addEventListener('popstate', () => {
    //TODO: Optionally show a "Press back again to exit" tooltip
    setTimeout(() => {
      // eslint-disable-next-line no-restricted-globals
      history.pushState(null, '', window.location.href);
      //TODO: Optionally hide tooltip
    }, 2000);
  });
}

if (exitsOnBack())
  handleBackEvents();

console.log(`The orientation of the screen is: ${window.screen.orientation.type}`);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

let firstLandscape = false;

function setRotateScreenText() {
  const el = document.querySelector("#rotateScreen p");
  if (el) {
    el.textContent = i18next.t("rotate_screen.text");
  }
}

setRotateScreenText();

function handleRotation(first: boolean = false) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile && window.screen.orientation.type.startsWith('landscape')) {
    let rootDiv = document.getElementById("root");
    let screenDiv = document.getElementById("rotateScreen");
    if (rootDiv) {
      rootDiv.style.display = 'none';
    }

    if (screenDiv) {
      screenDiv.style.display = 'flex';
    }

    if (first) {
      firstLandscape = true;
    }
  }
  else if (isMobile && window.screen.orientation.type.startsWith('portrait'))
  {
    if (firstLandscape) {
      window.location.reload();
    }
    
    let rootDiv = document.getElementById("root");
    let screenDiv = document.getElementById("rotateScreen");
    if (rootDiv) {
      rootDiv.style.display = 'block';
    }

    if (screenDiv) {
      screenDiv.style.display = 'none';
    }
  }
}

handleRotation(true);

window.addEventListener("orientationchange", () => {
  console.log(`The orientation of the screen is: ${window.screen.orientation.type}`);
  handleRotation();
})

i18next.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

document.documentElement.lang = i18next.language;


root.render(
  <HelmetProvider>
    <Test />
  </HelmetProvider>
);
