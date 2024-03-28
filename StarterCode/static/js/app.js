// Loading in sample.json file
const sample_json = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Promise Pending
const dataPromise = d3.json(sample_json);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
d3.json(sample_json).then(function(data) {
    console.log(data);
    let dropdown_selector = d3.select('#selDataset');
    data.names.forEach((name) => {
      dropdown_selector
      .append('option')
      .text(name)
      .property('value', name);
    });
    build_charts(data.names[0])
    buildmetadata(data.names[0])
  });

// Grabbing the data needed to build the charts
function build_charts(sampleid){
  d3.json(sample_json).then(function(data) {
    const sample = data.samples.filter(asample => asample.id==sampleid)[0]
    console.log(sample)

// Creating horizontal bar chart
    let bar = {
      // Grabbing top 10 OTU's data using slice()
      x: sample.sample_values.slice(0,10).reverse(),
      y: sample.otu_ids.slice(0,10).map(otu_id=>"OTU "+otu_id).reverse(),
      text: sample.otu_labels.slice(0,10).reverse(),
      // Switches to horizonal orientation
      orientation: 'h',
      // Set chart type as bar
      type: 'bar'
    };
    // Print the bar chart
    Plotly.newPlot("bar", [bar]);

// Creating bubble chart
    let bubble = {
      // Grabbing OTU data
      x: sample.otu_ids,
      y: sample.sample_values,
      text: sample.otu_labels,
      // Creating markers
      mode: 'markers',
      marker: {
        size: sample.sample_values,
        color: sample.otu_ids,
        colorscale: "Earth"
      }
    };
    // Print the bubble chart
    Plotly.newPlot("bubble", [bubble]);
  });
};

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
function optionChanged(newsample){
  build_charts(newsample)
  buildmetadata(newsample)
};
