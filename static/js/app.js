// Belly Button Biodiversity App
// Define data URL and variable to store the data
const dataUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let biodata;

// Fetch data from the URL and store it in the biodata variable
d3.json(dataUrl).then(function(data) {
    biodata = data;
    initialize();
});

// Function to display metadata for a given sample ID
function displayMetadata(sampleID) {
    // Select metadata panel and clear its content
    let metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html("");

    // Filter metadata for the selected sample ID
    let info = biodata.metadata.filter(sample => sample.id == sampleID)[0];

    // Log filtered metadata for debugging
    console.log(info);

    // Append key-value pairs from the metadata to the metadata panel
    Object.entries(info).forEach(function([key, value]) {
        metadataPanel.append("p").text(`${key}: ${value}`);
    });
}

// Function to create bar and bubble charts for a given sample ID
function createCharts(sampleID) {
    // Select bar and bubble chart divs and clear their content
    let barDiv = d3.select("#bar");
    let bubbleDiv = d3.select("#bubble");
    barDiv.html("");
    bubbleDiv.html("");

    // Filter sample data for the selected sample ID
    let sampleInfo = biodata.samples.filter(sample => sample.id == sampleID)[0];

    // Log filtered sample data for debugging
    console.log(sampleInfo);

    // Extract OTU IDs, labels, and sample values from the sample data
    let otuIds = sampleInfo.otu_ids;
    let otuLabels = sampleInfo.otu_labels;
    let sampleValues = sampleInfo.sample_values;

    // Define bar chart trace, data, and layout
    let barTrace = {
        x: sampleValues.slice(0, 10).reverse(),
        y: otuIds.slice(0, 10).map(otu => `OTU ${otu}`).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
    };
    let barData = [barTrace];
    let barLayout = {
        title: { text: "<b>Top 10 OTUs</b>", font: { size: 24 } },
        width: 550,
        height: 450,
        margin: { t: 50, b: 50 },
        marker: {
            size: sampleValues,
            color: otuIds,
            colorscale: "Earth"
        }
    };

    // Create the bar chart
    Plotly.newPlot("bar", barData, barLayout, {responsive: true});

    // Define bubble chart trace, data, and layout
    let bubbleTrace = {
        x: otuIds,
        y: sampleValues,
        margin: { t: 0 },
        mode: "markers",
        marker: {
            size: sampleValues,
            color: otuIds,
            colorscale: "Jet"
        },
        text: otuLabels
    };
    let bubbleData = [bubbleTrace];
    let bubbleLayout = {
        title: { text: "<b>OTU ID vs Sample Values</b>", font: { size: 26 } },
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Values" },
        width:1200,
        height: 600
    };

    // Create the bubble chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, {scrollZoom: true}, {responsive: true});
}

// Function to handle changes in the dropdown menu
function handleDropdownChange(sampleID) {
    // Update metadata and charts with the new sample ID
    displayMetadata(sampleID);
    createCharts(sampleID);
}

// Function to initialize the dashboard
function initialize() {
    // Select the dropdown menu
    let dropdown = d3.select("#selDataset");

    // Populate the dropdown menu with sample IDs (names)
    biodata.names.forEach(function(name) {
         dropdown.append("option").text(name).property("value", name);
    });

    // Set the initial sample ID as the first sample ID in the dataset
    let sampleID = biodata.names[0];

    // Display metadata and create charts for the initial sample ID
    displayMetadata(sampleID);
    createCharts(sampleID);

    // Add event listener for the dropdown menu to handle changes in selection
    dropdown.on("change", function() {
        // Get the new sample ID selected by the user
        let newSampleID = d3.select(this).property("value");

        // Call the handleDropdownChange function with the new sample ID
        handleDropdownChange(newSampleID);
    });
}