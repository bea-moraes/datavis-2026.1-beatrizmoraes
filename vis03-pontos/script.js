// ======================================================
// CORES
// ======================================================

var corMulheres = "#7B2CBF";  
var corHomens   = "#F47B20";  
var corLinha    = "#999";


// ======================================================
// DADOS
// ======================================================

var dados = {

  "JÚNIOR": [

    {
      faixa: "Até R$ 6 mil",
      mulheres: 82.2,
      homens: 84.6
    },

    {
      faixa: "R$ 6.001–12 mil",
      mulheres: 16.1,
      homens: 14.3
    },

    {
      faixa: "Acima de R$ 12 mil",
      mulheres: 1.7,
      homens: 1.1
    }

  ],


  "PLENO": [

    {
      faixa: "Até R$ 6 mil",
      mulheres: 30.9,
      homens: 32.8
    },

    {
      faixa: "R$ 6.001–12 mil",
      mulheres: 63.1,
      homens: 56.7
    },

    {
      faixa: "Acima de R$ 12 mil",
      mulheres: 6.0,
      homens: 10.5
    }

  ],


  "SÊNIOR": [

    {
      faixa: "Até R$ 6 mil",
      mulheres: 4.2,
      homens: 3.2
    },

    {
      faixa: "R$ 6.001–12 mil",
      mulheres: 49.6,
      homens: 36.9
    },

    {
      faixa: "Acima de R$ 12 mil",
      mulheres: 46.3,
      homens: 59.9
    }

  ]

};


// ======================================================
// TAMANHO DE CADA GRÁFICO
// ======================================================

var margin = {
  top: 55,
  right: 25,
  bottom: 65,
  left: 135
};

var width = 400 - margin.left - margin.right;
var height = 390 - margin.top - margin.bottom;


// ======================================================
// SVG PRINCIPAL
// ======================================================

// Cada gráfico terá aproximadamente 400px de largura.

var totalWidth = 1200;

var svgPrincipal = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", totalWidth)
  .attr("height", 440);


// ======================================================
// FUNÇÃO QUE CRIA CADA GRÁFICO
// ======================================================

function criarGrafico(senioridade, data, indice) {

  // Cada senioridade fica em uma posição horizontal diferente
  var deslocamentoX = indice * 400;


  var svg = svgPrincipal
    .append("g")
    .attr(
      "transform",
      "translate(" +
      (deslocamentoX + margin.left) +
      "," +
      margin.top +
      ")"
    );


  // ====================================================
  // TÍTULO DA SENIORIDADE
  // ====================================================

  svg.append("text")

    .attr("x", width / 2)
    .attr("y", -30)

    .attr("text-anchor", "middle")

    .style("font-size", "20px")
    .style("font-weight", "bold")

    .text(senioridade);


  // ====================================================
  // EIXO X
  // ====================================================

  var x = d3.scaleLinear()

    .domain([0, 100])

    .range([0, width]);


  svg.append("g")

    .attr(
      "transform",
      "translate(0," + height + ")"
    )

    .call(

      d3.axisBottom(x)

        .tickValues([0, 25, 50, 75, 100])

        .tickFormat(function(d) {
          return d + "%";
        })

    );


  // ====================================================
  // GRID VERTICAL
  // ====================================================

  svg.append("g")

    .attr("class", "grid")

    .call(

      d3.axisBottom(x)

        .tickValues([0, 25, 50, 75, 100])

        .tickSize(height)

        .tickFormat("")

    )

    .selectAll("line")

      .attr("stroke", "#ddd")

      .attr("stroke-dasharray", "3,3");


  // remove linha horizontal do grid
  svg.select(".grid .domain")
    .remove();


  // ====================================================
  // TÍTULO EIXO X
  // ====================================================

  svg.append("text")

    .attr("x", width / 2)

    .attr("y", height + 55)

    .attr("text-anchor", "middle")

    .style("font-size", "12px")

    .text("Percentual de profissionais");


  // ====================================================
  // EIXO Y
  // ====================================================

  var y = d3.scaleBand()

    .range([0, height])

    .domain(

      data.map(function(d) {
        return d.faixa;
      })

    )

    .padding(1);


  svg.append("g")

    .call(

      d3.axisLeft(y)
        .tickSize(0)

    )

    .selectAll("text")

      .style("font-size", "12px");


  // remove linha vertical do eixo Y
  svg.selectAll(".domain")
    .filter(function(d, i) {

      return this.parentNode !== null;

    });


  // ====================================================
  // LINHAS ENTRE MULHERES E HOMENS
  // ====================================================

  svg.selectAll(".linha")

    .data(data)

    .enter()

    .append("line")

      .attr("class", "linha")

      .attr("x1", function(d) {
        return x(d.mulheres);
      })

      .attr("x2", function(d) {
        return x(d.homens);
      })

      .attr("y1", function(d) {
        return y(d.faixa);
      })

      .attr("y2", function(d) {
        return y(d.faixa);
      })

      .attr("stroke", corLinha)

      .attr("stroke-width", 3);


  // ====================================================
  // PONTOS DAS MULHERES
  // ====================================================

  svg.selectAll(".mulheres")

    .data(data)

    .enter()

    .append("circle")

      .attr("class", "mulheres")

      .attr("cx", function(d) {
        return x(d.mulheres);
      })

      .attr("cy", function(d) {
        return y(d.faixa);
      })

      .attr("r", 8)

      .style("fill", corMulheres);


  // ====================================================
  // PONTOS DOS HOMENS
  // ====================================================

  svg.selectAll(".homens")

    .data(data)

    .enter()

    .append("circle")

      .attr("class", "homens")

      .attr("cx", function(d) {
        return x(d.homens);
      })

      .attr("cy", function(d) {
        return y(d.faixa);
      })

      .attr("r", 8)

      .style("fill", corHomens);


  // ====================================================
  // VALORES DAS MULHERES
  // ====================================================

  svg.selectAll(".valorMulheres")

    .data(data)

    .enter()

    .append("text")

      .attr("class", "valorMulheres")

      .attr("x", function(d) {
        return x(d.mulheres);
      })

      .attr("y", function(d) {
        return y(d.faixa) - 14;
      })

      .attr("text-anchor", "middle")

      .style("font-size", "11px")

      .style("font-weight", "bold")

      .style("fill", corMulheres)

      .text(function(d) {

        return d.mulheres
          .toFixed(1)
          .replace(".", ",") + "%";

      });


  // ====================================================
  // VALORES DOS HOMENS
  // ====================================================

  svg.selectAll(".valorHomens")

    .data(data)

    .enter()

    .append("text")

      .attr("class", "valorHomens")

      .attr("x", function(d) {
        return x(d.homens);
      })

      .attr("y", function(d) {
        return y(d.faixa) + 23;
      })

      .attr("text-anchor", "middle")

      .style("font-size", "11px")

      .style("font-weight", "bold")

      .style("fill", "#D95D00")

      .text(function(d) {

        return d.homens
          .toFixed(1)
          .replace(".", ",") + "%";

      });

}


// ======================================================
// CRIAR OS TRÊS GRÁFICOS
// ======================================================

Object.keys(dados).forEach(function(senioridade, indice) {

  criarGrafico(
    senioridade,
    dados[senioridade],
    indice
  );

});
