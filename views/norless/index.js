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
    window: 0 // 0 = disabled, 1 = window 1, 2 = window 2, 3 = both windows
  };
}

function saveProjectTextSettings(settings) {
  localStorage.setItem("projectTextSettings", JSON.stringify(settings));
}

function getCommonMenuItems(e) {
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
      text: "Project on [Project verses from bible.com]",
      rightIcon: icons.rightArrow,
      icon: "📤",
      itemId: "projectText",
      handler: async () => {
        const settings = getProjectTextSettings();

        const menu = getContextMenu(
          [
            `Select window to project to:`,
            "-",
            ...getProjectWindowsSelectionMenu(settings.window),
            "-",
            {
              text: "Configure EXTENSION_ID",
              icon: "⚙️",
              itemId: "configureExtensionId",
              handler: async () => {
                const EXTENSION_ID = await simplePrompt("Sync with EXTENSION_ID for [Project verses from bible.com]!", settings.extensionId);
                saveProjectTextSettings({
                  ...settings,
                  extensionId: EXTENSION_ID
                });
              }
            }
          ],
          true
        );

        showBy(menu, e.target);
      }
    }
  ];
}

function getProjectWindowsSelectionMenu(win) {
  const text = {
    0: "Disable projection",
    1: "Project to window 1",
    2: "Project to window 2",
    3: "Project to both windows"
  };

  async function handler(el, item) {
    const settings = getProjectTextSettings();
    saveProjectTextSettings({ ...settings, window: item.data.state });
  }

  return [0, 1, 2, 3].map(n => {
    return {
      text: text[n],
      icon: win === n ? icons.checked : icons.unchecked,
      itemId: "projectWindow" + n,
      data: {
        state: n
      },
      active: win === n,
      handler
    };
  });
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
    ...getCommonMenuItems(e)
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
    ...getCommonMenuItems(e)
  ]);
  showByCursor(menu, e);
}

initEvents();
