"use strict";

function PieChart(canvasId, data) {
    // user defined data
    this.canvas = document.getElementById("board");
    this.data = data;

    // constant styles
    this.padding = 10;
    this.legendBorder = 2;
    this.pieBorder = 5;
    this.colorLabelSize = 20;
    this.borderColor = "#555";
    this.shadowColor = "#777";
    this.shadowBlur = 10;
    this.shadowX = 2;
    this.shadowY = 2;
    this.font = "16pt Calibri";

    // calculated styles
    /* Define the getLegendWidth() method which returns the width of the legend by
    taking into account the text length of the longest label: */

    // relationships

};
var legend = ["Joan", "Danny", "Joe", "Jonathan"];
for (var i = 0; i < legend.length; i++) {
    var string = legend[i].length;
    console.log(string);
}