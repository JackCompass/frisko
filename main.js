let ctx = document.getElementById('myChart').getContext("2d");
let myChart = null;
const drawVisuals =  (duration) => {
    let stackoverflow_count = 0;
    let github_count = 0;
    let youtube_count = 0;
    let search_count = 0;
    // destroying if any chart is present.

    chrome.history.search({text: 'stackoverflow', startTime:Date.now() - (86400000 * duration), maxResults: 100000}, (data) => {
        stackoverflow_count = data.length;
        chrome.history.search({text: 'github', startTime:Date.now() - (86400000 * duration), maxResults: 100000}, (data) => {
            github_count = data.length;
            chrome.history.search({text: 'youtube', startTime:Date.now() - (86400000 * duration), maxResults: 100000}, (data) => {
                youtube_count = data.length;
                chrome.history.search({text: '', startTime:Date.now() - (86400000 * duration), maxResults: 100000}, (data) => {
                    search_count = data.length - stackoverflow_count - github_count - youtube_count;
                    myChart = new Chart(ctx, {
                        type: "doughnut",
                        data: {
                            labels:["Stackoverflow", "GitHub", "YouTube", "Other"],
                            datasets:[{
                                data: [stackoverflow_count, github_count, youtube_count, search_count],
                                backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)']
                            }],
                        },
                        options: {
                            animation: {
                                animateScale: true,
                            },
                        }
                    });
                    console.log("Chart is : ", myChart);
                })
            })
        })
    })
}


document.getElementById('duration').addEventListener("change", (event) => {
    if (myChart != null)
        myChart.destroy();
    const duration = parseInt(event.target.value, 10);
    if (!isNaN(duration))
        drawVisuals(event.target.value);

})

