const svg = d3.select("#chart-area").append("svg")
    .attr("width", 400)
    .attr("height", 400);

svg.append("circle")
    .attr("cx", 200)
    .attr("cy", 200)
    .attr("r", 100)
    .attr("fill", "blue");