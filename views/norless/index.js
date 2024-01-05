initEvents();

async function initEvents() {
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
