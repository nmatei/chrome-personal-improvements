// =======================
// Norrless constant and variables
// =======================

const changeContentTarget = $("#holder_text");

// =======================
// Itegration with: [Project verses from bible.com] Extension
// =======================

// TODOs:
// - allod more styling options? (bold, italic, colors, etc, extra classes?)
// - extract it to a separate extension only for 'norrless'

const extensionName = "Project verses from bible.com";
const defaultBibleExtensionId = "fklnkmnlobkpoiifnbnemdpamheoanpj";

let lastProjectedText = "";

const shortWindowNameMapping = {
  0: "Disabled",
  1: "Window 1",
  2: "Window 2",
  3: "Both windows"
};

const windowNameMapping = {
  0: "Disable projection",
  1: "Project to window 1",
  2: "Project to window 2",
  3: "Project to both windows"
};

// =======================
// Project Text Utilities
// =======================

function getDefaultProjectTextSettings() {
  return {
    extensionId: defaultBibleExtensionId,
    displayWindow: 0 // 0 = disabled, 1 = window 1, 2 = window 2, 3 = both windows
  };
}

function getProjectTextSettings() {
  const saved = localStorage.getItem("projectTextSettings");
  if (saved) {
    const parsed = JSON.parse(saved);
    return {
      ...getDefaultProjectTextSettings(),
      ...parsed
    };
  }
  return getDefaultProjectTextSettings();
}

function saveProjectTextSettings(settings) {
  localStorage.setItem("projectTextSettings", JSON.stringify(settings));
}

function getProjectIndexes(displayWindow) {
  if (displayWindow === 1) {
    return [1];
  } else if (displayWindow === 2) {
    return [2];
  } else if (displayWindow === 3) {
    return [undefined]; // undefined projects to both windows
  }
  // 0 = disabled, don't project
  return [];
}

function onTextChanged(splitTitle) {
  const textWrapper = $("div", changeContentTarget);
  // using innerText to get only visible parts and ignore chord (eg. <span class="chord">Intro</span>)
  // TODO remove 'strong' tag and allow styling from projected text?
  const paragraphsText = $$("p", textWrapper).map(p => `<p><strong>${p.innerText}</strong></p>`);
  const text = paragraphsText.join("");

  const { extensionId, displayWindow } = getProjectTextSettings();

  const indexes = getProjectIndexes(displayWindow);

  const progress = $("#holder_slide_progress").innerText;
  const key = $("#holder_key_signature").innerText;
  let title = $("#holder_title").innerText;
  const nextLine = $("#holder_next_line div")?.innerText;

  if (splitTitle && title.includes("/")) {
    title = title.split("/")[1].trim();
  }

  // leave some space at bottom if next line exists (1.2em should be enough for one line)
  const nextLineStyle = "opacity: 0.5; position: fixed; bottom: 10px; padding: 0 0 0 0.5em;";

  const textToProject = `
    <h1 class="reference">
      ${progress ? `<span class="version">${progress}</span>` : ""}
      ${key ? `<span class="version">${key}</span>` : ""}
      ${title}
    </h1>
    <div class="singlelines bold" style="${nextLine ? "padding: 0 0 1.2em 0;" : ""}">
      ${text}
    </div>
    ${nextLine ? `<div class="singlelines nextline" style="${nextLineStyle}"><p>${nextLine}</p></div>` : ""}
  `;

  if (textToProject === lastProjectedText) {
    console.info("Norless text unchanged, not projecting");
    return;
  }

  lastProjectedText = textToProject;
  indexes.forEach(index => {
    projectText(extensionId, textToProject, false, index);
  });
}

// =======================
// Exported function
// =======================
function initEventsOnTextChanged() {
  if (window.location.pathname !== "/template/output.html") {
    return;
  }
  if (!changeContentTarget) {
    console.info("Norless text change target not found");
    return;
  }

  const splitTitle = window.location.hostname === "app-ua.norless.com";

  const observer = new MutationObserver(mutations => {
    mutations.forEach(() => {
      console.info("Norless text changed");
      onTextChanged(splitTitle);
    });
  });
  observer.observe(changeContentTarget, {
    childList: true,
    characterData: true,
    subtree: true
  });
}
