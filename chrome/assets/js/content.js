chrome.storage.sync.get({ previewUrls: [] }, function (items) {
  previewUrlCache = items.previewUrls;
  baseUrl = window.location.origin;

  if (previewUrlCache.indexOf(baseUrl) > -1) {
    localStorage.setItem("aviationPreview", "true");
  } else {
    localStorage.removeItem("aviationPreview", "true");
  }
});
