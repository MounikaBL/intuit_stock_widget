import React, { useCallback, useEffect } from 'react'
import SearchBox from './Components/SearchBox';
import { LineChart } from './Components/LineChart';
import StockCard from './Components/StockCard';
import { useStore } from './Stores';
import './App.css';
import { POLLING_INTERVAL } from './Utils/Constants';
import ErrorBoundary from "./Components/ErrorBoundary";

export default function App() {
  const { stocksStore } = useStore();

  useEffect(() => {
    // Fetch initial stock data
    // stocksStore.init();
  }, []);

  /**
  * memoized updateState,
  * Comment: Polling added for data fetch for every POLLING_INTERVAL
  */
  const updateState = useCallback(async () => {
    if (stocksStore.currentSymbol) {
      stocksStore.getStockDataForSymbol(stocksStore.currentSymbol, false);
    }
  }, []);

  useEffect(() => {
    setInterval(updateState, POLLING_INTERVAL);
  }, [updateState]);

  return (
    <ErrorBoundary>
      <div className="App">
        <SearchBox />
        <div className='stock__main'>
          <div className="stock__chart">
            <LineChart />
          </div>
          <div className="stock__card">
            <StockCard />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
