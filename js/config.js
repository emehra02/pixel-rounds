/* Pixel Rounds — settings you will want to change before launch. */
(function () {
  'use strict';
  const PR = (window.PR = window.PR || {});

  PR.CONFIG = {
    // Date of Case #1 (YYYY-MM-DD). Set this to your public launch day so the
    // first public case is #1 and the archive starts empty.
    launchDate: '2026-10-06',

    // Where "Report a problem" sends reports. Fill in one of these.
    // A Google Form link is easiest to manage; an email opens the player's mail app.
    reportFormUrl: '',
    reportEmail: '',

    version: '1.0.0'
  };
})();
