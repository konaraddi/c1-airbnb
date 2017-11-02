# Sass ===> CSS
sass styles.scss:styles.min.css --sourcemap=none

# CSS ===> clean and lean CSS
# INCLUDE --min before --out BEFORE DEPLOYING
purifycss styles.min.css index.html app.js --min --out styles.min.css

# for mustache templating 
# copy and paste output to index.html (it would be slower to use mustache's client side templating)
mustache data/popular_neighborhoods.json popular_neighborhoods_list.mustache > popular_neighborhoods_list.html