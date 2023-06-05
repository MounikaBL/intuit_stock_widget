/**
 * Using different apis
 * symbol search and time series data fetch --> api.twelvedata.com
 * company profile(as tweldata profile api is part of premium plan) --> www.alphavantage.co
 */
const apiKey = "2494d793b2404ad2a7b9f4d587237c30";
const API = "https://api.twelvedata.com";
const apiKeyAlpha = "6A0M0KIDHHNHN19L";
const APIAlpha = "https://www.alphavantage.co/query?function="

export const POLLING_INTERVAL = 60000;
export const endpoints = {
    SYMBOL_SEARCH: `${API}/symbol_search?symbol=&source=docs`,
    TIME_SERIES_DATA: `${API}/time_series?symbol=&interval=5min&apikey=${apiKey}&source=docs`,
    PROFILE: `${API}/profile?symbol=&apikey=${apiKey}&source=docs`,
    OVERVIEW: `${APIAlpha}OVERVIEW&symbol=&apikey=${apiKeyAlpha}`
}

export const DEBOUNCE_THRESHOLD = 500;