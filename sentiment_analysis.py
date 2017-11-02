#!/usr/bin/env python3

'''
 SENTIMENT ANALYSIS for determining the most popular neighborhoods.
 It utilizes the API here: http://sentiment.vivekn.com/docs/api/
 It was used once and then results were displayed statically in the HTML alone.
 It is NOT used every time the user visits the web app because it's too slow
 due to the response time of the API used.
'''

import csv
import json
import operator
import requests

# dictionary of ids mapped to the sum of their confidence level
id_confidence = {}
id_datapoints = {}

with open('data/csv/reviews.csv') as reviewsFile:
    csvReader = csv.reader(reviewsFile)
    steps = 0

    for row in csvReader:

        # sampling 5% of all reviews
        if steps % 20 == 0:
            # add all unique ids to dictionary
            if row[0] not in id_confidence:
                id_confidence[row[0]] = 0
                id_datapoints[row[0]] = 0

            # add confidence level for each key (in the end, it will be the sum of the confidence levels) 
            payload={'txt': row[5]}
            r = requests.post('http://sentiment.vivekn.com/web/text/', data=payload )
            response = json.loads(r.text)
            if response["result"] == "Positive":
                id_confidence[row[0]] += float(response["confidence"])     
                id_datapoints[row[0]] += 1

        steps += 1 

# find the most popular neighborhoods
for key in id_confidence:
    if id_datapoints[key] != 0:
        id_confidence[key] = float(id_confidence[key])/float(id_datapoints[key])
    else: 
        id_confidence[key] = 0  
sorted_id_conf = sorted(id_confidence.items(), key=operator.itemgetter(1))
top = sorted_id_conf[-len(sorted_id_conf):]
top = top[::-1]

# find the neighborhood that correponds with each id and write it to a file
position = 0
neighborhoods_recorded = []
file = open("popular_neighborhoods.txt","w")
with open('data/csv/listings.csv') as listingsFile:
    csvReader = csv.reader(listingsFile)
    
    for row in csvReader:
        for pair in top:
            # check if id matches up with a top id
            if row[0] == pair[0]:
                # check if the neigborhood is listed for corresponding id and if it already hasn't been recorded
                if(row[38] != '' and row[38] not in neighborhoods_recorded):
                    neighborhoods_recorded.append(row[38])
                    position+=1
                    line = str(position) + " " + row[0] + " " + row[38] + "\n"
                    file.write(line)
                    break

file.close()