document.body.addEventListener("contextmenu", e => {
  e.stopPropagation();
  e.preventDefault();

  const displayMode = localStorage.getItem('displayMode');

  console.info('displayMode', displayMode);
  const menu = getContextMenu([
    {
      text: (displayMode === 'distraction-free-mode' ? "✅" : "🔲") + " Distraction free mode",
      handler: () => {
        if (displayMode === 'fullscreen-mode') {
          document.body.classList.remove('fullscreen-mode')
        }
        toggle("distraction-free-mode")
      }
    },
    {
      text: (displayMode === 'fullscreen-mode' ? "✅" : "🔲") + " Fullscreen mode",
      handler: () => {
        if (displayMode === 'distraction-free-mode') {
          document.body.classList.remove('distraction-free-mode')
        }
        toggle("fullscreen-mode")
      }
    }

  ]);
  showByCursor(menu, e);
});

const toggle = (cls) => {
  if (cls) {
    const toggle = document.body.classList.toggle(cls);
    localStorage.setItem('displayMode', toggle ? cls : '')
  }
}

(() => {
    const displayMode = localStorage.getItem('displayMode');
    toggle(displayMode)
}
)();
