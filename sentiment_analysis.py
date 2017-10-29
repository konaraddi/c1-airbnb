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

# dictionary of ids mapped to the sum of their confidence level
id_confidence = {}

with open('data/csv/reviews.csv') as reviewsFile:
    csvReader = csv.reader(reviewsFile)
    steps = 0
    limit = 20

    for row in csvReader:
        # add all unique ids to dictionary
        if row[0] not in id_confidence:
            id_confidence[row[0]] = 0

        # add confidence level for each key (in the end, it will be the sum of the confidence levels) 
        payload={'txt': row[5]}
        r = requests.post('http://sentiment.vivekn.com/web/text/', data=payload )
        response = json.loads(r.text)
        if response["result"] == "Positive":
            id_confidence[row[0]] += float(response["confidence"])     

        steps += 1
        if steps > limit:
            break  

# find the top 10 most popular neighborhoods
import operator
sorted_id_conf = sorted(id_confidence.items(), key=operator.itemgetter(1))
top10 = sorted_id_conf[-10:]
top10 = top10[::-1]
print("TOP 10", top10)

# find the neighborhood that correponds with each id and write it to a file
position = 0
file = open("top10.txt","w")
with open('data/csv/listings.csv') as listingsFile:
    csvReader = csv.reader(listingsFile)
    
    for row in csvReader:
        for pair in top10:
            listing_id = pair[0]
            # check if id matches up with a top10 id
            if row[0] == listing_id:
                # check if the neighborhood is listed
                if(row[38] != ''):
                    position+=1
                    print(position, row[38])
                    file.write(position + " " + row[38])
                    file.write(row[38])
                    break

file.close()