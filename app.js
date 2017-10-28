Papa.parse("http://localhost:4000/data/csv/listings.csv", {
    header: true,
    download: true,
    dynamicTyping: true,
	complete: function(results) {
        var data = results["data"];
        constructChart1(data);
        constructChart2(data);
        constructChart3(data);
	}
});

// AVERAGE NUMBER OF REVIEWS PER HOST vs HOST SINCE YEAR
function constructChart1(data){
    //avg number of reviews 
    var avg_reviews = [];

    var years = [];
    // 2008 ---> 2017 correspond to 0 ---> 9 in array
    for(let i = 0; i < 10; i++){
        years.push(2008 + i); 
        avg_reviews.push(null);   
    }

    // Papa Parse adds an empty row to the data, hence the "data.length - 1"
    for(let j = 0; j < data.length - 1; j++){
        let year = Number(data[j]["host_since"].substring(0,4));
        for(let k = 0; k < 10; k++){
            if(year == (2008 + k)){
                let num_reviews = Number(data[j]["number_of_reviews"]);
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
    for(let l = 0; l < 10; l++){
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
                backgroundColor:'rgb(68,108,179)',
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
            }     
        }
    });
}


// REVIEW RATINGS vs SQUARE FEET
function constructChart2(data){

    var squareft_ratings = [];
    for(let i = 0; i < data.length - 1; i++){
        let x = Number(data[i]["square_feet"]);
        let y = Number(data[i]["review_scores_rating"]);

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
                backgroundColor:'rgb(68,108,179)',
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
            }     
        }
    });
}

// PRICE vs BEDROOMS
function constructChart3(data){

    var bedrooms_price= [];
    for(let i = 0; i < data.length - 1; i++){
        let x = Number(data[i]["bedrooms"])
        let y = Number(data[i]["price"].substring(1,data[i]["price"].length));
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
                fill: false,
                showLine: false,
                backgroundColor:'rgb(68,108,179)',
                data: bedrooms_price
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
                        labelString: 'Price'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Bedrooms'
                    }
                }]
            }     
        }
    });

}
