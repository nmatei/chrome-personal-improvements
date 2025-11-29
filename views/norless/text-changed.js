const target = $("#holder_text");
let lastProjectedText = "";

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

  // leave some space at bottom if next line exists (1.2em should be enough for one line)
  const nextLineStyle = "opacity: 0.5; position: fixed; bottom: 10px; padding: 0 0 0 0.5em;";

  const textToProject = `
    <h1 class="reference">
      ${progress ? `<span class="version">${progress}</span>` : ""}
      ${key ? `<span class="version">${key}</span>` : ""}
      ${title}
    </h1>
    <div class="singlelines" style="${nextLine ? "padding: 0 0 1.2em 0;" : ""}">
      ${text}
    </div>
    ${nextLine ? `<div class="singlelines nextline" style="${nextLineStyle}"><p>${nextLine}</p></div>` : ""}
  `;

  if (textToProject === lastProjectedText) {
    console.info("Norless text unchanged, not projecting");
    return;
  }

  lastProjectedText = textToProject;
  indexes.forEach(index => {
    projectText(textToProject, false, index);
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
