const backgroundImgOpacity = "backgroundImgOpacity";

const backgroundImageOpacityItem = {
  text: "background opacity",
  icon: "⬛",
  itemId: "backgroundImgOpacity",
  handler: () => {
    const oldOpacity = getBackgroundImgOpacity();
    const opacity = prompt("set opacity percentage [ 0 - 100 ]", oldOpacity);
    setBackgroundImageOpacity(opacity);
    // TODO update output page in case we changed from main screen
  }
};

function getBackgroundImgOpacity() {
  return localStorage.getItem(backgroundImgOpacity) || "0";
}

async function initEvents() {
  if (window.location.pathname === "/template/output.html") {
    document.body.addEventListener(
      "contextmenu",
      function (e) {
        e.preventDefault();
        showOutputContextMenu(e);
      },
      false
    );
    const backgroundMode = localStorage.getItem("backgroundMode");
    toggleBackgroundMode(backgroundMode);
    const opacity = getBackgroundImgOpacity();
    setBackgroundImageOpacity(opacity);
  } else {
    const playlist = await waitElement("#playlist");
    playlist &&
      playlist.addEventListener(
        "contextmenu",
        function (e) {
          e.preventDefault();
          showContextMenu(e);
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
    backgroundImageOpacityItem
  ]);
  showByCursor(menu, e);
}

function toggleBackgroundMode(cls) {
  if (cls) {
    const toggle = document.body.classList.toggle(cls);
    localStorage.setItem("backgroundMode", toggle ? cls : "");
  }
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
    backgroundImageOpacityItem
  ]);
  showByCursor(menu, e);
}

initEvents();
