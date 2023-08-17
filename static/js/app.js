// constant
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json" 
  
// Fetch the JSON data
d3.json(url).then(function(data) {
  console.log(data);
});


function init() {

    // load data with d3
    let dropdownMenu = d3.select("#selDataset");

    
    d3.json(url).then((data) => {
        
        // names
        let names = data.names;

        // dropdown menu
        names.forEach((id) => {

            console.log(id);

            dropdownMenu.append("option").text(id).property("value",id);
        });

        // Set the first sample from the list
        let sample = names[0];
        console.log(sample);
        
        // Build the initial plots
        getInfo(sample);
        BarPlot(sample);
        BubbleChart(sample);
    });
};

// get info
function getInfo(sample) {

    // load data with d3
    d3.json(url).then((data) => {

        // get metadata
        let metadata = data.metadata;

        // filter based on the value of the sample
        let value = metadata.filter(result => result.id == sample);

        // log data
        console.log(value)

        // get first index
        let valueData = value[0];

        // reset metadata
        d3.select("#sample-metadata").html("");

        // add each key/value pair 
        Object.entries(valueData).forEach(([key,value]) => {

            // log pairs as they get added
            console.log(key,value);

            d3.select('#sample-metadata').append('h5').text(`${key}: ${value}`);
        });
    });

};

// Bar Chart
function BarPlot(sample) {

    // load data with d3
    d3.json(url).then((data) => {

        // retrieve all sample data
        let sampleInfo = data.samples;

        // filter based on the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // get first index
        let valueData = value[0];

        // get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;


        // top ten items in descending order
        let xticks = sample_values.slice(0,10).reverse();
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // bar chart specs
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Function that builds the bubble chart
function BubbleChart(sample) {

    // load data with d3
    d3.json(url).then((data) => {
        
        let sampleInfo = data.samples;

        // filter based on sample
        let value = sampleInfo.filter(result => result.id == sample);

        // get first index
        let valueData = value[0];

        // get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;
        
        // chart specs
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // chart layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Update data when dropdown changed
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // run the functions again
    getInfo(value);
    BarPlot(value);
    BubbleChart(value);
};



// Initialize function
init();