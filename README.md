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
Identified the top 5 neighborhoods by calculating the average review rating for each neighborhood.

# FAQs

#### What font are you using?

[Inter UI](https://rsms.me/inter/), you should check it out!

#### Why is your "Getting Started" below the "FAQs"?

Because I don't expect many people to use this project in their own projects. It's really there for me to know what's up if I come back to this project.

# Getting Started

* Run `npm install` to install the necessary dependencies
* `npm start` will whip up a non-caching development server to test
* `npm run build` will convert Sass to CSS and compress the CSS
* Checkout the [package.json](package.json) file to edit these commands