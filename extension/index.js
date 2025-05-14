chrome.tts.speak('I am not ready!');
var focusedRoot;
chrome.tabs.onUpdated.addListener(function(tabId) {
 chrome.automation.getTree(function(treeRoot) {
   if (treeRoot == focusedRoot)
     return;
   focusedRoot = treeRoot;
   chrome.tts.speak("Tab is: " + treeRoot.name + ' ' + treeRoot.url);

   // Your task: |treeRoot| might have Math ML in its |htmlAttributes|. Get it
   // to read out here.

   // Stretch:
   // ChromeVox Next has a set of commands rather than walkers for things like
   // nextLine, nextCharacter, etc. This will be nice to have for exploration.
 });
});
