# Sass ===> CSS
sass styles.scss:styles.css --sourcemap=none

# CSS ===> clean and lean CSS
# INCLUDE --min before --out BEFORE DEPLOYING
purifycss styles.css index.html app.js --out styles.min.css