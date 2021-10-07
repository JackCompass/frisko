let ctx = document.getElementById('myChart').getContext("2d");
let myChart = null;
const drawVisuals =  (duration, chart_type) => {
    let stackoverflow_count = 0;
    let github_count = 0;
    let youtube_count = 0;
    let search_count = 0;

    chrome.history.search({text: 'stackoverflow', startTime:Date.now() - (86400000 * duration), maxResults: 100000}, (data) => {
        stackoverflow_count = data.length;
        chrome.history.search({text: 'github', startTime:Date.now() - (86400000 * duration), maxResults: 100000}, (data) => {
            github_count = data.length;
            chrome.history.search({text: 'youtube', startTime:Date.now() - (86400000 * duration), maxResults: 100000}, (data) => {
                youtube_count = data.length;
                chrome.history.search({text: '', startTime:Date.now() - (86400000 * duration), maxResults: 100000}, (data) => {
                    search_count = data.length - stackoverflow_count - github_count - youtube_count;
                    myChart = new Chart(ctx, {
                        type: chart_type,
                        data: {
                            labels:["Stackoverflow", "GitHub", "YouTube", "Other"],
                            datasets:[{
                                data: [stackoverflow_count, github_count, youtube_count, search_count],
                                label: "Activity",
                                backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)']
                            }],
                        },
                        options: {
                            animation: {
                                animateScale: true,
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    position: "top",
                                    labels: {
                                        pointStyle: "triangle",
                                        usePointStyle: true,
                                        color: "black",
                                    }
                                }
                            }
                        }
                    });
                    console.log("Chart is : ", myChart);
                })
            })
        })
    })
}


const elements = document.querySelectorAll('.toggle');
elements.forEach( (item, index) => {
   item.addEventListener('change', (event) => {
       if (myChart != null)
           myChart.destroy();
       const duration = parseInt(document.getElementById('duration').value, 10);
       let chart_type = document.getElementById('chart-type').value;
       console.log(chart_type);
       if (!isNaN(duration)){
           drawVisuals(duration, chart_type)
       }
   })
});


