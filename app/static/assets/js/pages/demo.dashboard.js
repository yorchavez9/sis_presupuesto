!(function (r) {
    "use strict";
    function e() {
      (this.$body = r("body")), (this.charts = []);
    }
  
    (e.prototype.initCharts = function () {
      window.Apex = {
        chart: { parentHeightOffset: 0, toolbar: { show: !1 } },
        grid: { padding: { left: 0, right: 0 } },
        colors: ["#727cf5", "#0acf97", "#fa5c7c", "#ffbc00"],
      };
  
      // Gráfico de Presupuestos vs Real
      $.ajax({
        url: "presupuestos-vs-real/", // Asegúrate que esta ruta coincida con tu URL
        method: "GET",
        success: function (response) {
            console.log(response);
          var colors = ["#727cf5", "#0ACF97"];
          var t = r("#high-performing-product").data("colors");
          colors = t ? t.split(",") : colors;
  
          var options = {
            chart: {
              height: 350,
              type: "bar",
              toolbar: { show: false },
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: "55%",
                endingShape: "rounded",
              },
            },
            dataLabels: { enabled: false },
            stroke: {
              show: true,
              width: 2,
              colors: ["transparent"],
            },
            series: [
              { name: "Presupuestos Creados", data: response.proyectado },
              { name: "Presupuestos Aprobados", data: response.real },
            ],
            colors: colors,
            xaxis: {
              categories: response.labels,
              axisBorder: { show: false },
              labels: {
                style: {
                  colors: "#8392a5",
                  fontSize: "12px",
                },
              },
            },
            yaxis: {
              title: {
                text: "Cantidad de Presupuestos",
                style: {
                  color: "#8392a5",
                  fontSize: "12px",
                },
              },
              labels: {
                style: {
                  colors: "#8392a5",
                },
              },
            },
            tooltip: {
              y: {
                formatter: function (e) {
                  return e;
                },
              },
            },
            legend: {
              position: "top",
              horizontalAlign: "right",
            },
          };
  
          new ApexCharts(
            document.querySelector("#data_presupuestos_grafico"),
            options
          ).render();
        },
        error: function (xhr, status, error) {
          console.error("Error al cargar datos:", error);
          // Datos de ejemplo en caso de error
          var options = {
            chart: {
              height: 350,
              type: "bar",
              toolbar: { show: false },
            },
            series: [
              { name: "Presupuestos Creados", data: [30, 40, 45, 50, 49, 60] },
              { name: "Presupuestos Aprobados", data: [20, 30, 35, 40, 39, 45] },
            ],
            xaxis: {
              categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            },
          };
          new ApexCharts(
            document.querySelector("#high-performing-product"),
            options
          ).render();
        },
      });

      // Gráfica de dona para mostrar estados de documentos
      $.ajax({
        url: "materiales-mas-utilizados/",
        method: "GET",
        success: function(response) {
            var options = {
                chart: { height: 350, type: "donut" },
                series: response.series,
                labels: response.labels,
                colors: response.colors,
                legend: { position: "bottom" },
                tooltip: {
                    y: { formatter: function(value) { return value + " unidades"; } }
                }
            };
            new ApexCharts(document.querySelector("#grafico_donas_materiales_mas_vendidos"), options).render();
            
            // Actualizar leyenda
            var legendHtml = '';
            response.labels.forEach((label, i) => {
                legendHtml += `<p><i class="mdi mdi-square" style="color:${response.colors[i]}"></i> ${label} <span class="float-end">${response.series[i]}</span></p>`;
            });
            $(".chart-widget-list").html(legendHtml);
        }
    });
      
    }),
    
    (e.prototype.init = function () {
      this.initCharts();
    }),
    
    (r.Dashboard = new e()),
    (r.Dashboard.Constructor = e);
  })(window.jQuery);
  
  (function (t) {
    "use strict";
    t(document).ready(function (e) {
      t.Dashboard.init();
    });
  })(window.jQuery);