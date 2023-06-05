import { observable, makeObservable, action } from 'mobx';
import { endpoints } from '../Utils/Constants';
import { get } from 'lodash';

export class StocksStore {
    displayedStock = {};
    activeIndex = 0;
    timeSeriesData = {};
    currentSymbol = "";
    allStocks: any = [];
    constructor() {
        makeObservable(this, {
            displayedStock: observable,
            activeIndex: observable,
            currentSymbol: observable,
            allStocks: observable,
            timeSeriesData: observable,
            init: action,
            getStockDataForSymbol: action,
            fetchedStock: action,
        });
    }

    async init() {
        this.getStockDataForSymbol("IBM");
    }

    /**
    * action getStockDataForSymbol,
    * Comment: Trying to fetch timeseries data and also stock company details
    * Params: symbol- symbol of the company,
    *  fetchStockDetails - flag to fetch company details which is not needed during poll api call
    */
    async getStockDataForSymbol(symbol: string, fetchStockDetails: boolean = true) {
        let timeSeriesEndpoint = endpoints.TIME_SERIES_DATA.replace("symbol=", `symbol=${symbol}`);
        let overviewEndpoint = endpoints.OVERVIEW.replace("symbol=", `symbol=${symbol}`);
        this.currentSymbol = symbol;
        const requests = [fetch(timeSeriesEndpoint).then(resp => resp.json()).catch(e => e)];
        if (fetchStockDetails) {
            requests.push(fetch(overviewEndpoint).then(resp => resp.json()).catch(e => e));
        }
        Promise.all(requests).then((timeSeriesData) => {
            if (fetchStockDetails) {
                this.setStockData(timeSeriesData[0], timeSeriesData[1])
            } else {
                this.setStockData(timeSeriesData[0], {})
            }
        });
    }

    /**
    * action setStockData,
    * Comment: Trying to observables with timeseries data and stock company details
    * Params: timeSeriesData - Time series data, stockDetails - company details
    */
    setStockData(timeSeriesData: any, stockDetails: any) {
        if (Object.keys(timeSeriesData).length && timeSeriesData.status === "ok") {
            this.timeSeriesData = timeSeriesData["values"];
        }
        if (get(stockDetails, "Symbol", "")) {
            this.displayedStock = stockDetails;
            const index = this.allStocks.findIndex(item => item.Symbol === stockDetails.Symbol);
            if (index === -1) {
                this.allStocks.push(stockDetails);
                this.activeIndex = this.allStocks.length - 1;
            } else {
                this.activeIndex = index;
            }
        }
    }

    /**
    * action fetchedStock,
    * Comment: Showing next and previous stocks stored
    * Params: index of the stock
    */
    fetchedStock(index) {
        if (this.allStocks.length > 1) {
            this.activeIndex = index;
            this.displayedStock = this.allStocks[index];
            this.getStockDataForSymbol(this.allStocks[index]["Symbol"], false);
            this.currentSymbol = this.allStocks[index]["Symbol"];
        }
    }
}

export default new StocksStore();
