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

// contains data from listings.csv
var data = null;
// grab data from CSV file and build charts from it
Papa.parse("./data/csv/listings.csv", {
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
        
	}
});

// notification banner that fades in and out at the bottom of the page when needed
var notificationMsg = document.getElementById("notification");

// min/max latitudes and longitudes
var minLat = 37.70692769290489;
var maxLat = 37.83109278506102;
var minLong = -122.51149998987212;
var maxLong = -122.36475851913093;

// will look for places within reasonable range of latitude and longitude
var withIn = 0.01;

function submitLatLongValues(userLat, userLong){
    if(userLat == undefined || userLong == undefined){
        var userLat = document.getElementById("lat-input").value;
        var userLong = document.getElementById("long-input").value;
    }
    if(document.getElementById('lat-input').value != userLat && document.getElementById('long-input').value != userLong){
        document.getElementById('lat-input').value = userLat;
        document.getElementById('long-input').value = userLong;
    }

    // if user types in positive longitude, flip it to negative 
    // (since Airbnb data uses negative longitudinal values)
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
        
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }else{
        showNotification("Sorry, the location must be in San Francisco.")
    }
}

function inputUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(inputPosition, onGeoError);
    } else {
        showNotification("Geolocation is not supported by this browser.")
    }
}

// If something has gone wrong with the geolocation request
function onGeoError(event) {
    showNotification(event.message);
}

function inputPosition(position) {
    document.getElementById("lat-input").value = position.coords.latitude
    document.getElementById("long-input").value = position.coords.longitude;
    submitLatLongValues();
}

function showNotification(msg){
    notificationMsg.innerHTML = msg;
    notificationMsg.className = "has-text-centered notification is-warning show";
    setTimeout(function(){
        notificationMsg.className = "has-text-centered notification is-warning";
    }, 5000);
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
                duration: 0
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
                duration: 0
            }       
        }
    });

    // increase loading bar's progress
    increaseProgressBy(25);
}

// GRAPH
// PRICE vs BEDROOMS
function constructChart3(data){

    var bedrooms_price= [];
    for(var i = 0; i < data.length - 1; i++){
        var x = Number(data[i]["bedrooms"])
        var y = Number(data[i]["price"].substring(1,data[i]["price"].length));
        bedrooms_price.push({x, y});
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
                showLine: false,
                data: bedrooms_price
            }]
        },

        // Configuration options go here
        options: {
            elements:{
                point:{
                    pointStyle: 'cross'
                }
            },
            legend:{
                display: false
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Price'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Bedrooms'
                    },
                    ticks:{
                        max: 7
                    }
                }]
            },
            tooltips:{
                enabled: false
            },
            animation:{
                duration: 0
            }     
        }
    });

    // increase loading bar's progress
    increaseProgressBy(25);
}

var neighborhood_list = new Vue({
    el: '#neighborhood-list',
    data:{
        "neighborhoods":[
        {
          "position": "1.",
          "name": "Mission District",
          "hashtag": "MissionDistrict",
          "lat": "37.76",
          "long": "122.41"
        },
        {
          "position": "2.",
          "name": "Noe Valley",
          "hashtag": "NoeValley",
          "lat": "37.75",
          "long": "122.43"
        },
        {
          "position": "3.",
          "name": "Balboa Terrace",
          "hashtag": "BalboaTerrace",
          "lat": "37.73",
          "long": "122.45"
        },
        {
          "position": "4.",
          "name": "Sunnyside",
          "hashtag": "Sunnyside",
          "lat": "37.73",
          "long": "122.44"
        },
        {
          "position": "5.",
          "name": "Richmond District",
          "hashtag": "RichmondDistrict",
          "lat": "37.73",
          "long": "122.45"
        },
        {
          "position": "6.",
          "name": "Marina",
          "hashtag": "Marina",
          "lat": "37.77",
          "long": "122.39"
        },
        {
          "position": "7.",
          "name": "Cow Hollow",
          "hashtag": "CowHollow",
          "lat": "37.77",
          "long": "122.43"
        },
        {
          "position": "8.",
          "name": "Pacific Heights",
          "hashtag": "PacificHeights",
          "lat": "37.79",
          "long": "122.44"
        },
        {
          "position": "9.",
          "name": "Bayview",
          "hashtag": "Bayview",
          "lat": "37.73",
          "long": "122.38"
        },
        {
          "position": "10.",
          "name": "Visitacion Valley",
          "hashtag": "VisitacionValley",
          "lat": "37.71",
          "long": "122.40"
        }
      ]
    },
    methods:{
        submitLocation: function(neighborhood){
            submitLatLongValues(neighborhood.lat,neighborhood.long);
        }
    }
});