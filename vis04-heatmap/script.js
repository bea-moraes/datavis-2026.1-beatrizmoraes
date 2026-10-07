// -----------------------------------------------------
// DIMENSÕES DO GRÁFICO
// -----------------------------------------------------

var margin = {
  top: 30,
  right: 30,
  bottom: 100,
  left: 70
};

var width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;


// -----------------------------------------------------
// CRIA O SVG
// -----------------------------------------------------

var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr(
      "transform",
      "translate(" + margin.left + "," + margin.top + ")"
    );


// -----------------------------------------------------
// CATEGORIAS
// -----------------------------------------------------

var myGroups = [
  "Até R$ 6 mil",
  "R$ 6.001-12 mil",
  "Acima de R$ 12 mil"
];

var myVars = [
  "Preta",
  "Parda",
  "Branca",
  "Amarela"
];


// -----------------------------------------------------
// EIXO X
// -----------------------------------------------------

var x = d3.scaleBand()
  .range([0, width])
  .domain(myGroups)
  .padding(0.01);

svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));


// -----------------------------------------------------
// EIXO Y
// -----------------------------------------------------

var y = d3.scaleBand()
  .range([height, 0])
  .domain(myVars)
  .padding(0.01);

svg.append("g")
  .call(d3.axisLeft(y));


// -----------------------------------------------------
// ESCALA DE CORES
// -----------------------------------------------------

var myColor = d3.scaleLinear()
  .domain([15, 30, 45])
  .range(["#fff5f0", "#ef3b2c", "#67000d"]);


// -----------------------------------------------------
// DADOS
// -----------------------------------------------------

var data = [

  {group:"Até R$ 6 mil", variable:"Amarela", value:17.8},
  {group:"R$ 6.001-12 mil", variable:"Amarela", value:37.5},
  {group:"Acima de R$ 12 mil", variable:"Amarela", value:44.7},

  {group:"Até R$ 6 mil", variable:"Branca", value:24.5},
  {group:"R$ 6.001-12 mil", variable:"Branca", value:35.4},
  {group:"Acima de R$ 12 mil", variable:"Branca", value:40.0},

  {group:"Até R$ 6 mil", variable:"Parda", value:30.9},
  {group:"R$ 6.001-12 mil", variable:"Parda", value:36.9},
  {group:"Acima de R$ 12 mil", variable:"Parda", value:32.1},

  {group:"Até R$ 6 mil", variable:"Preta", value:36.2},
  {group:"R$ 6.001-12 mil", variable:"Preta", value:35.0},
  {group:"Acima de R$ 12 mil", variable:"Preta", value:28.8}

];


// -----------------------------------------------------
// TOOLTIP
// -----------------------------------------------------

var tooltip = d3.select("#my_dataviz")
  .append("div")
  .style("position", "absolute")
  .style("visibility", "hidden")
  .style("background-color", "white")
  .style("border", "1px solid #999")
  .style("border-radius", "5px")
  .style("padding", "8px")
  .style("font-size", "13px")
  .style("box-shadow", "0px 2px 5px rgba(0,0,0,0.2)");


// -----------------------------------------------------
// RETÂNGULOS DO HEATMAP
// -----------------------------------------------------

svg.selectAll()
  .data(data, function(d) {
    return d.group + ":" + d.variable;
  })
  .enter()
  .append("rect")

  .attr("x", function(d) {
    return x(d.group);
  })

  .attr("y", function(d) {
    return y(d.variable);
  })

  .attr("width", x.bandwidth())
  .attr("height", y.bandwidth())

  .style("fill", function(d) {
    return myColor(d.value);
  })

  // Quando o mouse entra no retângulo
  .on("mouseover", function(event, d) {

    // Destaca o retângulo
    d3.select(this)
      .style("stroke", "black")
      .style("stroke-width", 3);

    // Mostra a porcentagem
    tooltip
      .style("visibility", "visible")
      .html(
        "<strong>" + d.value.toFixed(1).replace(".", ",") + "%</strong>" +
        "<br>" +
        d.variable +
        "<br>" +
        d.group
      );
  })

  // Tooltip acompanha o mouse
  .on("mousemove", function(event) {

    tooltip
      .style("top", (event.pageY + 10) + "px")
      .style("left", (event.pageX + 10) + "px");
  })

  // Quando o mouse sai
  .on("mouseout", function() {

    d3.select(this)
      .style("stroke", "none");

    tooltip
      .style("visibility", "hidden");
  });


// -----------------------------------------------------
// LEGENDA DAS CORES
// -----------------------------------------------------

// Cria o gradiente
var defs = svg.append("defs");

var linearGradient = defs.append("linearGradient")
  .attr("id", "legend-gradient");

// Cor inicial
linearGradient.append("stop")
  .attr("offset", "0%")
  .attr("stop-color", "#fff5f0");

// Cor intermediária
linearGradient.append("stop")
  .attr("offset", "50%")
  .attr("stop-color", "#ef3b2c");

// Cor final
linearGradient.append("stop")
  .attr("offset", "100%")
  .attr("stop-color", "#67000d");


// Desenha a barra da legenda
svg.append("rect")
  .attr("x", 70)
  .attr("y", height + 50)
  .attr("width", 210)
  .attr("height", 12)
  .style("fill", "url(#legend-gradient)");


// Valores da legenda
svg.append("text")
  .attr("x", 70)
  .attr("y", height + 78)
  .style("font-size", "11px")
  .text("15%");

svg.append("text")
  .attr("x", 175)
  .attr("y", height + 78)
  .attr("text-anchor", "middle")
  .style("font-size", "11px")
  .text("30%");

svg.append("text")
  .attr("x", 280)
  .attr("y", height + 78)
  .attr("text-anchor", "end")
  .style("font-size", "11px")
  .text("45%");


// Título da legenda
svg.append("text")
  .attr("x", 175)
  .attr("y", height + 43)
  .attr("text-anchor", "middle")
  .style("font-size", "11px")
  .style("font-weight", "bold")
  .text("Percentual de profissionais");
