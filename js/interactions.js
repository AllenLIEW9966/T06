const populateFilters = (data) => {
    d3.select("#filters_screen")
        .selectAll("button")
        .data(filters_screen)
        .join("button")
        .attr("class", d => d.isActive ? "filter active" : "filter")
        .text(d => d.label)
        .on("click", (e, d) => {
            if (d.isActive) return;

            filters_screen.forEach(f => f.isActive = false);
            d.isActive = true;

            d3.select("#filters_screen")
                .selectAll("button")
                .attr("class", f => f.isActive ? "filter active" : "filter");

            updateHistogram(d.id, data);
        });
};

const updateHistogram = (filterId, data) => {
    let filteredData = data.filter(d => d.energyConsumption < 1800);

    if (filterId !== "all") {
        filteredData = filteredData.filter(d => {
            if (filterId === "LED") return d.screenTech === "LED" || d.screenTech === "LCD (LED)";
            return d.screenTech === filterId;
        });
    }

    const updatedBins = binGenerator(filteredData);

    yScale.domain([0, d3.max(updatedBins, d => d.length)]).nice();

    innerChart.select(".y-axis")
        .transition()
        .duration(500)
        .call(d3.axisLeft(yScale));

    innerChart.selectAll("rect")
        .data(updatedBins)
        .join(
            enter => enter.append("rect")
                .attr("x", d => xScale(d.x0))
                .attr("y", innerHeight)
                .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0)))
                .attr("height", 0)
                .attr("fill", barColor)
                .attr("stroke", bodyBackgroundColor)
                .attr("stroke-width", 2),
            update => update,
            exit => exit.remove()
        )
        .transition()
        .duration(500)
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0)))
        .attr("height", d => innerHeight - yScale(d.length))
        .attr("fill", barColor)
        .attr("stroke", bodyBackgroundColor)
        .attr("stroke-width", 2);
};

const createTooltip = () => {
    const tooltip = innerChartS
        .append("g")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("pointer-events", "none");

    tooltip
        .append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "tooltip-rect")
        .attr("fill", barColor);

    tooltip
        .append("text")
        .attr("x", tooltipWidth / 2)
        .attr("y", tooltipHeight / 2)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", "white")
        .style("font-size", "11px")
        .style("font-weight", 700);
};

const handleMouseEvents = () => {
    const tooltip = innerChartS.select(".tooltip");

    innerChartS.selectAll("circle")
        .on("mouseenter", (e, d) => {
            tooltip.select("text")
                .text(`${d.energyConsumption}`);

            const cx = +e.target.getAttribute("cx");
            const cy = +e.target.getAttribute("cy");

            tooltip
                .interrupt()
                .attr(
                    "transform",
                    `translate(${cx - 0.5 * tooltipWidth}, ${cy - 1.5 * tooltipHeight})`
                )
                .transition()
                .duration(200)
                .style("opacity", 1);
        })
        .on("mouseleave", () => {
            tooltip
                .interrupt()
                .transition()
                .duration(200)
                .style("opacity", 0);
        });
};