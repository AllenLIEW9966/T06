const margin = { top: 40, right: 30, bottom: 50, left: 70 };
const width = 800;
const height = 400;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const barColor = "#606464";
const bodyBackgroundColor = "#fbf2e8";

const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

let innerChart;

const binGenerator = d3.bin()
    .value(d => d.energyConsumption);

const filters_screen = [
    { id: "all", label: "All", isActive: true },
    { id: "LED", label: "LED", isActive: false },
    { id: "LCD", label: "LCD", isActive: false },
    { id: "OLED", label: "OLED", isActive: false }
];

const marginS = { top: 40, right: 120, bottom: 50, left: 70 };
const widthS = 800;
const heightS = 450;
const innerWidthS = widthS - marginS.left - marginS.right;
const innerHeightS = heightS - marginS.top - marginS.bottom;

const xScaleS = d3.scaleLinear();
const yScaleS = d3.scaleLinear();
const colorScale = d3.scaleOrdinal();

let innerChartS;
const tooltipWidth = 65;
const tooltipHeight = 32;