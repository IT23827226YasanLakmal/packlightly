import ProductCard from "./ProductCard";

interface Product {
  id: number;
  imageUrl: string;
  title: string;
  rating: number;
  ecoRating: number;
}

const products: Product[] = [
  {
    id: 1,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGPzL0vMZI3agR00R_o_cvjbvXZkXkXLRPz5EPSJ_t0JIMQWJxgVTMiwp0axpLavC07SxZGEDWVvllpGeDLebgRkYXVlXuS2GWi4tjfJYkHVukkpkPSx8C59dvnl9kARX7ABR4AkVnAgj4U7XgDHvEMlVr_Zv0fmioXEgJoCZT0AIBYiZdMDCEEtaLroHsdbItEvLvaQTtVTpkrRt5rQY1iivRWAllgdDcM2CZTr-XMK-vRfUo0JV8M8cVXBzwBE0YdQwFG_EUhOT1",
    title: "Bamboo Travel Toothbrush",
    rating: 4.5,
    ecoRating: 5,
  },
  {
    id: 2,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDnPbKUV5QRZRFnWeKAUszImCpmORTUEhHqOtyvJW-zWbraJYr0mN49KoPjscvCZFdILLZ6GtHjkpSE_yY_Nz-tzdfoyvrObSnNj6oUE0LW69-zlmKSEG6mbcf7htN7ZW1Y9auxTGCkWlMMU1UNm5OWzoMNqRs3B517inl9ka-DNBYiRf9f9XuylAtlDJrOB4f_Q0MbjTS6E5u-YBQ-iL--3zdPx0RDKWCLEDY-dobAs1vBaLWgG5fwvEAAf7Tdvo8XU8OLJKmFmKl9",
    title: "Recycled Material Backpack",
    rating: 4.2,
    ecoRating: 4,
  },
  {
    id: 3,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCsWiJtPQJy0axY3qwKFQiKtReW3M22XtjUp4jNsU779bMjB-Z5ctpbMYEsjFV93ltag-LPEcL-Kigpg8-erweSSx005Gr2Td890jZqt-tcInH658zBj6sVEJmvcuFsty5uqimrETrIEf0rl6BdAMfYYmpRGd94hrBEzColhK9Ok6SMT5JH1ETL-yv3zuF2dGNwGdrDeaEPpX3yAzKC_b6LfIgL2yo55bAwYmvt4EbXB0Ouzkcoonw_MxsYPKyonoVC4nMDYM_f3vG_",
    title: "Solar Powered Charger",
    rating: 4.8,
    ecoRating: 5,
  },
  {
    id: 4,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB5MOw5DKajFF8gwcl_cgWM8vEs8129wWd-KwHwqFce4-I8VcR93tOH0kpjD3-1PnW6X9HmQZqZ1KyG5TKESehk0o056XrtGcAvkG0B4GyaNjHmiW78_4tp5nkdbZj4uRvl7iganv_KLgegbGlF7cDEBpoEJG1frB9Vqs2CjtRKbYERWHAbKo7XPDbBZLp7CVSLRgEGpjTKRfMNbJl9c7rhPpd-QA7LeyZrNjo9nMdp5I6C2XQXJPCbDSfj1DwpwGhj5sKJZToeXsTF",
    title: "Organic Cotton Travel Towel",
    rating: 4.6,
    ecoRating: 4,
  },
  {
    id: 5,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDyWZJUn-NjMLToUBXcbaTGueTDlDlGQ2izzZ25T8vyXHTipKYypSwqqTZsPzahHaYhdGK9qYuRXrfCaBCLl8idIewaaMjSY3OzmcgfAwZlzx-i1NrQIXOkWu08LLz6GMc9eXfV8Lsrq-03j001fqWEokx3blndDZdOPBfDWfM9NPecUrM1xSUnLXH0Is9NgxjO2uEEH1ldd16NBx-QyFl9DwPzFQPyZXyzD9L-F2bmMQaek1_kY8mJ-gJ4p-rLizGAkPRVZK9aC_AI",
    title: "Reusable Water Bottle",
    rating: 4.9,
    ecoRating: 5,
  },
  {
    id: 6,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDjSa7bebCIWkGu6DKHK4lnC8XodlI-fftx1ha7ZuisijCcBHQMMYgcux2OsULM_wUlKxDcUB220dAOmqDxL2blOTzPLQDvBwsBP6sS3ooCPomU87sbtShA5SBUH8EvUEmVTz2wU9ZjawZhDoREyNof3xVGN4JXOdGDnHkIS-uJSdEQsjPnKTbleblAtOqyNlbL0l5YlbcWgWJDeradqooMgl5LTve-i5hbKjwnYEmpkGoWSxdq4STDlXuakLJW6hKKCrOKymFLdM0u",
    title: "Biodegradable Soap",
    rating: 4.7,
    ecoRating: 5,
  },
];

export default function ProductGrid() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
