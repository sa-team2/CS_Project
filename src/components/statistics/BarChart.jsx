import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { db } from '../../firebase';  
import { collection, getDocs } from 'firebase/firestore';

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
      try {
        const querySnapshot = await getDocs(collection(db, 'Outcome'));
        const matchTypeCount = {}; 

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const matches = data.PythonResult?.Match; 

          if (matches) {
            matches.forEach(match => {
              const matchType = match.MatchType;
              if (matchTypeCount[matchType]) {
                matchTypeCount[matchType] += 1; 
              } else {
                matchTypeCount[matchType] = 1; 
              }
            });
          }
        });

        const sortedMatchTypes = Object.entries(matchTypeCount)
          .sort((a, b) => b[1] - a[1]); 

        const topFive = sortedMatchTypes.slice(0, 5); 
        const labels = topFive.map(item => item[0]);
        const datasetData = topFive.map(item => item[1]);

        const newData = {
          labels,
          datasets: [{
            label: '資料數量',
            data: datasetData,
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
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {data ? <Bar data={data} options={options} plugins={[ChartDataLabels]}/> : <p>載入資料中...</p>}
    </>
  );
}

export default BarChart;
