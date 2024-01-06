initEvents();

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
    }
  ]);
  showByCursor(menu, e);
}

function toggleBackgroundMode(cls) {
  if (cls) {
    const toggle = document.body.classList.toggle(cls);
    localStorage.setItem("backgroundMode", toggle ? cls : "");
  }
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
    }
  ]);
  showByCursor(menu, e);
}
