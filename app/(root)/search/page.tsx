import Pagination from '@/components/shared/pagination';
import ProductCard from '@/components/shared/product/product-card';
import { Button } from '@/components/ui/button';
import {
    getAllCategories,
    getAllProducts,
} from '@/lib/actions/product.actions';
import { PRODUCT_CATEGORIES, PRODUCT_MATERIALS, PRODUCT_MEDIUMS, PRODUCT_PRICES, PRODUCT_RATINGS, PRODUCT_SIZES, PRODUCT_STYLES, PRODUCT_SUBJECTS } from '@/lib/constants';
import Link from 'next/link';




const sortOrders = ['newest', 'lowest', 'highest', 'rating'];

export async function generateMetadata(props: {
    searchParams: Promise<{
        q: string;
        category: string;
        price: string;
        rating: string;
    }>;
}) {
    const {
        q = 'all',
        category = 'all',
        price = 'all',
        rating = 'all',
    } = await props.searchParams;

    const isQuerySet = q && q !== 'all' && q.trim() !== '';
    const isCategorySet = category && category !== 'all' && category.trim() !== '';
    const isPriceSet = price && price !== 'all' && price.trim() !== '';
    const isRatingSet = rating && rating !== 'all' && rating.trim() !== '';

    if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
        return {
            title: `Search ${isQuerySet ? q : ''
                }
      ${isCategorySet ? `: Category ${category}` : ''}
      ${isPriceSet ? `: Price ${price}` : ''}
      ${isRatingSet ? `: Rating ${rating}` : ''}`,
        };
    } else {
        return {
            title: 'Search Products',
        };
    }
}

const SearchPage = async (props: {
    searchParams: Promise<{
        style?: string;
        subject?: string;
        medium?: string;
        material?: string;
        size?: string;
        q?: string;
        category?: string;
        price?: string;
        rating?: string;
        sort?: string;
        page?: string;
    }>;
}) => {
    const {
        style = 'all',
        subject = 'all',
        medium = 'all',
        material = 'all',
        size = 'all',
        q = 'all',
        category = 'all',
        price = 'all',
        rating = 'all',
        sort = 'newest',
        page = '1',
    } = await props.searchParams;

    // console.log(q, category, price, rating, sort, page);

    // const categories = await getAllCategories();
    

    // Get products
    const products = await getAllProducts({
        style,
        subject, 
        medium,
        material,
        size,
        category,
        query: q,
        price,
        rating,
        page: Number(page),
        sort,
    });

    // console.log(categories);

    // Construct filter url
    const getFilterUrl = ({
        st,
        su,
        me,
        ma,
        si,
        c,
        s,
        p,
        r,
        pg,
    }: {
        st?: string
        su?: string;
        me?: string;
        ma?: string;
        si?: string;
        c?: string;
        s?: string;
        p?: string;
        r?: string;
        pg?: string;
    }) => {
        const params = { q, style, subject, medium, material, size, category, price, rating, sort, page };

        if (st) params.style = st;
        if (su) params.subject = su;
        if (me) params.medium = me;
        if (ma) params.material = ma;
        if (si) params.size = si;
        if (c) params.category = c;
        if (p) params.price = p;
        if (r) params.rating = r;
        if (pg) params.page = pg;
        if (s) params.sort = s;
        return `/search?${new URLSearchParams(params).toString()}`;
    };


    return (
        <div className='grid md:grid-cols-5 md:gap-5'>

            <div className='filter-links'>


                {/* Category Links */}
                <div className='pb-3 border-b'>
                    <div className='text-2xl uppercase font-serif mt-3 mb-2'>Category</div>
                    <ul className='space-y-1'>
                        <li>
                            <Link
                                className={`${('all' === category || '' === category) && 'font-bold'}`}
                                href={getFilterUrl({ c: 'all' })}
                            >
                                Any
                            </Link>
                        </li>
                        {PRODUCT_CATEGORIES.map((x) => (
                            <li key={x}>
                                <Link
                                    className={`${x === category && 'font-bold'}`}
                                    href={getFilterUrl({ c: x })}
                                >
                                    {x}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Style Links */}
                <div className='pb-3 border-b'>
                    <div className='text-2xl uppercase font-serif mt-3 mb-2'>Style</div>
                    <ul className='space-y-1'>
                        <li>
                            <Link
                                className={`${('all' === style || '' === style) && 'font-bold'
                                    }`}
                                href={getFilterUrl({ st: 'all' })}
                            >
                                Any
                            </Link>
                        </li>
                        {PRODUCT_STYLES.map((x) => (
                            <li key={x}>
                                <Link
                                    className={`${x === style && 'font-bold'}`}
                                    href={getFilterUrl({ st: x })}
                                >
                                    {x}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Subject Links */}
                <div className='pb-3 border-b'>
                    <div className='text-2xl uppercase font-serif mt-3 mb-2'>Subject</div>
                    <ul className='space-y-1'>
                        <li>
                            <Link
                                className={`${('all' === subject || '' === subject) && 'font-bold'
                                    }`}
                                href={getFilterUrl({ su: 'all' })}
                            >
                                Any
                            </Link>
                        </li>
                        {PRODUCT_SUBJECTS.map((x) => (
                            <li key={x}>
                                <Link
                                    className={`${x === subject && 'font-bold'}`}
                                    href={getFilterUrl({ su: x })}
                                >
                                    {x}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>


                {/* Medium Links */}
                <div className='pb-3 border-b'>
                    <div className='text-2xl uppercase font-serif mt-3 mb-2'>Medium</div>
                    <ul className='space-y-1'>
                        <li>
                            <Link
                                className={`${('all' === medium || '' === medium) && 'font-bold'
                                    }`}
                                href={getFilterUrl({ me: 'all' })}
                            >
                                Any
                            </Link>
                        </li>
                        {PRODUCT_MEDIUMS.map((x) => (
                            <li key={x}>
                                <Link
                                    className={`${x === medium && 'font-bold'}`}
                                    href={getFilterUrl({ me: x })}
                                >
                                    {x}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Material Links */}
                <div className='pb-3 border-b'>
                    <div className='text-xl mt-3 mb-2'>Material</div>
                    <ul className='space-y-1'>
                        <li>
                            <Link
                                className={`${('all' === material || '' === material) && 'font-bold'
                                    }`}
                                href={getFilterUrl({ c: 'all' })}
                            >
                                Any
                            </Link>
                        </li>
                        {PRODUCT_MATERIALS.map((x) => (
                            <li key={x}>
                                <Link
                                    className={`${x === material && 'font-bold'}`}
                                    href={getFilterUrl({ ma: x })}
                                >
                                    {x}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>


                {/* Price Links */}
                <div className='pb-3 border-b'>
                    <div className='text-xl mt-8 mb-2'>Price</div>
                    <ul className='space-y-1'>
                        <li>
                            <Link
                                className={`  ${'all' === price && 'font-bold'}`}
                                href={getFilterUrl({ p: 'all' })}
                            >
                                Any
                            </Link>
                        </li>
                        {PRODUCT_PRICES.map((p) => (
                            <li key={p.value}>
                                <Link
                                    href={getFilterUrl({ p: p.value })}
                                    className={`${p.value === price && 'font-bold'}`}
                                >
                                    {p.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Size Links */}
                <div className='pb-3 border-b'>
                    <div className='text-xl mt-3 mb-2'>Size</div>
                    <ul className='space-y-1'>
                        <li>
                            <Link
                                className={`${('all' === size || '' === size) && 'font-bold'
                                    }`}
                                href={getFilterUrl({ si: 'all' })}
                            >
                                Any
                            </Link>
                        </li>
                        {PRODUCT_SIZES.map((x) => (
                            <li key={x}>
                                <Link
                                    className={`${x === size && 'font-bold'}`}
                                    href={getFilterUrl({ si: x })}
                                >
                                    {x}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Rating Links */}
                <div className='pb-3 border-b'>
                    <div className='text-xl mt-8 mb-2'>Rating</div>
                    <ul className='space-y-1'>
                        <li>
                            <Link
                                href={getFilterUrl({ r: 'all' })}
                                className={`  ${'all' === rating && 'font-bold'}`}
                            >
                                Any
                            </Link>
                        </li>
                        {PRODUCT_RATINGS.map((r) => (
                            <li key={r}>
                                <Link
                                    href={getFilterUrl({ r: `${r}` })}
                                    className={`${r.toString() === rating && 'font-bold'}`}
                                >
                                    {`${r} stars & up`}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>


            </div>

            <div className='md:col-span-4 space-y-4'>

                <div className='flex-between flex-col md:flex-row my-4'>
                    <div className='flex items-center'>
                        {q !== 'all' && q !== '' && 'Query : ' + q}
                        {category !== 'all' && category !== '' && '   Category : ' + category}
                        {price !== 'all' && '    Price: ' + price}
                        {rating !== 'all' && '    Rating: ' + rating + ' & up'}
                        &nbsp;
                        {(q !== 'all' && q !== '') ||
                            (category !== 'all' && category !== '') ||
                            rating !== 'all' ||
                            price !== 'all' ? (
                            <Button variant={'link'} asChild>
                                <Link href='/search'>Clear</Link>
                            </Button>
                        ) : null}
                    </div>
                    <div>Sort by: {' '}
                        {sortOrders.map((s) => (
                            <Link
                                key={s}
                                className={`mx-2   ${sort == s && 'font-bold'} `}
                                href={getFilterUrl({ s })}
                            >
                                {s}
                            </Link>
                        ))}</div>
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                    {products!.data.length === 0 && <div>No product found</div>}
                    {products!.data.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                {products!.totalPages! > 1 && (
                    <Pagination page={page} totalPages={products!.totalPages} />
                )}
            </div>
        </div>
    );
};

export default SearchPage;