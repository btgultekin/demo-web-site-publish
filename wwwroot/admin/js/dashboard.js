document.addEventListener("DOMContentLoaded", () => {
  const data = window.adminDashboardData;
  if (!data || typeof ApexCharts === "undefined") return;

  const visitsEl = document.querySelector("#chart-visits");
  if (visitsEl) {
    const visitsChart = new ApexCharts(visitsEl, {
      chart: {
        type: "area",
        height: 320,
        fontFamily: "inherit",
        toolbar: { show: false }
      },
      series: [
        { name: "Sayfa Görüntüleme", data: data.visits || [] },
        { name: "Tekil Ziyaretçi", data: data.uniqueVisitors || [] }
      ],
      xaxis: { categories: data.labels || [] },
      colors: ["#206bc4", "#2fb344"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.35,
          opacityTo: 0.05
        }
      },
      stroke: { curve: "smooth", width: 2 },
      dataLabels: { enabled: false },
      grid: { strokeDashArray: 4 },
      legend: { position: "top" }
    });
    visitsChart.render();
  }

  const topPagesEl = document.querySelector("#chart-top-pages");
  if (topPagesEl) {
    const topPagesChart = new ApexCharts(topPagesEl, {
      chart: {
        type: "bar",
        height: 320,
        fontFamily: "inherit",
        toolbar: { show: false }
      },
      series: [{ name: "Görüntülenme", data: data.topPageViews || [] }],
      xaxis: { categories: data.topPageLabels || [] },
      colors: ["#f76707"],
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: "45%",
          horizontal: true
        }
      },
      dataLabels: { enabled: false },
      grid: { strokeDashArray: 4 }
    });
    topPagesChart.render();
  }

  const seoScoreEl = document.querySelector("#chart-seo-score");
  if (seoScoreEl) {
    const score = Number(data.averageSeoScore || 0);
    const seoChart = new ApexCharts(seoScoreEl, {
      chart: {
        type: "radialBar",
        height: 180,
        fontFamily: "inherit",
        sparkline: { enabled: true }
      },
      series: [score],
      colors: [score >= 80 ? "#2fb344" : score >= 60 ? "#f59f00" : "#d63939"],
      plotOptions: {
        radialBar: {
          hollow: { size: "60%" },
          dataLabels: {
            name: { show: false },
            value: {
              fontSize: "24px",
              formatter: (val) => `${Math.round(val)}`
            }
          }
        }
      },
      labels: ["SEO"]
    });
    seoChart.render();
  }
});
