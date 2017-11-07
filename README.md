# Capital One Challenge (Winter Summit 2017)
#### built by Omkar Konaraddi

https://www.mindsumo.com/contests/airbnb-sf

# Table of Contents
* [Built with...](#built-with)
* [Objectives](#objectives)
    * [Main Objectives](#main-objectives)
    * [Bonus Objectives](#bonus-objectives)
* [How Objectives Were Completed](#how-objectives-were-completed)
* [FAQs](#faqs)
* [Getting Started](#getting-started)

# Built With...
* HTML, CSS, Sass, JavaScript, Python
* [Bulma 0.6.0](https://bulma.io/) for making things look presentable
* [PapaParse 4.3.6](http://papaparse.com/) for CSV data processing
* [Chartsjs 2.4.0](http://www.chartjs.org/) for data visualization
* [Vivekn Sentiment Analysis API](http://sentiment.vivekn.com/docs/api/) for determining sentiments of reviews
* [Vuejs](https://vuejs.org/) for keeping things DRY

# Objectives 

### Main Objectives
- [X] **Visualize the data**: Graph some (any 3) interesting metrics, maps, or trends from the dataset.
- [X] **Price estimation**: Given the geo-location (latitude and longitude) of a new property, estimate the weekly average income the homeowner can make with Airbnb.
- [X] **Bookings optimization**: Given the geo-location (latitude and longitude) of a property, what is the ideal price per night that will yield maximum bookings.

### Bonus Objectives
- [X] **Animate**: Add an animation to your visualization.
- [ ] **Investment**: If I have $100 million to invest, where in San Francisco should I buy properties so I can maximize my returns with Airbnb? When will I break even?
- [X] **Popularity**: Can you identify the neighborhood that averages the most positive reviews?

# How objectives were completed

### **Visualize the data**: Graph some (any 3) interesting metrics, maps, or trends from the dataset.
Created 3 graphs with Chartsjs:
* Avg. # of Reviews Per Host vs Year Since Host
    * The longer a host has been a host, the more reviews they tend to have.
* Review Score Rating vs Square Feet
    * Bigger places doesn't necessarily mean better ratings
* Price vs Bedrooms
    * More bedrooms doesn't always mean high prices. In fact, most hosts have a 0-3 bedrooms on their property.

### **Price estimation**: Given the geo-location (latitude and longitude) of a new property, estimate the weekly average income the homeowner can make with Airbnb.
Look for places that are within 0.01 of the user's property's latitude and longitude, then took the average of the places' prices. Multiply by 7 to get estimated weekly income.

### **Bookings optimization**: Given the geo-location (latitude and longitude) of a property, what is the ideal price per night that will yield maximum bookings.
Look for places that are within 0.01 of the user's property's latitude and longitude, then took the average of the places' prices.

### **Animate**: Add an animation to your visualization.
This web app has an initial loading bar and a notification that fades in and out when there's an error related to the location service. Hovering on two of the graphs reveals stats.

### **Popularity**: Can you identify the neighborhood that averages the most positive reviews?
Used the [Vivekn Sentiment Analysis API](http://sentiment.vivekn.com/docs/api/) to determine if a review was positive and its confidence level. For each neighborhood, the Vivekn's results' confidence level for each reivew was summed up, then the divided by the total number of reviews in the corresponding neighborhood. Then they were sorted from greatest to least. This yields a list of neighborhoods averaging the most positive reviews. You can checkout the full list [here](top.txt).

# FAQs

#### What font are you using?

[Inter UI](https://rsms.me/inter/), you should check it out!

#### What's the `sentiment_analysis.py` for?

For accomplishing the **Popular Neighborhoods** objective, where neighborhoods averaging the most positive reviews were discovered and then copied to the web app. It was ran once; it does not run every time the user visits the web app. In fact, it took ~40 minutes for `sentiment_analysis.py` to run, and it only went over 5% of all available reviews because it takes time for the Vivekn Sentiment Analysis API to process requests made to it.

#### Why did you only sample 5% of the reviews to determine the neighborhoods averaging the most positive reviews?

The limiting factor was the Vivekn Sentiment Analysis API. It's a free, public API that drops requests if a user makes too many requests. I made too requests :(

#### What's the [`build.sh`](build.sh) and [`serve.sh`](serve.sh) for?

The `build.sh` is for converting Sass to CSS and then removing unused CSS and unnecessary white space.

The `serve.sh` is for whipping up a web server to test on.

#### Why is your "Getting Started" below the "FAQs"?

Because I don't expect many people to use this project in their own projects. It's really there for me to know what's up if I come back to this project.

# Getting Started

* Run `npm install` to install the necessary dependencies
* `npm start` will whip up a non-caching development server to test
* `npm run build` will convert Sass to CSS and compress the CSS
* Checkout the [package.json](package.json) file to edit these commands