import stocksStore, { StocksStore } from './StocksStore';

export type RootStore = {
    stocksStore: StocksStore;
}

const rootStore: RootStore = {
    stocksStore,
};

export default rootStore;