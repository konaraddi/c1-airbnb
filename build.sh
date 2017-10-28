# Sass ===> CSS
sass styles.scss:styles.css --sourcemap=none

# CSS ===> clean and lean CSS
purifycss styles.css index.html app.js --min --out styles.css