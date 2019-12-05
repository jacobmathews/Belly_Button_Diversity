function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    d3.json(`/metadata/${sample}`).then(function(response) {
  // Use d3 to select the panel with id of `#sample-metadata`
		var sampleMetadata = d3.select("#sample-metadata");
  // Use `.html("") to clear any existing metadata
		sampleMetadata.html("");
  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
		const metaDataEntries = Object.entries(response);
		metaDataEntries.forEach(([key, value]) => {
			var ul = sampleMetadata.append("ul");
			ul.text(`${key}: ${value}`);
	});
 
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data){
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
	buildBubbleChart(data);
	buildPieChart(data);
  })
}
const buildPieChart = (data) => {
	const inputData = [{
		values: data.sample_values.slice(0, 10),
		labels: data.otu_ids.slice(0, 10),
		type: 'pie'
	  }];
	  
	var layout = {
	height: 400,
	width: 500
	};
	Plotly.newPlot("pie", inputData, layout);
}

const buildBubbleChart = (data) => {
		// @TODO: Build a Bubble Chart using the sample data
		const trace1 = {
			x: data.otu_ids,
			y: data.sample_values,
			mode: 'markers',
			marker: {
			  size: data.sample_values,
			  color: data.otu_ids
			}
		  };		  
		var bubbleLayout = {
			title: "Bubble Chart",
			showlegend: false,
			height: 800,
			width: 1200,
			margin: { t: 0},
		  };	  
		  Plotly.newPlot("bubble", [trace1], bubbleLayout);
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
    optionChanged(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();