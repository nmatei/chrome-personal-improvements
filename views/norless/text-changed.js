const target = $("#holder_text");

function getProjectIndexes() {
  const settings = getProjectTextSettings();
  const windowValue = settings.window;

  if (windowValue === 1) {
    return [1];
  } else if (windowValue === 2) {
    return [2];
  } else if (windowValue === 3) {
    return [undefined]; // undefined projects to both windows
  }
  // 0 = disabled, don't project
  return [];
}

function onTextChanged() {
  const text = $("div", target)?.innerHTML;
  const indexes = getProjectIndexes();

  const progress = $("#holder_slide_progress").innerText;
  const key = $("#holder_key_signature").innerText;
  const title = $("#holder_title").innerText;

  indexes.forEach(index => {
    projectText(
      `
          <h1 class="reference">
            ${progress ? `<span class="version">${progress}</span>` : ""}
            ${key ? `<span class="version">${key}</span>` : ""}
            ${title}
          </h1>
          <div class="singlelines">${text}</div>
        `,
      false,
      index
    );
  });
}

const observer = new MutationObserver(mutations => {
  mutations.forEach(() => {
    console.info("Norless text changed");

    onTextChanged();
  });
});

if (target) {
  observer.observe(target, {
    childList: true,
    characterData: true,
    subtree: true
  });
}
