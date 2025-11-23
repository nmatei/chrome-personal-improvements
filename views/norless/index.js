const backgroundImgOpacity = "backgroundImgOpacity";
const pageBackgroundColor = "pageBackgroundColor";

// TODO import simple Prompt from [Project verses from bible.com]

function getProjectTextSettings() {
  const saved = localStorage.getItem("projectTextSettings");
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    extensionId: "fklnkmnlobkpoiifnbnemdpamheoanpj", // production ID
    window: "0" // 0 = disabled, 1 = window 1, 2 = window 2, 3 = both windows
  };
}

function saveProjectTextSettings(settings) {
  localStorage.setItem("projectTextSettings", JSON.stringify(settings));
}

function getCommonMenuItems() {
  const projectSettings = getProjectTextSettings();
  const isEnabled = projectSettings.window !== "0";

  return [
    {
      text: "background color",
      icon: "🎨",
      itemId: "pageBackgroundColor",
      handler: () => {
        const oldColor = getPageBackgroundColor();
        const color = prompt("set background color (eg. #82663a)", oldColor);
        setPageBackgroundColor(color);
      }
    },
    {
      text: "background opacity",
      icon: "⬛",
      itemId: "backgroundImgOpacity",
      handler: () => {
        const oldOpacity = getBackgroundImgOpacity();
        const opacity = prompt("set opacity percentage [ 0 - 100 ]", oldOpacity);
        setBackgroundImageOpacity(opacity);
        // TODO update output page in case we changed from main screen
      }
    },
    {
      text: "Project text on [Project verses from bible.com]",
      rightIcon: isEnabled ? "✅" : "☐",
      icon: "📤",
      itemId: "projectText",
      handler: async () => {
        const currentSettings = getProjectTextSettings();
        const EXTENSION_ID = await simplePrompt("Sync with EXTENSION_ID for [Project verses from bible.com]!", currentSettings.extensionId);

        let windowChoice;
        let isValid = false;
        while (!isValid) {
          windowChoice = await simplePrompt("Which window to project to? (0=none, 1=window1, 2=window2, 3=both)", currentSettings.window);
          if (["0", "1", "2", "3"].includes(windowChoice)) {
            isValid = true;
          } else {
            simpleAlert("Invalid value! Please enter 0, 1, 2, or 3");
          }
        }

        const newSettings = {
          extensionId: EXTENSION_ID,
          window: windowChoice
        };

        saveProjectTextSettings(newSettings);
      }
    }
  ];
}

function getPageBackgroundColor() {
  return localStorage.getItem(pageBackgroundColor) || "#000000";
}
function getBackgroundImgOpacity() {
  return localStorage.getItem(backgroundImgOpacity) || "0";
}

async function initEvents() {
  if (window.location.pathname === "/template/output.html") {
    document.body.addEventListener(
      "contextmenu",
      function (e) {
        // Allow native Chrome context menu (for Cast, etc.) when CTRL is pressed
        if (e.ctrlKey) {
          e.preventDefault();
          showOutputContextMenu(e);
        }
      },
      false
    );
    const backgroundMode = localStorage.getItem("backgroundMode");
    toggleBackgroundMode(backgroundMode);
    const opacity = getBackgroundImgOpacity();
    setBackgroundImageOpacity(opacity);

    const pageBackgroundColor = getPageBackgroundColor();
    setPageBackgroundColor(pageBackgroundColor);
  } else {
    const playlist = await waitElement("#playlist");
    playlist &&
      playlist.addEventListener(
        "contextmenu",
        function (e) {
          // Allow native Chrome context menu when CTRL is pressed
          if (e.ctrlKey) {
            e.preventDefault();
            showContextMenu(e);
          }
        },
        false
      );
  }
}

function showOutputContextMenu(e) {
  const backgroundMode = localStorage.getItem("backgroundMode");

  const menu = getContextMenu([
    {
      text: "background image",
      icon: backgroundMode === "background-image" ? "🔲" : "🧩",
      itemId: "background",
      handler: () => {
        toggleBackgroundMode("background-image");
      }
    },
    ...getCommonMenuItems()
  ]);
  showByCursor(menu, e);
}

function toggleBackgroundMode(cls) {
  if (cls) {
    const toggle = document.body.classList.toggle(cls);
    localStorage.setItem("backgroundMode", toggle ? cls : "");
  }
}

function setPageBackgroundColor(color) {
  localStorage.setItem(pageBackgroundColor, color);
  const root = $(":root");
  root.style.setProperty("--" + pageBackgroundColor, color);
}

function setBackgroundImageOpacity(opacity) {
  opacity = parseInt(opacity) || 0;
  if (opacity < 0) {
    opacity = 0;
  } else if (opacity > 100) {
    opacity = 100;
  }
  localStorage.setItem(backgroundImgOpacity, opacity + "");
  const root = $(":root");
  root.style.setProperty("--" + backgroundImgOpacity, opacity / 100 + "");
}

function showContextMenu(e) {
  const storeText = "this.setAttribute('data-text', JSON.stringify(Entries._collection._docs._map))";
  const menu = getContextMenu([
    {
      text: "Save Playlist as HTML",
      icon: "📩",
      itemId: "printable",
      onmouseenter: storeText,
      handler: target => {
        saveAsHTML(target);
      }
    },
    {
      text: "Copy Playlist to Clipboard",
      icon: "📋",
      itemId: "copy",
      onmouseenter: storeText,
      handler: async target => {
        await copyPlaylist(target);
      }
    },
    ...getCommonMenuItems()
  ]);
  showByCursor(menu, e);
}

initEvents();
