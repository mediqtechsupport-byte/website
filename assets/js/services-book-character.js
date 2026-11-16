/**
 * MEDIQ Services Book Explorer Bridge
 * Keeps API compatibility with services-book-carousel.js while hiding the overlay
 * canvas so the photorealistic 3D architectural VR library remains unobstructed.
 */
(function () {
  'use strict';

  var CANVAS_ID = 'srv-book-guide-canvas';

  window.__setServicesBookExplorerActive = function () {
    var canvas = document.getElementById(CANVAS_ID);
    if (canvas) {
      canvas.style.opacity = '0';
      canvas.style.display = 'none';
    }
  };

  window.__updateServicesBookExplorer = function () {};
})();
