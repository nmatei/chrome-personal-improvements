/**
 * @param {String} text
 * @param {Boolean} markdown
 * @param {Number} index
 * @param {Boolean} nonBreakingHyphens
 * @return {Promise<any>}
 */
async function projectText(text, markdown = false, index, nonBreakingHyphens = false) {
  const settings = getProjectTextSettings();

  console.info("Sending text to Norless runtime: %o", index, { text, markdown });

  try {
    return await chrome.runtime.sendMessage(settings.extensionId, {
      action: "updateText",
      payload: {
        text,
        markdown,
        index,
        nonBreakingHyphens
      }
    });
  } catch (error) {
    console.debug("Could not send message to extension (extension may not be installed or tab not open):", error.message);
    return null;
  }
}
