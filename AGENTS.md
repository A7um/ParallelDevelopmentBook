# AGENTS.md

## Cursor Cloud specific instructions

This is a documentation-only repository (`ParallelDevelopmentBook`) containing Markdown chapters about running multiple AI coding agents in parallel.

- **No build/lint/test/run commands** — pure Markdown content, no code, no dependencies, no services.
- **No package manager or dependency manifests** — nothing to install.
- Content lives in `book/` (Introduction + ten chapters + source catalog) and `README.md`.
- The book is built with [mdBook](https://rust-lang.github.io/mdBook/) and deployed to GitHub Pages via `.github/workflows/deploy-book.yml`. To preview locally, install mdBook (`cargo install mdbook`) and run `mdbook serve`.
- **Mermaid**: fenced ` ```mermaid ` blocks in Markdown are rendered in the browser by `theme/mermaid-init.js`, which loads Mermaid from jsDelivr. Both `book.toml` and `zh/book.toml` list that script in `additional-js`.
