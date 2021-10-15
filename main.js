let ctx = document.getElementById('myChart').getContext("2d");
let myChart = null;

const colors = [
    '#003f5c',
    '#2f4b7c',
    '#665191',
    '#a05195',
    '#d45087',
    '#f95d6a',
    '#ff7c43',
    '#ffa600',
    '#0088FE',
    '#00C49F',
]

function domain_from_url(url) {
    let result;
    let match;
    if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
        result = match[1]
        if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
            result = match[1]
        }
    }
    return result
}


const drawVisuals = (duration, chart_type) => {

    let tracker = {};

    chrome.history.search( {text: '', startTime: Date.now() - (86400000 * duration), maxResults: 10000}, (data) => {

        console.log(data);
        data.forEach( (element) => {
            let domain_name = domain_from_url(element.url);
            if (tracker[domain_name] !== undefined) {
                tracker[domain_name] += 1;
            }
            else {
                tracker[domain_name] = 0;
            }
        })

        // Need to find out top 10 visits
        let sorted_tracker = [];
        for (let track in tracker) {
            sorted_tracker.push([track, tracker[track]]);
        }
        sorted_tracker.sort( (item_a, item_b) => (item_b[1] - item_a[1]));

        let label = [];
        let values = [];

        for (let i = 0; i < 10 && i < sorted_tracker.length; i++) {
            label.push(sorted_tracker[i][0]);
            values.push(sorted_tracker[i][1]);
        }

        console.log(label, values);

        myChart = new Chart(ctx, {
            type: chart_type,
            data: {
                labels: label,
                datasets: [{
                    data: values,
                    label: 'Activity',
                    backgroundColor: colors,
                }],
            },
            options: {
                animation: {
                    animateScale: true,
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'left',
                        fullWidth: true,
                        align: 'left',
                        labels: {
                            pointStyle: "triangle",
                            usePointStyle: true,
                            color: "black",
                        }
                    }
                }
            },

        })
    })


}

// const drawVisuals =  (duration, chart_type) => {
//     let stackoverflow_count = 0;
//     let github_count = 0;
//     let youtube_count = 0;
//     let search_count = 0;
//
//     chrome.history.search({text: 'stackoverflow', startTime:Date.now() - (86400000 * duration), maxResults: 100000}, (data) => {
//         stackoverflow_count = data.length;
//         chrome.history.search({text: 'github', startTime:Date.now() - (86400000 * duration), maxResults: 100000}, (data) => {
//             github_count = data.length;
//             chrome.history.search({text: 'youtube', startTime:Date.now() - (86400000 * duration), maxResults: 100000}, (data) => {
//                 youtube_count = data.length;
//                 chrome.history.search({text: '', startTime:Date.now() - (86400000 * duration), maxResults: 100000}, (data) => {
//                     search_count = data.length - stackoverflow_count - github_count - youtube_count;
//                     myChart = new Chart(ctx, {
//                         type: chart_type,
//                         data: {
//                             labels:["Stackoverflow", "GitHub", "YouTube", "Other"],
//                             datasets:[{
//                                 data: [stackoverflow_count, github_count, youtube_count, search_count],
//                                 label: "Activity",
//                                 backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)']
//                             }],
//                         },
//                         options: {
//                             animation: {
//                                 animateScale: true,
//                             },
//                             plugins: {
//                                 legend: {
//                                     display: true,
//                                     position: "top",
//                                     labels: {
//                                         pointStyle: "triangle",
//                                         usePointStyle: true,
//                                         color: "black",
//                                     }
//                                 }
//                             }
//                         }
//                     });
//                     console.log("Chart is : ", myChart);
//                 })
//             })
//         })
//     })
// }


const elements = document.querySelectorAll('.toggle');
elements.forEach( (item, index) => {
   item.addEventListener('change', (event) => {
       if (myChart != null)
           myChart.destroy();
       const duration = parseInt(document.getElementById('duration').value, 10);
       let chart_type = document.getElementById('chart-type').value;
       if (!isNaN(duration)){
           drawVisuals(duration, chart_type)
       }
   })
});


