import pandas as pd

original_file=pd.read_csv("csv/listings.csv", dtype=str)

keep_col = ['id', 'listing_url', 'name', 'picture_url', 'host_since', 'neighbourhood', 'latitude', 'longitude', 'bedrooms', 'square_feet', 'price', 'number_of_reviews', 'review_scores_rating']

new_file = original_file[keep_col]
new_file.to_csv("csv/listings_slim.csv", index=False)
