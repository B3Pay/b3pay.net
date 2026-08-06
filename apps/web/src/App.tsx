import { Navigate, Route, Routes } from "react-router-dom";

import About from "./routes/About";
import Blog from "./routes/Blog";
import Contact from "./routes/Contact";
import Developers from "./routes/Developers";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import Products from "./routes/Products";
import { Layout } from "./components/Layout";
import { PRODUCTS } from "./site/products";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        {/* Each product tab is a real URL. /products lands on the first one. */}
        <Route
          path="/products"
          element={<Navigate to={`/products/${PRODUCTS[0].key}`} replace />}
        />
        <Route path="/products/:slug" element={<Products />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
