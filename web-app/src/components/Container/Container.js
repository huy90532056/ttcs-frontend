import Directory from "./Directory/Directory";
import FlashSale from "./FlashSale/FlashSale";
import GiftBanner from "./GiftBanner/GiftBanner";
import Outstanding from "./Outstanding/Outstanding";
import SearchingTrend from "./SearchingTrend/SearchingTrend";
import ShopeeMall from "./ShopeeMall/ShopeeMall";
import Slider from "./Slider/Slider";
import TodaySuggestion from "./TodaySuggestion/TodaySuggestion";


function Container() {
    return (
        <div id="container">
            <Slider></Slider>
            <GiftBanner></GiftBanner>
            <Outstanding></Outstanding>
            <Directory></Directory>
            <FlashSale></FlashSale>
            <ShopeeMall></ShopeeMall>
            <SearchingTrend></SearchingTrend>
            <TodaySuggestion></TodaySuggestion>
        </div>
    );
}

export default Container;