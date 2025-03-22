export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'AnaArt';
export const APP_DESCRIPTION =
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
    'A modern store built with Next.js';
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';


export const LATEST_PRODUCTS_LIMIT =
    Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;



export const signInDefaultValues = {
    email: "",
    password: "",
};

export const signUpDefaultValues = {
    name: '',
    images: [],
    email: '',
    password: '',
    confirmPassword: '',
};

export const shippingAddressDefaultValues = {
    fullName: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    country: '',
};


export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
    ? process.env.PAYMENT_METHODS.split(', ')
    : ['PayPal', 'Stripe', 'CashOnDelivery'];
export const DEFAULT_PAYMENT_METHOD =
    process.env.DEFAULT_PAYMENT_METHOD || 'PayPal';


export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 6;

export const productDefaultValues = {
    name: '',
    slug: '',
    category: '',
    style: '',
    subject: '',
    medium: '',
    material: '',
    size: '',
    orientation: '',
    color: '',
    author: '',
    authorcountry: '',
    media: [],
    description: '',
    stock: 0,
    isFeatured: false,
    banner: null,
    price: '0',
};

export const USER_ROLES = process.env.USER_ROLES
    ? process.env.USER_ROLES.split(', ')
    : ['admin', 'user'];


export const reviewFormDefaultValues = {
    title: '',
    comment: '',
    rating: 0,
};


export const SENDER_EMAIL = process.env.SENDER_EMAIL || "onboarding@resend.dev";



export const PRODUCT_CATEGORIES = ['Painting', 'Photography', 'Drawing', 'Mixed Media', 'Sculpture', 'Collage', 'PrintMaking', 'Digital', 'Installation'];

export const PRODUCT_STYLES = ['Abstract', 'Fine Art', 'Abstract Expressionism', 'Expresisionism', 'Modern', 'Figurative'];


export const PRODUCT_SUBJECTS = ['Abstract', 'Landscape', 'People', 'Animal', 'Floral', 'Women'];

export const PRODUCT_MEDIUMS = ['Acrylic', 'Oil', 'Watercolor', 'Ink', 'Gesso', 'Spray Paint'];


export const PRODUCT_MATERIALS = ['Canvas', 'Paper', 'Wood', 'Cardboard', 'Soft(Yarn, Cotton, Fabric)'];

export const PRODUCT_PRICES = [
    {
        name: '$1 to $50',
        value: '1-50',
    },
    {
        name: '$51 to $100',
        value: '51-100',
    },
    {
        name: '$101 to $200',
        value: '101-200',
    },
    {
        name: '$201 to $500',
        value: '201-500',
    },
    {
        name: '$501 to $1000',
        value: '501-1000',
    },
    {
        name: '$1001 to $5000',
        value: '1001-5000',
    },
];


export const PRODUCT_SIZES = ['Small', 'Medium', 'Large', 'Oversized'];
export const PRODUCT_ORIENTATIONS = ['Horizontal', 'Vertical', 'Square'];
export const PRODUCT_COLORS = ['Blue', 'Green', 'Yellow', 'Pink', 'Black', 'White'];



export const PRODUCT_RATINGS = [4, 3, 2, 1];

export const DEFAULT_LOGO = '/images/lunalogo2.jpg';