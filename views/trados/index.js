// Function to replace the favicon with RWS favicons
function replaceFavicons() {
  // Remove existing favicon links
  const existingFavicons = document.querySelectorAll('link[rel*="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
  existingFavicons.forEach(favicon => favicon.remove());

  // Add new favicon links
  //const iconBaseUrl = "https://www.rws.com";
  // Alternative: use extension's local files
  const iconBaseUrl = chrome.runtime.getURL("views/trados/icons");

  // Create manifest link
  const manifestLink = document.createElement("link");
  manifestLink.rel = "manifest";
  manifestLink.href = `${iconBaseUrl}/manifest_rws.json`;
  document.head.appendChild(manifestLink);

  // Create shortcut icon
  const shortcutIcon = document.createElement("link");
  shortcutIcon.rel = "shortcut icon";
  shortcutIcon.sizes = "16x16 32x32 48x48";
  shortcutIcon.href = `${iconBaseUrl}/favicon_rws.ico`;
  shortcutIcon.type = "image/x-icon";
  document.head.appendChild(shortcutIcon);

  // Create PNG icon
  const pngIcon = document.createElement("link");
  pngIcon.rel = "icon";
  pngIcon.type = "image/png";
  pngIcon.sizes = "96x96";
  pngIcon.href = `${iconBaseUrl}/favicon-96x96_rws.png`;
  document.head.appendChild(pngIcon);

  // Create Apple touch icon
  const appleIcon = document.createElement("link");
  appleIcon.rel = "apple-touch-icon";
  appleIcon.type = "image/png";
  appleIcon.sizes = "180x180";
  appleIcon.href = `${iconBaseUrl}/apple-touch-icon_rws.png`;
  document.head.appendChild(appleIcon);

  // Create SVG icon
  const svgIcon = document.createElement("link");
  svgIcon.rel = "icon";
  svgIcon.type = "image/svg+xml";
  svgIcon.sizes = "any";
  svgIcon.href = `${iconBaseUrl}/favicon_rws.svg`;
  document.head.appendChild(svgIcon);
}

// Run the function when the page loads
window.addEventListener("load", replaceFavicons);

// // Also run it immediately in case the page has already loaded
replaceFavicons();

// // Set up a mutation observer to handle dynamic changes to the head
// const observer = new MutationObserver(mutations => {
//   for (const mutation of mutations) {
//     if (mutation.type === "childList") {
//       // If a favicon was added, replace all favicons again
//       for (const node of mutation.addedNodes) {
//         if (node.tagName === "LINK" && (node.rel === "icon" || node.rel === "shortcut icon" || node.rel === "apple-touch-icon")) {
//           replaceFavicons();
//           break;
//         }
//       }
//     }
//   }
// });

// // Start observing the document head for added/removed nodes
// observer.observe(document.head, { childList: true, subtree: true });
