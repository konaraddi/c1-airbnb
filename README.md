# Capital One Challenge (Winter Summit 2017)
##### Omkar Konaraddi

Built with:
* HTML, CSS, Sass, JavaScript
* [Bulma 0.6.0](https://bulma.io/) for making things look presentable
* [PapaParse 4.3.6](http://papaparse.com/) for CSV data processing
* [Chartsjs 2.4.0](http://www.chartjs.org/) for data visualization
* [Vivekn Sentiment Analysis API](http://sentiment.vivekn.com/docs/api/) for determining sentiments of reviews

## Objectives Completed
3/3 main objectives completed. 2/3 of bonus objectives completed.

### Main Objectives
- [X] **Visualize the data**: Graph some (any 3) interesting metrics, maps, or trends from the dataset.
- [X] **Price estimation**: Given the geo-location (latitude and longitude) of a new property, estimate the weekly average income the homeowner can make with Airbnb.
- [X] **Bookings optimization**: Given the geo-location (latitude and longitude) of a property, what is the ideal price per night that will yield maximum bookings.

### Bonus Objectives
- [X] **Animate**: Add an animation to your visualization.
- [ ] **Investment**: If I have $100 million to invest, where in San Francisco should I buy properties so I can maximize my returns with Airbnb? When will I break even?
- [X] **Popularity**: Can you identify the neighborhood that averages the most positive reviews?

## How objectives were completed
> **Visualize the data**: Graph some (any 3) interesting metrics, maps, or trends from the dataset.

> **Price estimation**: Given the geo-location (latitude and longitude) of a new property, estimate the weekly average income the homeowner can make with Airbnb.

> **Bookings optimization**: Given the geo-location (latitude and longitude) of a property, what is the ideal price per night that will yield maximum bookings.

> **Animate**: Add an animation to your visualization.

> **Popularity**: Can you identify the neighborhood that averages the most positive reviews?

## FAQs

#### Why did you only sample 5% of the reviews to determine the neighborhoods averaging the most positive reviews?

The limiting factor was the Vivekn Sentiment Analysis API. It's a free, public API that drops requests if a user makes too many requests. I made too requests :(

#### What's the [`build.sh`](build.sh) and [`serve.sh`](serve.sh) for?

The `build.sh` is for converting Sass to CSS and then removing unused CSS and unnecessary white space.

The `serve.sh` is for whipping up a web server to test on.

## If I had to do this again....

**What I did:** I worked on the building the functionality and design at the same time. As a result, I ended up iterating through several designs multiple times as I built the functionality. In other words, working on multiple things at once.

**What I should've done:** First focus on the functionality, then plan the layout and design, and then made it look fancy. Probably would've taken less time.

