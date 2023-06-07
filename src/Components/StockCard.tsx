import { useStore } from '../Stores';
import { get } from "lodash";
import { observer } from 'mobx-react-lite';
import ErrorBoundary from './ErrorBoundary';

/**
* component StockCard,
* Comment: Displays the card with stock details including name, description, current price etc..
*/
const StockCard = observer(() => {
    const { stocksStore } = useStore();
    const company: any = stocksStore.displayedStock;
    const timeSeriesData = stocksStore.timeSeriesData;
    let currPrice: number = parseFloat(get(timeSeriesData, `[0][close]`, "")) > parseFloat(company["52WeekHigh"]) ?
        parseFloat(company["52WeekHigh"]) : parseFloat(get(timeSeriesData, `[0][close]`, ""));
    return (
        <ErrorBoundary>
            {Object.keys(company).length ?
                <div className="stock__card__content">
                    <p className="stock__card__title">{company.Name + " : " + company.Symbol}</p>
                    <p>About Company: {company.Description}</p>
                    <div className="slide__container">
                        <div className='week__high__low'>
                            <div>52 weeks low</div>
                            <div>52 weeks high</div>
                        </div>
                        <input type="range"
                            min={parseFloat(company["52WeekLow"])}
                            max={parseFloat(company["52WeekHigh"])}
                            title={"Current price: " + currPrice}
                            value={currPrice}
                            className="slider"
                            disabled
                        />
                        <div className='week__high__low'>
                            <div>{company["52WeekLow"]}</div>
                            <div>{company["52WeekHigh"]}</div>
                        </div>
                    </div>
                    <p>Current price: {currPrice}</p>
                    <p>Exchange: {company.Exchange}</p>
                    <p>Industry: {company.Industry}</p>
                    <p>PERatio: {company.PERatio}</p>
                    <p>MarketCapitalization: {company.MarketCapitalization}</p>
                </div> : <div className='no__data'>No data available</div>}
        </ErrorBoundary>
    );
});

export default StockCard;
