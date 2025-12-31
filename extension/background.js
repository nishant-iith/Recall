chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "add-to-recall",
    title: "Add to Recall",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "add-to-recall" && info.selectionText) {
    // We can either open the popup or directly save. 
    // Since we need a question, let's open a window or inject a modal? 
    // Simplest approach: Save as "Draft" or just allow the popup to pick it up.
    // Actually, let's just create a draft card with the selection as the ANSWER.
    // But we need a question. 
    
    // Better UX: Open the popup window.
    // Note: You can't programmatically open the extension popup. 
    // Alternative: Open a new small window.
    
    chrome.windows.create({
      url: "popup.html",
      type: "popup",
      width: 400,
      height: 600
    });
    
    // Store selection to be picked up by popup (via storage)
    chrome.storage.local.set({ selection: info.selectionText });
  }
});
