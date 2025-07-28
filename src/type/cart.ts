export interface CartItem {
    _id: string;
    name: string;
    platform : string;
    productType: string;
    selectedOption: {
        label: string;
        amount: string;
        price: string
    }
     product: string | { _id: string };
     quantity: number; 
};


export interface Cart{
    _id: string;
    user: string;
    products: CartItem[];
}
