import { observer } from "mobx-react-lite";
import { useState, useRef } from "react";
import { DEBOUNCE_THRESHOLD, endpoints } from "../Utils/Constants";
import { useStore } from "../Stores";
import ErrorBoundary from "./ErrorBoundary";
import { get } from "lodash";

/**
* AutoComplete functional component,
* Comment: To display auto complete search box with suggestions
*/
const AutoComplete = observer(() => {
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionIndex, setSuggestionIndex] = useState(0);
    const [suggestionsActive, setSuggestionsActive] = useState(false);
    const [value, setValue] = useState("");
    const timeoutHandler = useRef(null);
    const { stocksStore } = useStore();

    /**
     * function handleClick,
     * Params: event,
     * Comment: calls the symbol search API on click of auto suggested list
     */
    const handleClick = (e: any) => {
        const [symbol, name] = e.target.innerText.split(" - ");
        setValue(name);
        stocksStore.getStockDataForSymbol(symbol);
        setSuggestionsActive(false);
    };

    /**
     * function handleKeyDown,
     * Params: event,
     * Comment: calls the symbol search API on clicking enter on auto suggested list item
     */
    const handleKeyDown = (e: any) => {
        e.stopPropagation();
        if (e.keyCode === 38) {
            if (suggestionIndex === 0) {
                // Up arrow click to change active list item
                setSuggestionIndex(suggestions.length - 1)
            } else {
                setSuggestionIndex(suggestionIndex - 1);
            }
        } else if (e.keyCode === 40) {
            // Down arrow click to change active list item
            if (suggestionIndex === suggestions.length - 1) {
                setSuggestionIndex(0)
            } else {
                setSuggestionIndex(suggestionIndex + 1);
            }
        } else if (e.keyCode === 13) {
            // Click enter to call API
            setValue(get(suggestions, `[${suggestionIndex}]["instrument_name"]`, ""));
            stocksStore.getStockDataForSymbol(get(suggestions, `[${suggestionIndex}]["symbol"]`, ""))
            setSuggestionIndex(0);
            setSuggestionsActive(false);
        }
    };

    /**
    * function Suggestions,
    * Params: event,
    * Comment: Display suggestions from API response based on user search string
    */
    const Suggestions = () => {
        return (
            <ul className="suggestions">
                {suggestions && suggestions.length > 0 ?
                    suggestions.map((suggestion, index) => {
                        return (
                            <li
                                className={index === suggestionIndex ? "active" : ""}
                                key={index}
                                onClick={handleClick}
                            >
                                {`${suggestion["symbol"]} - ${suggestion["instrument_name"]}`}
                            </li>
                        );
                    }) : (value.length ? <li>Stocks not found</li> : "")}
            </ul>
        );
    };

    /**
    * function handleChange,
    * Params: value,
    * Comment: Debounce call to avoid fetching suggestions for every entered chanacter and 
    * getting called when once after DEBOUNCE_THRESHOLD
    */
    const handleChange = (value) => {
        setValue(value);
        if (timeoutHandler.current) {
            clearTimeout(timeoutHandler.current);
        }
        timeoutHandler.current = setTimeout(() => {
            let endpoint: string = endpoints.SYMBOL_SEARCH.replace("symbol=", `symbol=${value}`);
            if (value.length) {
                fetch(endpoint)
                    .then((res) => res.json())
                    .then((json) => {
                        setSuggestions(json.data)
                        setSuggestionsActive(true);
                    });
            } else {
                setSuggestions([]);
            }
        }, DEBOUNCE_THRESHOLD) as any;
    };
    return (
        <ErrorBoundary>
            <div className="auto__complete">
                <input
                    type="text"
                    placeholder="Search here..."
                    value={value}
                    className="search__box"
                    onChange={(e) => {
                        e.stopPropagation();
                        handleChange(e.target.value)
                    }}
                    onKeyDown={handleKeyDown}
                    onBlur={() => { setTimeout(() => setSuggestionsActive(false), 500) }}
                    onFocus={() => { setSuggestionsActive(true) }}
                />
                {suggestionsActive && <Suggestions />}

                <div className="next__prev__stock">

                    <div className="previous__stock" onClick={() => {
                        let index = stocksStore.activeIndex - 1;
                        stocksStore.fetchedStock(index);
                    }}>
                        {stocksStore.allStocks.length &&
                            stocksStore.activeIndex !== 0 ? "◀ Previous" : ""}
                    </div>

                    <div className="next__stock" onClick={() => {
                        let index = stocksStore.activeIndex + 1;
                        stocksStore.fetchedStock(index);
                    }}>
                        {stocksStore.allStocks.length &&
                            stocksStore.activeIndex !== stocksStore.allStocks.length - 1 ? "Next ▶" : ""}
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );

});

export default AutoComplete;