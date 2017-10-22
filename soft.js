var x = [];
var y = [];

d3.csv("data/csv/listings.csv", function(data) {
    for(let i = 0; i < data.length; i+=100){
        if(data[i]["host_response_rate"] != 'N/A'){  
            x.push(data[i]["host_response_rate"]);
            y.push(data[i]["number_of_reviews"])
        }
    }
    console.log(x);
    console.log(y);
    var ctx = document.getElementById('calendar-chart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
    
        // The data for our dataset
        data: {
            labels: x,
            datasets: [{
                label: "My First dataset",
                borderColor: 'rgb(255, 99, 132)',
                data: y,
            }]
        },
    
        // Configuration options go here
        options: {}
    });
});


