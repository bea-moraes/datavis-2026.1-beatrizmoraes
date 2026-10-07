// ======================================================
// DIMENSÕES
// ======================================================
var margin = { top: 30, right: 190, bottom: 90, left: 70 },
    width  = 900 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// ======================================================
// DADOS
// Percentual de profissionais de cada grupo de experiência em cada faixa
// salarial (calculado a partir do dataset; cada linha soma 100%).
// ======================================================
var data = [
  { experiencia: "Menos de 1 ano",  n: 346,  "Até R$ 6 mil": 75.7, "R$ 6.001 a R$ 12 mil": 17.1, "Acima de R$ 12 mil": 7.2 },
  { experiencia: "1-2 anos",        n: 944,  "Até R$ 6 mil": 56.5, "R$ 6.001 a R$ 12 mil": 35.2, "Acima de R$ 12 mil": 8.4 },
  { experiencia: "3-4 anos",        n: 1386, "Até R$ 6 mil": 19.6, "R$ 6.001 a R$ 12 mil": 55.2, "Acima de R$ 12 mil": 25.2 },
  { experiencia: "5-6 anos",        n: 830,  "Até R$ 6 mil": 5.2,  "R$ 6.001 a R$ 12 mil": 35.5, "Acima de R$ 12 mil": 59.3 },
  { experiencia: "7-10 anos",       n: 542,  "Até R$ 6 mil": 4.1,  "R$ 6.001 a R$ 12 mil": 26.4, "Acima de R$ 12 mil": 69.6 },
  { experiencia: "Mais de 10 anos", n: 585,  "Até R$ 6 mil": 2.1,  "R$ 6.001 a R$ 12 mil": 14.4, "Acima de R$ 12 mil": 83.6 }
];

var keys = ["Até R$ 6 mil", "R$ 6.001 a R$ 12 mil", "Acima de R$ 12 mil"];

var color = d3.scaleOrdinal().domain(keys).range(d3.schemeSet2);

function formatar(v) {
  return v.toFixed(1).replace(".", ",") + "%";
}

// ======================================================
// EIXOS
// ======================================================
// scalePoint: experiência é categórica e ordenada (sem valores intermediários).
var x = d3.scalePoint()
  .domain(data.map(function(d) { return d.experiencia; }))
  .range([0, width])
  .padding(0.5);

var y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

// Grade horizontal
svg.append("g")
  .attr("class", "grid")
  .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(""))
  .select(".domain").remove();

svg.append("g")
  .call(d3.axisLeft(y).ticks(5).tickFormat(function(d) { return d + "%"; }));

svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Número de respondentes de cada grupo (n)
svg.selectAll(".nGrupo")
  .data(data)
  .enter()
  .append("text")
    .attr("class", "nGrupo")
    .attr("x", function(d) { return x(d.experiencia); })
    .attr("y", height + 32)
    .attr("text-anchor", "middle")
    .style("font-size", "11px")
    .style("fill", "#777")
    .text(function(d) {
      return d.n == null ? "" : "n = " + d.n.toLocaleString("pt-BR");
    });

svg.append("text")
  .attr("text-anchor", "middle")
  .attr("x", width / 2)
  .attr("y", height + 70)
  .text("Tempo de experiência na área de dados");

svg.append("text")
  .attr("text-anchor", "middle")
  .attr("x", width / 2)
  .attr("y", height + 88)
  .style("font-size", "11px")
  .style("fill", "#777")
  .text("n = número de respondentes em cada grupo de experiência");

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("text-anchor", "middle")
  .attr("x", -height / 2)
  .attr("y", -50)
  .text("Percentual de profissionais");

// ======================================================
// LINHAS, MARCADORES E RÓTULOS (uma série por faixa salarial)
// ======================================================
keys.forEach(function(key) {

  var linha = d3.line()                       // curveLinear: segmentos retos
    .x(function(d) { return x(d.experiencia); })
    .y(function(d) { return y(d[key]); });

  var corTexto = d3.color(color(key)).darker(0.8);

  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", color(key))
    .attr("stroke-width", 3)
    .attr("d", linha);

  svg.selectAll(".ponto-" + keys.indexOf(key))
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "ponto-" + keys.indexOf(key))
      .attr("cx", function(d) { return x(d.experiencia); })
      .attr("cy", function(d) { return y(d[key]); })
      .attr("r", 5.5)
      .style("fill", color(key))
      .style("stroke", "white")
      .style("stroke-width", 1.5)
    .append("title")
      .text(function(d) { return key + ", " + d.experiencia + ": " + formatar(d[key]); });

  // Valor em cada ponto (abaixo do ponto na faixa mais baixa, quando há espaço)
  svg.selectAll(".valor-" + keys.indexOf(key))
    .data(data)
    .enter()
    .append("text")
      .attr("class", "valor-" + keys.indexOf(key))
      .attr("x", function(d) { return x(d.experiencia); })
      .attr("y", function(d) {
        var abaixo = key === keys[0] && d[key] >= 12;
        return y(d[key]) + (abaixo ? 20 : -11);
      })
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-weight", "bold")
      .style("fill", corTexto)
      .style("stroke", "white")
      .style("stroke-width", 3)
      .style("paint-order", "stroke")
      .text(function(d) { return formatar(d[key]); });

  // Nome da faixa no fim da linha (substitui a legenda)
  var ultimo = data[data.length - 1];
  svg.append("text")
    .attr("x", x(ultimo.experiencia) + 16)
    .attr("y", y(ultimo[key]) + 4)
    .style("fill", corTexto)
    .text(key);
});
