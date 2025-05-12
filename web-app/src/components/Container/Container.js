import Directory from "./Directory/Directory";
import GiftBanner from "./GiftBanner/GiftBanner";
import Outstanding from "./Outstanding/Outstanding";
import Slider from "./Slider/Slider";


function Container() {
    return (
        <div id="container">
            <Slider></Slider>
            <GiftBanner></GiftBanner>
            <Outstanding></Outstanding>
            <Directory></Directory>
        </div>
    );
}

export default Container;