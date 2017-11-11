import pandas as pd
f=pd.read_csv("listings.csv", dtype=str)
keep_col = ['id', 'listing_url', 'name', 'picture_url', 'host_since', 'neighbourhood', 'latitude', 'longitude', 'bedrooms', 'square_feet', 'price', 'number_of_reviews', 'review_scores_rating']
new_f = f[keep_col]
new_f.to_csv("listings_slim.csv", index=False)
