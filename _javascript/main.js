function PieChart(canvasId, data) {
    // setup data and canvas
    this.data = data;
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");

    // changing canvas standard styles
    this.context.textBaseline = "middle";
    this.context.font = 'bold 12pt serif';
    this.context.lineWidth = "2";
    this.context.strokeStyle = "black";

    // sizing and locating created objects
    this.canvasPadding = 15;
    this.legendWidth = this.getLegendWidth();
    this.pieAreaX = this.canvas.width - this.legendWidth;
    this.pieAreaY = this.canvas.height
    this.pieLocationX = this.pieAreaX / 2;
    this.pieLocationY = this.pieAreaY / 2;
    this.pieRadius = Math.min(this.pieAreaX, this.pieAreaY / 2 - this.canvasPadding - 5);

    // drawing the things
    this.drawPieBorder();
    this.drawLegend();
};


PieChart.prototype.getLegendWidth = function() {
    let { context, data } = this;
    let labelWidth = 0;
    
    data.forEach(function(property){
        labelWidth = Math.max(labelWidth, context.measureText(property.label).width);
    });

    return labelWidth + this.canvasPadding * 4
}

PieChart.prototype.drawLegend = function() {
    let { context } = this;
    context.save();

    // forEach method will do this for each array property
    context.beginPath();
    context.rect(this.pieAreaX, this.canvasPadding, 20, 20);
    context.closePath();
    context.fillStyle = "green";
    context.fill();
    context.stroke();
    context.fillText(this.data[4].label, this.pieAreaX + this.canvasPadding * 2, this.canvasPadding * 2);
    context.restore;
}

PieChart.prototype.drawPieBorder = function() {
    let { context } = this;
    
    context.save;
    context.beginPath();
    context.fillStyle = "white";
    context.borderSize = 5;
    context.shadowColor = "#777";
    context.shadowBlur = 10;
    context.shadowOffsetX = 1;
    context.shadowOffsetY = 2;
    context.arc(this.pieLocationX, this.pieLocationY, this.pieRadius + context.borderSize, 0, Math.PI * 2);
    context.fill();
    context.closePath();
    context.restore();
}

window.onload = function() {
    const data = [{
        label: "Eating",
        value: 2,
        color: "red"
        }, {
        label: "Working",
        value: 8,
        color: "blue"
        }, {
        label: "Sleeping",
        value: 8,
        color: "green"
        }, {
        label: "Errands",
        value: 2,
        color: "yellow"
        }, {
        label: "Entertainment",
        value: 4,
        color: "violet"
    }];
    
    const pieChart = new PieChart("myCanvas", data);
    console.log(pieChart);
}