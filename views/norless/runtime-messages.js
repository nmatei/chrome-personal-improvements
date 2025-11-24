/**
 * @param {String} text
 * @param {Boolean} markdown
 * @param {Number} index
 */
async function projectText(text, markdown = false, index) {
  const settings = getProjectTextSettings();

  console.info("Sending text to Norless runtime: %o", index, { text, markdown });

  try {
    return await chrome.runtime.sendMessage(settings.extensionId, {
      action: "updateText",
      payload: {
        text,
        markdown,
        index
      }
    });
  } catch (error) {
    console.debug("Could not send message to extension (extension may not be installed or tab not open):", error.message);
    return null;
  }
}
