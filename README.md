# Tom Ebert

[![CRT-Monogramm TE](site/assets/images/crt-monogram.png)](https://tomebert.de/)

[tomebert.de](https://tomebert.de/)

## Site layout

- `site/index.html` contains the bilingual page.
- `site/favicon.ico` and `site/robots.txt` live at the published root.
- `site/assets/css/`, `site/assets/js/`, and `site/assets/images/` contain the linked assets.
- `.github/workflows/` validates the site and publishes production and packages PR previews.


## Deployment and previews

GitHub Pages publishes a validated snapshot of `main`. PR previews are downloadable
`site-preview` artifacts in the **Package PR preview** run. Extract the archive and
serve its directory with `python3 -m http.server 8000` to review it locally.

The production HTML carries a Content Security Policy and `noindex`. Maintain HTTP
response-header policies at the hosting layer. Public contact details are visible to
browsers and should be treated as public by mail filtering.
