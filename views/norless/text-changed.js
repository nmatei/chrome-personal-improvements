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
  const nextLine = $("#holder_next_line div")?.innerText;

  // "margin‑top" - Uses a non-breaking hyphen (Unicode U+2011)
  // "margin-top" - Uses a regular hyphen-minus (Unicode U+002D) / &#45;

  // TODO solutions to try for nextline:
  //  - margin: 1em 0 0 0; => this is not last line in screen (but has some space - acceptable for)
  //  - position: fixed; bottom: 10px; -> this may overlap with other elements (in case of many lines)

  // const nextLineStyle = "opacity: 0.5; margin: 1em 0 0 0;";
  // const nextLineStyle = "opacity: 0.5; margin-top: 1em;";
  // const nextLineStyle = "opacity: 0.5; position: fixed; bottom: 10px; z-index: -1;"; // (will be under other elements if overlapping)
  const nextLineStyle = "opacity: 0.5; position: fixed; bottom: 10px; padding: 0 0 0 0.5em;"; // (will be under other elements if overlapping)

  // leave some space at bottom if next line exists (1.2em should be enough for one line)

  indexes.forEach(index => {
    projectText(
      `
          <h1 class="reference">
            ${progress ? `<span class="version">${progress}</span>` : ""}
            ${key ? `<span class="version">${key}</span>` : ""}
            ${title}
          </h1>
          <div class="singlelines" style="${nextLine ? "padding: 0 0 1.2em 0;" : ""}">
            ${text}
          </div>
          ${nextLine ? `<div class="singlelines nextline" style="${nextLineStyle}"><p>${nextLine}</p></div>` : ""}
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
