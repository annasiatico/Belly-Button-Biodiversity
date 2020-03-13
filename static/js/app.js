function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  let metadataURL = '/metadata/' + sample
    // Use d3 to select the panel with id of `#sample-metadata`
  let sampleMetadata = d3.select('#sample-metadata')
    // Use `.html("") to clear any existing metadata
  sampleMetadata.html("")

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
  d3.json(metadataURL).then(function(data){
      Object.entries(data).forEach(([key, value]) => {
        sampleMetadata.append('p').text(`${key}: ${value}`)
        .append('hr')})

        }
  )}

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
      

function pieChart(data) {
  let labels = data.otu_ids.slice(0,10);
  let values = data.sample_values.slice(0,10);
  let hovertext = data.otu_labels.slice(0,10);

  let trace = [{
    values : values,
    labels : labels,
    hovertext : hovertext,
    type : "pie",
  }];

  let layout = {
      title: '<b> Pie Chart </b>',
      showlegend: true
  };

  Plotly.newPlot('pie', trace , layout, {responsive: true});
}

function bubbleChart(data) {
let x_axis = data.otu_ids
let y_axis = data.sample_values
let text_values = data.otu_labels
let markersize = data.sample_values
let markercolors = data.otu_ids

let trace =[{
  x: x_axis,
  y: y_axis,
  mode: 'markers',
  text: text_values,
  marker: {
    size: markersize,
    color: markercolors,
  },
}]

let layout ={
  title:"<b> Bubble Chart </b>",
  xaxis: {title: 'OTU ID'},
  yaxis: {title: 'Sample Value'},
  width:900,
  //set transparent color
  plot_bgcolor: 'rgba(0, 0, 0, 0)',
  paper_bgcolor: 'rgba(0, 0, 0, 0)',
}

Plotly.newPlot('bubble', trace, layout, {responsive: true})

}

function buildCharts(sample) {
  d3.json(`/samples/${sample}`).then( data =>{
    // build the Pie Chart
    pieChart(data);
    // build the Bubble Chart
    bubbleChart(data);
  }); 
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
