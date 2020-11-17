
// Tell content.js when the extension icon is clicked
chrome.browserAction.onClicked.addListener(function (tab) {
      chrome.tabs.sendMessage(tab.id, { text: 'icon_click' });
});

// Tell content.js when the url changes
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      if (changeInfo.status) {
            chrome.tabs.sendMessage(tabId, { text: 'url_update' });
      }
}
);