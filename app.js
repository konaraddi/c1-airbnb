// AVERAGE NUMBER OF REVIEWS PER HOST (Y) VS HOST SINCE (X)
d3.csv("data/csv/listings.csv", function(data) {
    
    //avg number of reviews per year
    var avg_reviews = [];

    var years = [];
    // 2008 ---> 2017 placed in years
    for(let i = 0; i < 10; i++){
        years.push(2008 + i); 
        avg_reviews.push(null);   
    }

    for(let j = 0; j < data.length; j++){
        let year = Number(data[j]["host_since"].substring(0,4));
        for(let k = 0; k < 10; k++){
            if(year == (2008 + k)){
                let num_reviews = Number(data[j]["number_of_reviews"]);
                if(avg_reviews[k] == null){
                    avg_reviews[k]=[num_reviews,1];
                }else{
                    avg_reviews[k]=[avg_reviews[k][0]+num_reviews, avg_reviews[k][1]+1];
                }
                break;
            }
        }
    }
    console.log(avg_reviews);
    
    
    // calculate average number of reviews per host for each year
    for(let l = 0; l < 10; l++){
        avg_reviews[l] = Math.round(avg_reviews[l][0] / avg_reviews[l][1]);
    }

    console.log(avg_reviews);

    var ctx = document.getElementById('calendar-chart').getContext('2d');
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
        options: {}
    });
    
});