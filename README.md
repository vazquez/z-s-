# Ze Automation

Using Gulp to automate the following:

- SCSS to CSS
- Live Reload
- Watching CSS HTML and JS files for changes
- Processing fonts
- Optimizing images
- Cleaning
- Building into dist

Commands:

`gulp`

This will run scss to css, spin up a server, and watch files for reloading on save.

`gulp images`

This will take any image, minify it, and send it to `dist/img`.

`gulp fonts`

This will move fonts to `dist/fonts` for Building.

`gulp clean`

This will delete the dist folder.

`gulp clean:dist`

This will delete the dist folder, except for the dist/img folder, since it's better
to cache so that you don't have to do it again. Takes too much time.


`gulp build`

This will `clean:dist`, and run `sass`, `images`, and `fonts`.
