
import { ProductCarousel } from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import ViewAllProductsButton from "@/components/view-all-products-button";
import { getFeaturedProducts, getLatestProducts } from "@/lib/actions/product.actions";

const Homepage = async () => {

  const latestProducts = await getLatestProducts();

  const featuredProducts = await getFeaturedProducts();

  return (
    <div>
      {featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} />}

      <ProductList title='Newest Arrivals' data={latestProducts} />
      <ViewAllProductsButton />
    </div>
  );
}

export default Homepage;




