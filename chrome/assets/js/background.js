var previewUrlCache = [];

chrome.storage.sync.get({ previewUrls: [] }, function (items) {
  previewUrlCache = items.previewUrls;
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == 'add') {
    if (previewUrlCache.indexOf(request.url) > -1) {
      previewUrlCache.push(request.url);
    }
  } else if (request.type == 'remove') {
    var i = previewUrlCache.indexOf(request.url);

    if (i > -1) {
      previewUrlCache.splice(i, 1);
    }
  }
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    var urlParts = details.url.split("/");
    baseUrl = urlParts[0] + "//" + urlParts[2];

    if (previewUrlCache.indexOf(baseUrl) > -1) {
      details.requestHeaders.push({
        name: 'X-Aviation-Preview',
        value: 'True'
      });
    }

    return { requestHeaders: details.requestHeaders };
  },
  {urls: ['<all_urls>']},
  [ 'blocking', 'requestHeaders']
);

var previewUrlCache = [];

chrome.storage.sync.get({ previewUrls: [] }, function (items) {
  previewUrlCache = items.previewUrls;
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == 'add') {
    previewUrlCache.push(request.url);
  } else if (request.type == 'remove') {
    var i = previewUrlCache.indexOf(request.url);
    previewUrlCache.splice(i, 1);
  }
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    var urlParts = details.url.split("/");
    baseUrl = urlParts[0] + "//" + urlParts[2];

    if (previewUrlCache.indexOf(baseUrl) > -1) {
      details.requestHeaders.push({
        name: 'X-Aviation-Preview',
        value: 'True'
      });
    }

    return { requestHeaders: details.requestHeaders };
  },
  {urls: ['<all_urls>']},
  [ 'blocking', 'requestHeaders']
);

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
      var urlParts = tabs[0].url.split("/");
      baseUrl = urlParts[0] + "//" + urlParts[2];

      if (previewUrlCache.indexOf(baseUrl) > -1) {
        chrome.browserAction.setIcon({path: "assets/img/icon.png"});
      } else {
        chrome.browserAction.setIcon({path: "assets/img/icon_disabled.png"});
      }
  });
});

chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
  var urlParts = details.url.split("/");
  baseUrl = urlParts[0] + "//" + urlParts[2];

  if (baseUrl.startsWith('about')) {
    return;
  }
  console.log(baseUrl)

  if (previewUrlCache.indexOf(baseUrl) > -1) {
    chrome.browserAction.setIcon({path: "assets/img/icon.png"});
  } else {
    chrome.browserAction.setIcon({path: "assets/img/icon_disabled.png"});
  }
});
