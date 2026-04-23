// Language switcher for ParallelDevelopmentBook.
// Injects a floating button that toggles between the English edition (served
// at the site root) and the Chinese edition (served at /zh/).
//
// We detect which edition is live by looking at the URL path, then build a
// peer URL pointing at the other edition that lands on the "same" page when
// one exists, or the index otherwise.
(function () {
    "use strict";

    var LANG_EN = "en";
    var LANG_ZH = "zh";

    // Site-url prefix from book.toml. Keep in sync with both book.toml files.
    var SITE_PREFIX = "/ParallelDevelopmentBook/";
    var ZH_SEGMENT = "zh/";

    function detectLang() {
        var path = window.location.pathname;
        // The Chinese edition lives under <SITE_PREFIX>zh/*. Anything else
        // (including plain file:// local preview) is treated as English.
        var zhIndex = path.indexOf(SITE_PREFIX + ZH_SEGMENT);
        if (zhIndex !== -1) return LANG_ZH;
        // Also support previewing from /zh/ directly (e.g., github pages subpath).
        if (path.indexOf("/" + ZH_SEGMENT) !== -1 && path.indexOf("/" + ZH_SEGMENT) < path.length - 1) {
            // Heuristic for local serving where SITE_PREFIX isn't present.
            if (path.indexOf(SITE_PREFIX) === -1) return LANG_ZH;
        }
        return LANG_EN;
    }

    function currentPageFile() {
        // Return the trailing file component, e.g. "02-break-in-period.html".
        // If we're at a directory root, return "index.html".
        var path = window.location.pathname;
        var last = path.substring(path.lastIndexOf("/") + 1);
        if (!last || last === "") return "index.html";
        return last;
    }

    function buildPeerUrl(currentLang) {
        var page = currentPageFile();
        var origin = window.location.origin;
        if (currentLang === LANG_EN) {
            // Going EN -> ZH: append zh/ under SITE_PREFIX.
            return origin + SITE_PREFIX + ZH_SEGMENT + page;
        } else {
            // Going ZH -> EN: strip the zh/ segment.
            return origin + SITE_PREFIX + page;
        }
    }

    function labelFor(currentLang) {
        return currentLang === LANG_EN ? "中文" : "English";
    }

    function injectSwitcher() {
        if (document.getElementById("language-switcher")) return;
        var current = detectLang();
        var a = document.createElement("a");
        a.id = "language-switcher";
        a.href = buildPeerUrl(current);
        a.textContent = labelFor(current);
        a.setAttribute("aria-label", "Switch language");
        a.setAttribute("title", "Switch language");
        document.body.appendChild(a);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", injectSwitcher);
    } else {
        injectSwitcher();
    }
})();
