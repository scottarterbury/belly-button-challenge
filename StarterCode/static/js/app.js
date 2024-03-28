// URL for Json Data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//get the JSON data and check console
d3.json(url).then(function (data) {
    console.log(data);
});

//Create a horizontal bar chart to display the top 10 OTUs found in that individual.
function drawBar(sampleId) {

    // Use D3 to get all the data
   d3.json(url).then(data => {
        let samples = data.samples;

        //filter data
        let values = samples.filter(result => result.id == sampleId);

        //get the first index
        let result = values[0];

        //get OTU IDs, labels and sample values
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;

        let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();

        //Log values to console
        console.log(otu_ids, otu_labels, sample_values);

        //create the bar trace
        let barData = {
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            type: 'bar',
            text: otu_labels.slice(0, 10).reverse(),
            orientation: 'h'
        };

        //put trace in array
        let barTrace = [barData];

        //create bar layout
        let barLayout = {
            title: "Top 10 OTUs Present"
        };

        //Use the Plotly function to plot the bar chart
        Plotly.newPlot("bar", barTrace, barLayout);

    })
}

//Create a bubble chart 
function drawBubble(sampleId) {

    // Use D3 to get the data
    d3.json(url).then(data => {
       // let samples = data.samples;

        //filter data 
        let values = samples.filter(result => result.id == sampleId);

        //get the first index
        let result = values[0];

        //get OTU IDs, labels and sample values
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;


        //Log values to console
        console.log(otu_ids, otu_labels, sample_values);

        //create the bubble trace
        let bubbleData = {
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Earth'
            }
        };

        //put trace in array
        let bubbleTrace = [bubbleData];

        //create bubble layout
        let bubbleLayout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            margin: { t: 30 },
            xaxis: { itle: "OTU ID" }
        };

        //Call the Plotly function to plot the bubble chart
        Plotly.newPlot("bubble", bubbleTrace, bubbleLayout);

    });
}

//function for the dropdown data
function showData(sampleId) {

    //call d3 to show all the data
    d3.json(url).then((data) => {
       // let metadata = data.metadata; 

        //filter data
        let result = metadata.filter(meta => meta.id == sampleId)[0];
        let demoInfo = d3.select('#sample-metadata');

        //clear demographic data
        demoInfo.html('');

        //add key-value pair to demographic panel
        Object.entries(result).forEach(([key, value]) => {
            demoInfo.append('h6').text(`${key}: ${value}`);
        });
    });
};

//new value
function optionChanged(sampleId) {
    console.log(`optionChanged, new value: ${sampleId}`)

    drawBar(sampleId);
    drawBubble(sampleId);
    showData(sampleId);
}

// Grabbing metadata to insert into demographic info section.
function buildmetadata(sampleid){
  d3.json(sample_json).then(function(data) {
    const metadata = data.metadata.filter(asample => asample.id==sampleid)[0]
    console.log(metadata)
    // Inserting metadata into demographic info section.
    const panel = d3.select("#sample-metadata")
    // Clears the metadata and reruns functions when dropdown selector is changed
    panel.html("")
    for (key in metadata){
      panel.append("p").text(key.toUpperCase()+": "+metadata[key])
    };
  })
};

// initialize function 
function init() {
    console.log(init);

    //dropdown selector
    let selector = d3.select('#selDataset');

    //use d3 to get names to populate dropdown
    d3.json(url).then(data => {

        //initialize variable for sample names
        let names = data.names;

        //populate dropdown
        for (let i = 0; i < names.length; i++) {
            let sampleId = names[i];
            selector.append('option').text(sampleId).property('value', sampleId);
        };

        //read the current value of the dropdown
        let initialId = selector.property('value');
        console.log(`initialId = ${initialId}`);

        // draw the graphs from the selected sample id
        drawBar(initialId);
        drawBubble(initialId);
        showData(initialId);

    });
}
init();
