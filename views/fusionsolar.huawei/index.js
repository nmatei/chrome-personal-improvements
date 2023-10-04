document.body.addEventListener("contextmenu", e => {
  const content = e.target.closest(".col-content");
  if (content) {
    e.stopPropagation();
    e.preventDefault();

    const menu = getContextMenu([
      {
        text: "🔲 Fullscreen",
        itemId: "fullscreen",
        handler: target => {
          content.requestFullscreen();
        }
      }
    ]);
    showByCursor(menu, e);
  }
});
