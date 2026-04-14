document.body.addEventListener("contextmenu", e => {
  const content = e.target.closest(".bg-white");
  if (content) {
    e.stopPropagation();
    e.preventDefault();

    const menu = getContextMenu([
      {
        text: "Fullscreen",
        icon: "🔲",
        itemId: "fullscreen",
        handler: target => {
          content.requestFullscreen();
        }
      }
    ]);
    showByCursor(menu, e);
  }
});
