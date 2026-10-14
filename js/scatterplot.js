const drawScatterplot = (data) => {
    const filteredData = data.filter(d => d.energyConsumption < 1800);

    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${widthS} ${heightS}`);

    innerChartS = svg.append("g")
        .attr("transform", `translate(${marginS.left}, ${marginS.top})`);

    const xExtent = d3.extent(filteredData, d => d.star);
    xScaleS
        .domain([xExtent[0] - 0.5, xExtent[1] + 0.5])
        .range([0, innerWidthS]);

    const yExtent = d3.extent(filteredData, d => d.energyConsumption);
    yScaleS
        .domain([0, yExtent[1] + 100])
        .range([innerHeightS, 0])
        .nice();

    const uniqueTechs = [...new Set(filteredData.map(d => d.screenTech))];

    colorScale
        .domain(uniqueTechs)
        .range(d3.schemeCategory10);

    const bottomAxis = d3.axisBottom(xScaleS);
    innerChartS.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${innerHeightS})`)
        .call(bottomAxis);

    svg.append("text")
        .attr("x", marginS.left + innerWidthS)
        .attr("y", heightS - 10)
        .attr("text-anchor", "end")
        .attr("class", "axis-label")
        .text("Star Rating");

    const leftAxis = d3.axisLeft(yScaleS);
    innerChartS.append("g")
        .attr("class", "axis")
        .call(leftAxis);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -heightS / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("class", "axis-label")
        .text("Labeled Energy Consumption (kWh/year)");

    innerChartS.selectAll("circle")
        .data(filteredData)
        .join("circle")
        .attr("class", "scatter-dot")
        .attr("cx", d => xScaleS(d.star))
        .attr("cy", d => yScaleS(d.energyConsumption))
        .attr("r", 4)
        .attr("fill", d => colorScale(d.screenTech))
        .attr("opacity", 0.65);

    const legend = svg.append("g")
        .attr("transform", `translate(${marginS.left + innerWidthS + 20}, ${marginS.top + 10})`);

    uniqueTechs.forEach((tech, i) => {
        const row = legend.append("g")
            .attr("transform", `translate(0, ${i * 22})`);

        row.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", colorScale(tech))
            .attr("rx", 2);

        row.append("text")
            .attr("x", 18)
            .attr("y", 9)
            .attr("class", "axis-label")
            .text(tech);
    });
};