function PieChart(canvasId, data) {
    // user defined data
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.pieAreaWidth = this.canvas.width;
    this.pieAreaHeight = this.canvas.height;
    this.data = data;
    
    // constant styles
    // this.padding = 10;
    // this.legendBorder = 2;
    // this.pieBorder = 5;
    // this.colorLabelSize = 20;
    // this.borderColor = "#555";
    // this.shadowColor = "#777";
    // this.shadowBlur = 10;
    // this.shadowX = 2;
    // this.shadowY = 2;
    // this.font = "16pt Calibri"; 
};

window.onload = function() {
    const pieChart = new PieChart("myCanvas");
}

const data = ["Joan", "Danny", "Joe", "Jonathan"];

function findLegendWidth() {
    let labelWidth = 0 

    for(let i = 0; i <  data.length; i++) {
        let label = data[i];
        labelWidth = Math.max(labelWidth, context.measureText(label).width);
    }

    return labelWidth;
}