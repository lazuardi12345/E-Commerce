import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { toast } from "react-toastify";

const ShowProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevels, setSelectedLevels] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [produkRes, kategoriRes, levelRes] = await Promise.all([
          fetch("https://testing.kopdesmerahputih.id/api/produks"),
          fetch("https://testing.kopdesmerahputih.id/api/kategoris"),
          fetch("https://testing.kopdesmerahputih.id/api/levels"),
        ]);

        if (!produkRes.ok || !kategoriRes.ok || !levelRes.ok) {
          throw new Error("Gagal mengambil data dari server");
        }

        const produkData = await produkRes.json();
        const kategoriData = await kategoriRes.json();
        const levelData = await levelRes.json();

        setProducts(Array.isArray(produkData.produk) ? produkData.produk : []);
        setCategories(Array.isArray(kategoriData) ? kategoriData : []);
        setLevels(Array.isArray(levelData) ? levelData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Gagal mengambil data produk.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    const isMakanan = product.kategori?.nama_kategori === "Makanan";
    const selectedLevelId = selectedLevels[product.id];

    if (isMakanan && !selectedLevelId) {
      toast.error("Pilih level terlebih dahulu untuk produk makanan.");
      return;
    }

    const selectedLevelObj = isMakanan
      ? levels.find((lvl) => lvl.id === parseInt(selectedLevelId))
      : null;

    const productWithLevel = {
      ...product,
      level_id: isMakanan && selectedLevelObj ? selectedLevelObj.id : null,
    };

    dispatch(addCart(productWithLevel));
    toast.success("Berhasil ditambahkan ke keranjang!");
  };

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory === "all" ||
      String(product.kategori_id) === String(selectedCategory);
    return matchCategory;
  });

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Daftar Produk</h2>

      <div className="row mb-4">
        <div className="col-md-6">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nama_kategori}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const isMakanan =
                  product.kategori?.nama_kategori === "Makanan";

                return (
                  <div key={product.id} className="col-md-4 col-sm-6 mb-4">
                    <div className="card h-100 text-center">
                      <img
                        className="card-img-top p-3"
                        src={product.img || "https://via.placeholder.com/300"}
                        alt={product.nama}
                        height={250}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{product.nama}</h5>
                        <p className="card-text">{product.deskripsi}</p>
                      </div>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item lead">
                          {formatRupiah(product.harga)}
                        </li>
                        <li className="list-group-item">
                          Kategori: {product.kategori?.nama_kategori || "-"}
                        </li>

                        {isMakanan && (
                          <li className="list-group-item">
                            <span>Level:</span>
                            <select
                              className="form-select d-inline ms-2"
                              style={{ width: "auto" }}
                              value={selectedLevels[product.id] || ""}
                              onChange={(e) =>
                                setSelectedLevels((prev) => ({
                                  ...prev,
                                  [product.id]: e.target.value,
                                }))
                              }
                            >
                              <option value="">Pilih Level</option>
                              {levels.map((level) => (
                                <option key={level.id} value={level.id}>
                                  {level.nama_level}
                                </option>
                              ))}
                            </select>
                          </li>
                        )}

                        <li className="list-group-item">
                          <span
                            className={`badge px-2 py-1 ${
                              product.stok === "tersedia"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {product.stok === "tersedia"
                              ? "Stok Tersedia"
                              : "Stok Habis"}
                          </span>
                        </li>
                      </ul>
                      <div className="card-body">
                        <Link
                          to={`/product/${product.id}`}
                          className="btn btn-outline-dark m-1"
                        >
                          Detail
                        </Link>
                        <button
                          className="btn btn-dark m-1"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stok !== "tersedia"}
                        >
                          Tambah ke Keranjang
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center">Produk tidak ditemukan.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ShowProducts;
