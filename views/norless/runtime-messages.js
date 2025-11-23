/**
 * @param {String} text
 * @param {Boolean} markdown
 * @param {Number} index
 */
function projectText(text, markdown = false, index) {
  const settings = getProjectTextSettings();

  console.info("Sending text to Norless runtime: %o", index, { text, markdown });
  return chrome.runtime.sendMessage(settings.extensionId, {
    action: "updateText",
    payload: {
      text,
      markdown,
      index
    }
  });
}
