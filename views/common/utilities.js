function $(selector, parentOrText) {
  if (typeof parentOrText === "string") {
    return $$(selector).find(el => el.innerText === parentOrText);
  }
  return (parentOrText || document).querySelector(selector);
}

function $$(selector, parent) {
  return [...(parent || document).querySelectorAll(selector)];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

/**
 *
 * @param fn
 * @param delay
 * @returns {(function(): void)|*}
 */
function debounce(fn, delay) {
  let timer = null;
  return function () {
    const context = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

/**
 *
 * @param {String} selector
 * @param {Number} timeout
 * @param {Number} retryInterval
 * @returns {Promise<null | HTMLElement>}
 */
function waitElement(selector, timeout = 30000, retryInterval = 100) {
  return new Promise((resolve, reject) => {
    let el = $(selector);
    if (el) {
      resolve(el);
      return;
    }
    const endTime = Date.now() + timeout;
    const refreshIntervalId = setInterval(() => {
      el = $(selector);
      if (el) {
        clearInterval(refreshIntervalId);
        resolve(el);
      } else if (endTime < Date.now()) {
        clearInterval(refreshIntervalId);
        //reject("timeout");
        resolve(null);
      }
    }, retryInterval);
  });
}

function getInnerToClipboard(html) {
  return new Promise(resolve => {
    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(html);
    iframe.contentWindow.document.close();
    iframe.onload = function () {
      const text = iframe.contentWindow.document.body.innerText;
      resolve(text);
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 100);
    };
  });
}

function copyToClipboard(text) {
  const iframe = document.createElement("iframe");
  iframe.onload = function () {
    const doc = iframe.contentWindow.document;
    execCopy(text, doc);
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 100);
  };
  document.body.appendChild(iframe);
}

function execCopy(text, doc) {
  if (doc.queryCommandSupported && doc.queryCommandSupported("copy")) {
    const textarea = doc.createElement("textarea");
    textarea.textContent = text;
    // Prevent scrolling to bottom of page in MS Edge.
    textarea.style.position = "fixed";
    doc.body.appendChild(textarea);
    textarea.select();
    try {
      // Security exception may be thrown by some browsers.
      return doc.execCommand("copy");
    } catch (ex) {
      //<debug>
      console.warn("Copy to clipboard failed.", ex);
      //</debug>
      return false;
    } finally {
      doc.body.removeChild(textarea);
    }
  }
}

function download(text, name, type) {
  const anchor = document.createElement("a");
  anchor.className = "download-js-link";
  anchor.id = "download-html";
  anchor.innerHTML = "downloading...";
  anchor.style.display = "none";
  document.body.appendChild(anchor);

  const file = new Blob([text], { type: type });
  anchor.href = URL.createObjectURL(file);
  anchor.download = name;
  anchor.click();
  document.body.removeChild(anchor);
}

function maskElement(element) {
  element.classList.add("extension-loading-mask");
}
function unmaskElement(element) {
  element.classList.remove("extension-loading-mask");
}

if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = {};
}
