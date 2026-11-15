// Keep side-panel opening directly tied to the toolbar user gesture.
chrome.action.onClicked.addListener(tab => {
  chrome.sidePanel.open({windowId:tab.windowId})
    .catch(error=>console.error('Could not open VerbeFlow side panel:',error));
});
