// Dimensões
var margin = {
    top: 20,
    right: 160,
    bottom: 20,
    left: 80
  },
  width = 750 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;


// SVG
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr(
      "transform",
      "translate(" + margin.left + "," + margin.top + ")"
    );


// Cores
var color = d3.scaleOrdinal()
  .domain([
    "Júnior",
    "Pleno",
    "Sênior",
    "Até R$ 6 mil",
    "R$ 6.001 a R$ 12 mil",
    "Acima de R$ 12 mil"
  ])
  .range([
    "#8dd3c7",
    "#80b1d3",
    "#bebada",
    "#fb8072",
    "#fdb462",
    "#b3de69"
  ]);


// Configuração Sankey
var sankey = d3.sankey()
  .nodeWidth(30)
  .nodePadding(25)
  .size([width, height]);


// ===============================
// DADOS
// ===============================

var graph = {

  nodes: [

    // Senioridade
    { name: "Júnior" },
    { name: "Pleno" },
    { name: "Sênior" },

    // Faixas salariais
    { name: "Até R$ 6 mil" },
    { name: "R$ 6.001 a R$ 12 mil" },
    { name: "Acima de R$ 12 mil" }

  ],

  links: [

    // JÚNIOR
    {
      source: 0,
      target: 3,
      value: 83.9
    },
    {
      source: 0,
      target: 4,
      value: 14.7
    },
    {
      source: 0,
      target: 5,
      value: 1.4
    },

    // PLENO
    {
      source: 1,
      target: 3,
      value: 32.2
    },
    {
      source: 1,
      target: 4,
      value: 58.5
    },
    {
      source: 1,
      target: 5,
      value: 9.3
    },

    // SÊNIOR
    {
      source: 2,
      target: 3,
      value: 3.5
    },
    {
      source: 2,
      target: 4,
      value: 39.7
    },
    {
      source: 2,
      target: 5,
      value: 56.8
    }

  ]
};


// Cria o layout
sankey
  .nodes(graph.nodes)
  .links(graph.links)
  .layout(32);


// ===============================
// LINKS
// ===============================

var link = svg.append("g")
  .selectAll(".link")
  .data(graph.links)
  .enter()
  .append("path")
    .attr("class", "link")
    .attr("d", sankey.link())
    .style("stroke-width", function(d) {
      return Math.max(1, d.dy);
    })
    .sort(function(a, b) {
      return b.dy - a.dy;
    });


// Tooltip dos links
link.append("title")
  .text(function(d) {

    return d.source.name +
      " → " +
      d.target.name +
      "\n" +
      d.value.toFixed(1) +
      "%";

  });


// ===============================
// NÓS
// ===============================

var node = svg.append("g")
  .selectAll(".node")
  .data(graph.nodes)
  .enter()
  .append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });


// Retângulos
node.append("rect")
  .attr("height", function(d) {
    return d.dy;
  })
  .attr("width", sankey.nodeWidth())
  .style("fill", function(d) {
    return color(d.name);
  })
  .style("stroke", function(d) {
    return d3.rgb(color(d.name)).darker(1);
  });


// Tooltip dos nós
node.append("title")
  .text(function(d) {
    return d.name;
  });


// ===============================
// TEXTOS
// ===============================

node.append("text")
  .attr("x", -6)
  .attr("y", function(d) {
    return d.dy / 2;
  })
  .attr("dy", ".35em")
  .attr("text-anchor", "end")
  .text(function(d) {
    return d.name;
  })

  // Para os nós da esquerda,
  // coloca o texto depois do retângulo
  .filter(function(d) {
    return d.x < width / 2;
  })
  .attr("x", 6 + sankey.nodeWidth())
  .attr("text-anchor", "start");
