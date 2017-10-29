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
- ~~[ ] **Investment**: If I have $100 million to invest, where in San Francisco should I buy properties so I can maximize my returns with Airbnb? When will I break even?~~
- [X] **Popularity**: Can you identify the neighborhood that averages the most positive reviews?

## How objectives were completed
> **Visualize the data**: Graph some (any 3) interesting metrics, maps, or trends from the dataset.

> **Price estimation**: Given the geo-location (latitude and longitude) of a new property, estimate the weekly average income the homeowner can make with Airbnb.

> **Bookings optimization**: Given the geo-location (latitude and longitude) of a property, what is the ideal price per night that will yield maximum bookings.

## FAQ
#### What's the [`build.sh`](build.sh) and [`serve.sh`](serve.sh) for?

The `build.sh` is for converting Sass to CSS and then removing unused CSS and unnecessary white space.

The `serve.sh` is for whipping up a web server to test on.

#### Wait, hold up, you only sampled 5% of the reviews to determine popular neighborhoods?

Short answer: Yes.

Long answer: Okay so the Vivekn Sentiment Analysis API was able to process 5-6 reviews per second. This means that going through 5% of the reviews takes 52 to 63 minutes. Now, I didn't sit around and stare at my screen for anywhere near that long since I had it run as a background process. 

I tried going through 10% of the reviews, but several requests started failing. Perhaps my code is to blame. Perhaps I used the API too much (it's a free, public API with no sign ups needed) so it started dropping my requests.
