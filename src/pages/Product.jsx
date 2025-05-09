import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { Footer, Navbar } from "../components";
import { toast } from "react-toastify";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSimilar, setLoadingSimilar] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://testing.kopdesmerahputih.id/api/produks/${id}`);
        const data = await res.json();
        if (data) {
          setProduct({
            ...data,
            kategori: data.kategori || { nama_kategori: "Tanpa Kategori" }, 
          });

          if (data.kategori_id) {
            const res2 = await fetch(
              `https://testing.kopdesmerahputih.id/api/produks?kategori_id=${data.kategori_id}`
            );
            const data2 = await res2.json();
            if (Array.isArray(data2) && data2.length > 0) {
              setSimilarProducts(data2);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch product data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (similarProducts.length > 0) {
      setLoadingSimilar(false);
    }
  }, [similarProducts]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container text-center my-5">
          <Skeleton height={400} width={400} />
          <h2>Loading...</h2>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return <div>No product found!</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <div className="row">
          <div className="col-md-6">
            <img
              className="img-fluid"
              src={product.img || "default-image.jpg"}
              alt={product.nama || "Product"}
              width="400px"
              height="400px"
            />
          </div>
          <div className="col-md-6 py-5">
            <h4 className="text-uppercase text-muted">
              {product.kategori?.nama_kategori || "Tanpa Kategori"}
            </h4>
            <h1 className="display-5">{product.nama}</h1>
            <h3 className="display-6 my-4">Rp {product.harga}</h3>
            <p className="lead">{product.deskripsi}</p>
            <button className="btn btn-outline-dark" onClick={() => dispatch(addCart(product))}>
              Add to Cart
            </button>
            <Link to="/cart" className="btn btn-dark mx-3">
              Go to Cart
            </Link>
          </div>
        </div>

        {/* Similar Products */}
        {loadingSimilar ? (
          <div className="row my-5 py-5">
            <h2>Loading similar products...</h2>
            <Skeleton count={5} height={300} />
          </div>
        ) : (
          <div className="row my-5 py-5">
            <h2>You may also like</h2>
            <Marquee pauseOnHover speed={50}>
              {similarProducts.map((item) => (
                <div key={item.id} className="card mx-4 text-center">
                  <img className="card-img-top p-3" src={item.img} alt="Card" height={300} width={300} />
                  <div className="card-body">
                    <h5 className="card-title">{item.nama}</h5>
                    <Link to={`/product/${item.id}`} className="btn btn-dark m-1">
                      Buy Now
                    </Link>
                    <button className="btn btn-dark m-1" onClick={() => dispatch(addCart(item))}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </Marquee>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Product;
