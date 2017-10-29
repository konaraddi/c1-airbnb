#!/usr/bin/env python3

'''
 SENTIMENT ANALYSIS for determining the most popular neighborhoods.
 It was used once and then results were displayed statically in the HTML alone.
 It is NOT used every time the user visits the web app because it's too slow
 due to the response time of the API used.
'''

# listing_id in reviews --> id in listings --> neighborhood in listings 

# TODO find ids in reviews first then loop thru again and sum up the confidence level if positive for each id
# then find top 5 neighborhoods

import csv
import json
import requests

with open('data/csv/reviews.csv') as reviewsFile:
    csvReader = csv.reader(reviewsFile)
    steps = 0
    limit = 30

    for row in csvReader:
        payload={'txt': row[5]}
        r = requests.post('http://sentiment.vivekn.com/web/text/', data=payload )
        data = json.loads(r.text)
        print(data)
        steps+=1
        if steps > limit:
            break