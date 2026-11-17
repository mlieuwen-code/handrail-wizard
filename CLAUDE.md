# Handrail Wizard
Standalone phone app (GitHub Pages: https://mlieuwen-code.github.io/handrail-wizard/). One self-contained `index.html`, plus `sw.js` (offline copy), `manifest.webmanifest`, icons.
Exports the handrail builder's v3 JSON (`format: "handrail-capture"`), identical in shape to the Handrail Field Sheet's export — keep toV3/rowOut/postOut in step with it.
Rails save in localStorage (`handrailWizard.v1`) on each phone; no accounts, no server.
**Before every push run `python3 release.py`** — it stamps the version into index.html, sw.js and version.json so installed phones show "Update ready · Refresh".
