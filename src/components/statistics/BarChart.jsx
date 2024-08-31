import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
);

function BarChart() {
  const [data, setData] = useState(null); 

  const options = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true, 
        text: '詐騙類型統計（常見詐騙手法）', 
        font: { size: 18 },
        align: 'start',
        padding: { bottom: 20 }
      },
      tooltip: {
        enabled: true
      },
      legend: {
        display: false
      },
      datalabels: {
        display: true,
        align: 'end',
        anchor: 'end',
        formatter: (value) => `${value}`, 
        font: { size: 16 },
        padding: { top: -10 }
      },
    },
    scales: {
      y: {
        beginAtZero: true
      },
      x: {
        ticks: {
          font: { size: 16 }
        }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const newData = {
        labels: ["投資詐騙", "解除分期付款", "網拍詐騙", "愛情交友詐騙", "電話假冒詐騙"],
        datasets: [{
          label: '資料數量',
          data: [10, 19, 3, 5, 2],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      };

      setData(newData); 
    };

    fetchData();
  }, []);

  return (
    <>
      {data ? <Bar data={data} options={options} plugins={[ChartDataLabels]}/> : <p>載入資料中...</p>}
    </>
  );
};

export default BarChart;
