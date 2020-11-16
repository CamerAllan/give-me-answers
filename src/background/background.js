
// Tell content.js when the extension icon is clicked
chrome.browserAction.onClicked.addListener(function (tab) {
      chrome.tabs.sendMessage(tab.id, {text: 'icon_click'});
});