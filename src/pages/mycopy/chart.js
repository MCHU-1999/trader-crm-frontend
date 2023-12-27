import 'chart.js/auto';
import { useEffect, useState } from 'react';
import { Chart, Bar, Line } from 'react-chartjs-2';


function getGradient(ctx, chartArea, mainColor='#AADCE9') {
  let width, height, gradient;
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (!gradient || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, "rgba(121, 224, 190,0.0)");
    gradient.addColorStop(1, mainColor);
  }

  return gradient;
}

const Diagram = ({data}) => {
  const [ options, setOptions ] = useState({});
  const [ chartData, setChartData ] = useState({
    datasets: [
      {
        label: undefined,
        data: undefined,
      },
    ]
  });

  useEffect(() => {
    setChartData({
      labels: data.chartX,
      datasets: [
        {
          showLine: true,
          borderColor: '#24936E',
          borderWidth: 2.5,
          borderCapStyle: 'round',
          borderJoinStyle: 'round',
          backgroundColor: function(context) {
            const chart = context.chart;
            const {ctx, chartArea} = chart;
            if (!chartArea) {
              // This case happens on initial chart load
              return;
            }
            return getGradient(ctx, chartArea, "#79E0BE");
          },
          hoverBackgroundColor: "rgba(121, 224, 190,0.5)",

          pointBackgroundColor: "rgba(121, 224, 190,0.0)",
          pointBorderColor: "rgba(121, 224, 190,0.0)",
          pointBorderWidth: 0.0,
          pointRadius: 8.0,
          pointStyle: 'circle',

          pointHoverBackgroundColor: "#FFFFFF",
          pointHoverBorderColor: "rgba(121, 224, 190,1)",
          pointHoverBorderWidth: 2,
          pointHoverRadius: 5.0,

          label: `資產變化`,
          // xAxisID: 'Date',
          data: data.chartY,
          lineTension: 0.4,
          fill: true,
        },
      ]
    });
    setOptions({
      plugins:{
        legend: {
          display: false,
          position: 'bottom',
          align: 'end',
        }
      },
      scales: {
        x: {
          ticks: {
            major: {
              enabled: true,
            },
            maxRotation: 0,
            autoskip: true,
            autoSkipPadding: 24,
            color: "#999999",
          },
          grid: {
            display: false,
          },
          border: {
            display: false,
          }
        },
        y: {
          suggestedMin: 0.5*(data.chartY[0]),
          suggestedMax: Math.max(data.chartY) > 1.5*(data.chartY[0]) ? Math.max(data.chartY) * 1.2 : 1.5*(data.chartY[0]),
          ticks: {
            // // Include a dollar sign in the ticks
            // callback: function(value, index, ticks) {
            //   return `${value} U`;
            // },
            maxRotation: 0,
            autoskip: true,
            autoSkipPadding: 10,
            color: "#999999",
            padding: 10,
          },
          grid: {
            color: "#dddddd",
            tickBorderDashOffset: 0,
            tickLength: 0,
          },
          border: {
            dash: [6, 3],
            display: false,
          }
        },
      },
      responsive: true,
      // aspectRatio: 1,
      maintainAspectRatio: false,
    });
  }, [data]);

  return (
    <Chart type='line' data={chartData} options={options}/>
  );
}


export default Diagram;