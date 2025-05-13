import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { Footer, Navbar } from "../components";
import { toast } from "react-toastify";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://testing.kopdesmerahputih.id/api/produks/${id}`);
        const data = await res.json();

        if (!data || !data.id) throw new Error("Produk tidak ditemukan.");

        const processedProduct = {
          ...data,
          kategori: data.kategori || { nama_kategori: "Tanpa Kategori" },
          img: data.img || "https://via.placeholder.com/400x400?text=No+Image",
          harga: data.harga || 0,
          levels: data.levels || [],
        };

        setProduct(processedProduct);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Gagal memuat data produk.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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
    return (
      <>
        <Navbar />
        <div className="container text-center my-5">
          <h2>Produk tidak ditemukan!</h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <div className="row">
          <div className="col-md-6">
            <img
              className="img-fluid"
              src={product.img}
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

            {product.levels.length > 0 && (
              <div className="mb-3">
                <strong>Level Pedas:</strong>
                <ul className="mt-2">
                  {product.levels.map((level) => (
                    <li key={level.id}>{level.nama_level}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              className="btn btn-outline-dark"
              onClick={() => dispatch(addCart(product))}
            >
              Tambahkan ke Keranjang
            </button>
            <Link to="/cart" className="btn btn-dark mx-3">
              Menuju ke keranjang
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
