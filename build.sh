# Sass ===> CSS
sass styles.scss:styles.min.css --sourcemap=none

# CSS ===> clean and lean CSS
purifycss styles.min.css index.html app.js --min --out styles.min.css