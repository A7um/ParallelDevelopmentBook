// Client-side Mermaid for fenced ```mermaid blocks (mdBook emits <pre><code class="language-mermaid">).
(function () {
    "use strict";

    var MERMAID_SRC =
        "https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js";

    function prepareBlocks() {
        var codes = Array.prototype.slice.call(
            document.querySelectorAll("pre code.language-mermaid")
        );
        var nodes = [];
        codes.forEach(function (code) {
            var pre = code.parentElement;
            if (!pre || pre.tagName !== "PRE") return;
            var div = document.createElement("div");
            div.className = "mermaid";
            div.textContent = code.textContent;
            pre.replaceWith(div);
            nodes.push(div);
        });
        return nodes;
    }

    function runMermaid(nodes) {
        if (!nodes.length || typeof mermaid === "undefined") return;
        mermaid.initialize({
            startOnLoad: false,
            theme: "neutral",
            securityLevel: "strict",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
        });
        mermaid.run({ nodes: nodes }).catch(function () {});
    }

    function boot() {
        var nodes = prepareBlocks();
        if (!nodes.length) return;

        if (typeof mermaid !== "undefined") {
            runMermaid(nodes);
            return;
        }

        var existing = document.querySelector('script[data-book-mermaid="1"]');
        if (existing) {
            existing.addEventListener("load", function () {
                runMermaid(nodes);
            });
            return;
        }

        var s = document.createElement("script");
        s.src = MERMAID_SRC;
        s.async = true;
        s.setAttribute("data-book-mermaid", "1");
        s.onload = function () {
            runMermaid(nodes);
        };
        document.head.appendChild(s);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();
