var baseUrl;

document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var featureSwitch = document.querySelector('#preview-feature-switch');
    var urlParts = tabs[0].url.split("/");
    baseUrl = urlParts[0] + "//" + urlParts[2];
    chrome.storage.sync.get({ previewUrls: [] }, function(data) {
      if (data.previewUrls.indexOf(baseUrl) > -1) {
        document.getElementById('preview-feature-switch').parentElement.MaterialSwitch.on();
      } else {
        document.getElementById('preview-feature-switch').parentElement.MaterialSwitch.off();
      }

      document.querySelector('#preview-feature-switch').addEventListener('change', changeHandler);
    });
  });
});

function changeHandler() {
  if (this.checked){
    chrome.storage.sync.get({ previewUrls: [] }, function (items) {
      items.previewUrls.push(baseUrl);
      chrome.storage.sync.set({ previewUrls: items.previewUrls });
    });
    chrome.browserAction.setIcon({path: "assets/img/icon.png"});
    chrome.runtime.sendMessage({type: 'add', url: baseUrl});
  } else {
    chrome.storage.sync.get({ previewUrls: [] }, function (items) {
      var i = items.previewUrls.indexOf(baseUrl);
      items.previewUrls.splice(i, 1);
      chrome.storage.sync.set({ previewUrls: items.previewUrls });
    });
    chrome.browserAction.setIcon({path: "assets/img/icon_disabled.png"});
    chrome.runtime.sendMessage({type: 'remove', url: baseUrl});
   }
}
