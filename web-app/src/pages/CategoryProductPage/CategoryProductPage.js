import Banner from "../../components/CategoryProduct/Banner/Banner";
import CategoryProductItems from "../../components/CategoryProduct/CategoryProductItems/CategoryProduct";
import ShopeeMallHeader from "../../components/CategoryProduct/ShopeeMallHeader/ShopeeMallHeader";
import NewHeader from "../../components/header";

function CategoryProductPage() {
    return (
        <div id="container">
            <NewHeader></NewHeader>
            <Banner></Banner>
            <ShopeeMallHeader></ShopeeMallHeader>
            <CategoryProductItems></CategoryProductItems>
        </div>
    );
}

export default CategoryProductPage;