# cfdrstudio.github.io

The cfdr studio apps summary, served by GitHub Pages at https://cfdrstudio.github.io/.

One page: a copy of https://www.cfdr.au/apps.html with its stylesheet, scripts and images. Links to
other cfdr.au pages are taken out; links to the App Store, GitHub and other sites stay.

Don't edit it by hand. The source is `cfdr-au/apps.html` in the private
`cfdrstudio/cfdr-website` repo; after each cfdr.au upload, run
`./publish-cfdr.sh mirror` there (a dry run), then `./publish-cfdr.sh mirror --go`.
