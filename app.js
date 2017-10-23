d3.csv("data/csv/listings.csv", function(data) {

    // map of years & sum of number reviews per year and number of hosts per year 
    var xy_map = new Map();

    for(let i = 0; i < data.length; i++){
        
        // get just the year
        host_since_year = Number(data[i]["host_since"].substring(0,4));
        if(host_since_year != 0){
            if(xy_map.get(host_since_year) == undefined){
                xy_map.set(host_since_year, [data[i]["number_of_reviews"], 1]);
            }else{
                // put sum of reviews 
                // put number of hosts
                xy_map.set(host_since_year, )
            }
        }
    }

    var x = Array.from(xy_map.keys());
    var y = [];
    for(var [key, value] of xy_map){
        y.push(xy_map.get(key));
    }
    console.log(x);
    console.log(y);
    
    var ctx = document.getElementById('calendar-chart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',
    
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