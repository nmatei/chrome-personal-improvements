const target = document.getElementById("holder_text");

function getProjectIndexes() {
  const settings = getProjectTextSettings();
  const windowValue = settings.window;

  if (windowValue === "0") {
    return []; // disabled, don't project
  } else if (windowValue === "1") {
    return [1];
  } else if (windowValue === "2") {
    return [2];
  } else if (windowValue === "3") {
    return [undefined]; // undefined projects to both windows
  }
  return [];
}

const observer = new MutationObserver(mutations => {
  mutations.forEach(m => {
    console.log("Norless text changed:", m);

    const text = target.querySelector("div")?.innerHTML;
    const indexes = getProjectIndexes();

    indexes.forEach(index => {
      projectText(`<div class="singlelines">${text}</div>`, false, index);
    });
  });
});

if (target) {
  observer.observe(target, {
    childList: true,
    characterData: true,
    subtree: true
  });
}
