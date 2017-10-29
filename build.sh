# Sass ===> CSS
sass styles.scss:styles.min.css --sourcemap=none

# CSS ===> clean and lean CSS
# INCLUDE --min before --out BEFORE DEPLOYING
purifycss styles.min.css index.html app.js --min --out styles.min.css