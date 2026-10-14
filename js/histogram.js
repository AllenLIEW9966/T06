const drawHistogram = (data) => {
    const filteredData = data.filter(d => d.energyConsumption < 1800);

    const svg = d3.select("#histogram")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    innerChart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const bins = binGenerator(filteredData);

    const min0g = bins[0].x0;
    const max0g = bins[bins.length - 1].x1;
    const binsMaxlength = d3.max(bins, d => d.length);

    xScale
        .domain([min0g, max0g])
        .range([0, innerWidth]);

    yScale
        .domain([0, binsMaxlength])
        .range([innerHeight, 0])
        .nice();

    innerChart.selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("class", "histogram-bar")
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0)))
        .attr("height", d => innerHeight - yScale(d.length))
        .attr("fill", barColor)
        .attr("stroke", bodyBackgroundColor)
        .attr("stroke-width", 2);

    const bottomAxis = d3.axisBottom(xScale);
    innerChart.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis);

    svg.append("text")
        .attr("x", margin.left + innerWidth)
        .attr("y", height - 10)
        .attr("text-anchor", "end")
        .attr("class", "axis-label")
        .text("Labeled Energy Consumption (kWh/year)");

    const leftAxis = d3.axisLeft(yScale);
    innerChart.append("g")
        .attr("class", "axis y-axis")
        .call(leftAxis);

    svg.append("text")
        .attr("x", 20)
        .attr("y", 30)
        .attr("text-anchor", "start")
        .attr("class", "axis-label")
        .text("Frequency");
};