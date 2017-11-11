// set animation duration for charts
var chartAnimationDuration = 0;

// initial progress loading bar (before the app loads this is displayed)
var progress = document.getElementById("loading-bar");
// the progress element's value is incremented
function increaseProgressBy(increment){
    var steps = 0;
    setInterval(frame, 20);
    function frame(){
        if(steps <= increment){
            progress.value += 1;
            steps++;
        }
    }
}

// grab data from CSV file, build charts from data, increment progress bar
// and initialize Vue instance of list of best properties
var data = null;
Papa.parse("./data/csv/listings_slim.csv", {
    header: true,
    download: true,
    dynamicTyping: true,
	complete: function(results) {

        data = results["data"];

        constructChart1(data);
        constructChart2(data);
        constructChart3(data);

        // increase loading bar's progress
        increaseProgressBy(25);

        // find top 10 neighborhoods
        // findMostPopularNeighborhoods(data, 10);

        best_properties = getBestProperties(data);
        console.log(best_properties)
        best_properties_list = new Vue({
            el: "#best-properties-list",
            data: {
                investment: 100000000,
                "properties":[],
                next_property: 0,
                totalCost: best_properties[0].estimated_cost
            },
            computed: {
                daysUntilBreakEven: function(){
                    var totalIncurredCost = 0;
                    var incomePerNight = 0;
                    for(var i = 0; i < best_properties.length; i++){
                        totalIncurredCost += best_properties[i].estimated_cost;
                        if(this.investment - totalIncurredCost <= 0){
                            break;
                        }    
                        console.log(incomePerNight)
                        incomePerNight += best_properties[i].price;
                    }
                    console.log(totalIncurredCost)
                    return Math.round(totalIncurredCost / incomePerNight);
                },
                canPurchaseNext: function(){
                    if(this.totalCost + best_properties[this.next_property].estimated_cost > this.investment){
                        return false;
                    }
                    return true;
                },
                disabled: function(){
                    if(!this.canPurchaseNext){
                        return true;
                    }
                    return false;
                }
            },
            methods:{
                showAnotherProperty: function(){
                    this.properties.push({
                        id: this.next_property,
                        name: best_properties[this.next_property].name,
                        price: best_properties[this.next_property].price,
                        picture_url: best_properties[this.next_property].picture_url,
                        listing_url: best_properties[this.next_property].listing_url,
                        estimated_cost: best_properties[this.next_property].estimated_cost,
                        display_cost: '$' + numberWithCommas(best_properties[this.next_property].estimated_cost)
                    });

                    this.totalCost += best_properties[this.next_property].estimated_cost;
                    
                    this.next_property++;
                },
                truncate: function(string, max){
                    if (string.length > max)
                       return string.substring(0, max)+'...';
                    else
                       return string;
                }
            },
            created: function(){
                for(i = 0; i < 3; i++){
                    if(this.canPurchaseNext){
                        this.showAnotherProperty();
                    }else{
                        break;
                    }
                }
            }
        });
        
	}
});


var popular_neighborhood_list = new Vue({
    el: '#neighborhood-list',
    data:{
        "neighborhoods":[
            {
                "name": "Daly City",
                "hashtag": "DalyCity",
                "lat": "37.688",
                "long": "122.470",
                "avg_rating": "95",
                "weekly_avg_income": "$1,414",
                "ideal_price_per_night": "$202"
            },
            {
                "name": "Mission Terrace",
                "hashtag": "MissionTerrace",
                "lat": "37.725",
                "long": "122.443",
                "avg_rating": "87",
                "weekly_avg_income": "$1,435",
                "ideal_price_per_night": "$205"
            },
            {
                "name": "The Castro",
                "hashtag": "TheCastro",
                "lat": "37.774",
                "long": "122.431",
                "avg_rating": "81",
                "weekly_avg_income": "$1,470",
                "ideal_price_per_night": "$210"
            },
            {
                "name": "Duboce Triangle",
                "hashtag": "DuboceTriangle",
                "lat": "37.768",
                "long": "122.432",
                "avg_rating": "81",
                "weekly_avg_income": "$1,484",
                "ideal_price_per_night": "$212"
            },
            {
                "name": "Fillmore District",
                "hashtag": "FillmoreDistrict",
                "lat": "37.787",
                "long": "122.437",
                "avg_rating": "81",
                "weekly_avg_income": "$1,505",
                "ideal_price_per_night": "$215"
            }
        ]   
    },
    methods:{
        setMap: function(neighborhood){
    
            var pos = {
                lat: Number(neighborhood.lat), 
                lng: -1*Number(neighborhood.long)
            };
            var map = new google.maps.Map(document.getElementById('map-'+neighborhood.hashtag), {
                zoom: 13,
                center: pos
            });
            var marker = new google.maps.Marker({
                position: pos,
                map: map
            });

        }
    }
});        

// notification banner that fades in and out at the bottom of the page when needed
var notificationMsg = document.getElementById("notification");

// min/max latitudes and longitudes
var minLat = 37.680;
var maxLat = 37.83109278506102;
var minLong = -122.51149998987212;
var maxLong = -122.36475851913093;

// will look for places within reasonable range of latitude and longitude
var withIn = 0.01;

function submitLatLongValues(){
    var userLat = document.getElementById("lat-input").value;
    var userLong = document.getElementById("long-input").value;

    // if user types in positive longitude, flip it to negative 
    // (since Airbnb data uses negative longitudinal values but some use positive, depending on whether it's from the W or E)
    if(userLong > 0){
        userLong -= 2*userLong;
    }

    // holds the indices (within the csv data) of places close to the user's property
    var closestPlaces = [];
    
    if (userLat <= maxLat && userLat >= minLat && userLong <= maxLat && userLong >= minLong){
        
        // find places near user's property
        for(var i = 0; i < data.length - 1; i++){
            if( (data[i]["latitude"] >= userLat - withIn || data[i]["latitude"] <= userLat + withIn) && 
                (data[i]["longitude"] >= userLong - withIn || data[i]["longitude"] >= userLong + withIn)){
                closestPlaces.push(i);
            }
        }

        var sum = 0;
        var dataPoints = closestPlaces.length;

        // calculate average weekly income
        for(var i = 0; i < closestPlaces.length; i++){
            // add the price per day to total sum
            sum += parseInt(data[closestPlaces[i]]["price"].substring(1,data[closestPlaces[i]]["price"].length));
        }     
        var idealPricePerNight = Math.round(sum / dataPoints);
        var weeklyAverageIncome = 7 * idealPricePerNight;
        document.getElementById("ideal-price").innerHTML = "$" + numberWithCommas(idealPricePerNight);
        document.getElementById("weekly-avg-income").innerHTML = "$" + numberWithCommas(weeklyAverageIncome);
        
    }else{
        showNotification("Sorry, the location must be in San Francisco.")
    }
}

function inputUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(inputPosition, function (event) {
            // if something goes wrong
            showNotification(event.message);
        });
    } else {
        showNotification("Geolocation is not supported by this browser.")
    }

    function inputPosition(position) {
        document.getElementById("lat-input").value = position.coords.latitude
        document.getElementById("long-input").value = position.coords.longitude;
        submitLatLongValues();
    }
}

function showNotification(msg){
    notificationMsg.innerHTML = msg;
    notificationMsg.className = "has-text-centered notification is-warning show";
    setTimeout(function(){
        notificationMsg.className = "has-text-centered notification is-warning";
    }, 4000);
}

// GRAPH
// AVERAGE NUMBER OF REVIEWS PER HOST vs HOST SINCE YEAR
function constructChart1(data){
    //avg number of reviews, will be used for y axis
    var avg_reviews = [];

    // will be used for x axis
    var years = [];
    // 2008 ---> 2017 correspond to 0 ---> 9 in array
    for(var i = 0; i < 10; i++){
        years.push(2008 + i); 
        avg_reviews.push(null);   
    }

    // Papa Parse adds an empty row to the data, hence the "data.length - 1"
    for(var j = 0; j < data.length - 1; j++){
        var year = Number(data[j]["host_since"].substring(0,4));
        for(var k = 0; k < 10; k++){
            if(year == (2008 + k)){
                var num_reviews = Number(data[j]["number_of_reviews"]);
                if(avg_reviews[k] == null){
                    avg_reviews[k]=[num_reviews,1];
                }else{
                    /* 
                    keeping track of sum and number of data points to calculate
                    the average number of reviews later
                    */
                    avg_reviews[k]=[avg_reviews[k][0]+num_reviews, avg_reviews[k][1]+1];
                }
                break;
            }
        }
    }
    
    // calculate average number of reviews per host for each year
    // where each spot in the array corresponds to the year
    for(var l = 0; l < 10; l++){
        avg_reviews[l] = Math.round(avg_reviews[l][0] / avg_reviews[l][1]);
    }

    // display a bar graph
    var ctx = document.getElementById('avg-rev-year-chart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',
    
        // The data for our dataset
        data: {
            labels: years,
            datasets: [{
                label: "Average Number of Reviews Per Host",
                backgroundColor:'rgb(34,49,63)',
                data: avg_reviews,
            }]
        },
    
        // Configuration options go here
        options: {
            legend:{
                display: false
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Average Number of Reviews Per Host'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Host Since Year X'
                    }
                }]
            },
            animation:{
                duration: chartAnimationDuration
            }, 
        }
    });

    // increase loading bar's progress
    increaseProgressBy(25);
}

// GRAPH
// REVIEW RATINGS vs SQUARE FEET
function constructChart2(data){

    var squareft_ratings = [];
    for(var i = 0; i < data.length - 1; i++){
        var x = Number(data[i]["square_feet"]);
        var y = Number(data[i]["review_scores_rating"]);

        // only consider places with more than 10 square ft and more than 0% ratings
        if(x > 10 && y > 0){
            squareft_ratings.push({x, y});
        }
    }

    //display a scatter plot
    var ctx = document.getElementById('rating-squareft-plot').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'scatter',
    
        // The data for our dataset
        data: {
            datasets: [{
                label: 'Scatter Dataset',
                fill: false,
                showLine: false,
                backgroundColor:'rgb(34,49,63)',
                data: squareft_ratings
            }]
        },
    
        // Configuration options go here
        options: {
            legend:{
                display: false
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Review Ratings Score'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Square Feet'
                    }
                }]
            },
            animation:{
                duration: chartAnimationDuration
            }       
        }
    });

    // increase loading bar's progress
    increaseProgressBy(25);
}

// GRAPH
// PRICE vs BEDROOMS
function constructChart3(data){

    // let index represent the number of bedrooms
    var bedrooms_avg_price= [];
    for(var i = 0; i < data.length - 1; i++){
        var num_of_bedrooms = Number(data[i]["bedrooms"])
        var price = Number(data[i]["price"].substring(1,data[i]["price"].length));
        if(!isNaN(price)){
            if(bedrooms_avg_price[num_of_bedrooms] == undefined){
                bedrooms_avg_price[num_of_bedrooms] = {
                    x: num_of_bedrooms,
                    y: price,
                    z: 1
                }
            }else{
                bedrooms_avg_price[num_of_bedrooms].y += price;
                bedrooms_avg_price[num_of_bedrooms].z += 1;
            }
        }
    }

    // find the average price per bedroom
    for(var j = 0; j < bedrooms_avg_price.length; j++){
        // avg = total / num
        bedrooms_avg_price[j].y = Math.round(bedrooms_avg_price[j].y / bedrooms_avg_price[j].z);
    }

    //display a scatter plot
    var ctx = document.getElementById('bedrooms-price-plot').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'scatter',
    
        // The data for our dataset
        data: {
            datasets: [{
                label: 'Scatter Dataset',
                backgroundColor: 'rgb(34,49,63)',
                borderColor: 'rgb(34,49,63)',
                fill: false,
                showLine: true,
                data: bedrooms_avg_price
            }]
        },

        // Configuration options go here
        options: {
            elements:{
                point:{
                    pointStyle: 'circle'
                }
            },
            legend:{
                display: false
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Average Price (USD)'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Number of Bedrooms'
                    },
                    ticks:{
                        max: 7
                    }
                }]
            },
            animation:{
                duration: chartAnimationDuration
            }     
        }
    });

    // increase loading bar's progress
    increaseProgressBy(25);
}

// Determine most popular neighborhoods by finding the highest averaging review ratings
function findMostPopularNeighborhoods(data, num){
    
    var neighborhoods_list = [];
    var avg_rating_per_neigh = [];

    // loop thru all listings and find all neighborhoods
    for(var i = 0; i < data.length - 1; i++){
        var neighborhood = data[i]["neighbourhood"];
        if(neighborhoods_list.indexOf(neighborhood) < 0 && neighborhood != "" && neighborhood.length < 25){
            neighborhoods_list.push(neighborhood);
            avg_rating_per_neigh.push({
                neighborhood: neighborhood,
                sum_of_scores: 0,
                number_of_properties: 0
            });
        }
    }

    // find average review score for each neighbourhood
    for(var j = 0; j < data.length - 1; j++){
        var neighborhood = data[j]["neighbourhood"];
        var index = neighborhoods_list.indexOf(neighborhood)
        if(index > -1){
            avg_rating_per_neigh[index]= {
                neighborhood: avg_rating_per_neigh[index].neighborhood,
                sum_of_scores: avg_rating_per_neigh[index].sum_of_scores + Number(data[j]["review_scores_rating"]),
                number_of_properties: avg_rating_per_neigh[index].number_of_properties + 1
            };
        }
    }

    for(var k = 0; k < avg_rating_per_neigh.length; k++){
        avg_rating_per_neigh[k]= {
            neighborhood: avg_rating_per_neigh[k].neighborhood,
            avg_rating: Math.round(avg_rating_per_neigh[k].sum_of_scores / avg_rating_per_neigh[k].number_of_properties)
        };
    }

    var top_neighborhoods = [];
    for(var l = 0; l < num; l++){
        // just set it to the first neighborhood for now
        top_neighborhoods[l] = avg_rating_per_neigh[0];

        // find top 5 neighborhoods, put them in their own array
        for(var n = 0; n < avg_rating_per_neigh.length; n++){
            if(avg_rating_per_neigh[n].avg_rating > top_neighborhoods[l].avg_rating && top_neighborhoods.indexOf(avg_rating_per_neigh[n]) < 0){
                top_neighborhoods[l] = avg_rating_per_neigh[n]
            }
        }
    }

    console.log(top_neighborhoods);
}

function getBestProperties(data){

    // median list price per sq. ft. in San Francisco
    // https://www.zillow.com/san-francisco-ca/home-values/
    var price_per_sqft = 1048;

    var best_properties = [];
    for(var i = 0; i < data.length - 1; i++){
        
        var name = data[i]["name"];
        var listing_url = data[i]["listing_url"]
        var picture_url = data[i]["picture_url"];
        var number_of_reviews = Number(data[i]["number_of_reviews"]);
        var rating = Number(data[i]["review_scores_rating"]);
        var price = Number(data[i]["price"].substring(1,data[i]["price"].length));
        var sqft = Number(data[i]["square_feet"]);

        if(name.length > 0 && picture_url.length > 0 && number_of_reviews > 0 && rating > 0 && price > 0 && sqft > 50 && listing_url.length > 0){

            var estimated_cost = sqft * price_per_sqft;
            
            best_properties.push({
                name: name,
                price: price,
                picture_url: picture_url,
                listing_url: listing_url,
                score: number_of_reviews * rating * price / estimated_cost,
                estimated_cost: estimated_cost 
            });
                
        }
    }

    // sorts the properties by highest to lowest score
    return best_properties.sort(function(a,b) {return (a.score > b.score) ? -1 : ((b.score > a.score) ? 1 : 0);} );    
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}