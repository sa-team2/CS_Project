import React from 'react'
import Navbar from '../navbar/Navbar';
import Cards from './Cards';
import BarChart from './BarChart'
import PieChart from './PieChart';
import { Helmet } from 'react-helmet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';
import './Statistics.css';

const Statistics = () => {
  return (
    <>
      <Helmet>
          <title>統計圖表</title>
      </Helmet>
      <Navbar />
      <div className='statistics-container'>
        <h3 className="statistics-page-title">
          <FontAwesomeIcon icon={ faChartColumn } /> 統計圖表
        </h3>
        <div className="cards-container">
          <Cards />
        </div>
        <div className="charts-container">
          <div className="bar-chart">
            <BarChart />
          </div>
          <div className="pie-chart">
            <PieChart />
          </div>
        </div>
      </div>
    </>
  )
}

export default Statistics;