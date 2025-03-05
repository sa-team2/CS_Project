import React from 'react'
import Cards from './Cards';
import BarChart from './BarChart'
import PieChart from './PieChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';
import styles from './Statistics.module.css';

const Statistics = () => {
  return (
    <>
      <div className={styles.statisticsContainer}>
        <div className={styles.statisticsMain}>
          <h3 className={styles.statisticsPageTitle}>
            <FontAwesomeIcon icon={ faChartColumn } /> 統計圖表
          </h3>
          <p className={styles.statisticsSubTitle}>透過檢測後的資料，統計了資料數量、熱門詐騙類型、及詐騙類型占比，讓您快速掌握詐騙趨勢，提高防範意識。</p>
        </div>
        <div className={styles.cardsContainer}>
          <Cards />
        </div>
        <div className={styles.chartsContainer}>
          <div className={styles.barChart}>
            <BarChart />
          </div>
          <div className={styles.pieChart}>
            <PieChart />
          </div>
        </div>
      </div>
    </>
  )
}

export default Statistics;