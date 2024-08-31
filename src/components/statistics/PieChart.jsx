import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    Title
);

function PieChart() {
  const [data, setData] = useState(null); 

  const options = {
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true, 
            text: '資料數量占比', 
            font: { size: 18 },
            align: 'start',
            padding: { bottom: 20 }
        },
        tooltip: {
            enabled: true,
            callbacks: {
                label: function(tooltipItem) {
                    return `資料占比: ${tooltipItem.raw}%`;
                }
            }
        },
        legend: {
            display: true, 
            position: 'top',
            labels: {
              font: { size: 16 }
            }
        },
        datalabels: {
          display: true,
          align: 'end',
          anchor: 'top',
          formatter: (value) => `${value}%`, 
          font: { size: 24 }
        }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const newData = {
        labels: ["投資詐騙", "解除分期付款", "網拍詐騙", "愛情交友詐騙", "電話假冒詐騙", "其他"],
        datasets: [{
            label: '資料占比',
            data: [20, 38, 11, 15, 10, 6],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(128, 128, 128, 0.2)'
              ],
              borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(128, 128, 128, 1)'
              ],
          }]
      };

      setData(newData); 
    };

    fetchData();
  }, []);

  return (
    <>
      {data ? <Pie data={data} options={options} plugins={[ChartDataLabels]}/> : <p>載入資料中...</p>}
    </>
  );
};

export default PieChart;
