import React, { useState, useEffect } from "react";
import { Footer, Navbar } from "../components";
import { useLocation } from "react-router-dom"; // Import useLocation
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const location = useLocation(); // Get the location object
  const checkoutData = location.state; // Access the checkoutData passed from navigate
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [subtotal, setSubtotal] = useState(0);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [alamat, setAlamat] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  useEffect(() => {
    if (checkoutData) {
      const total = checkoutData.products.reduce((sum, item) => sum + item.product_quantity * item.harga, 0);
      setSubtotal(total);
    }
  }, [checkoutData]);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!nama || !email || !alamat) {
      alert("Semua kolom harus diisi!");
      return;
    }

    const orderData = {
      customer_name: nama,
      email,
      alamat,
      payment_method: paymentMethod,
      products: checkoutData.products.map(item => ({
        ...item,
      })),
    };

    try {
      const { data } = await axios.post(
        "https://testing.kopdesmerahputih.id/api/checkout",
        orderData
      );

      const order = data.order;

      if (paymentMethod === "midtrans") {
        window.snap.pay(data.snap_token, {
          onSuccess: function (result) {
            alert("Pembayaran berhasil!");
            navigate("/receipt", { state: { order } });
          },
          onPending: function (result) {
            alert("Menunggu pembayaran!");
          },
          onError: function (result) {
            alert("Pembayaran gagal!");
          },
        });
      } else {
        // If payment is cash, show the modal
        setShowModal(true);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memproses transaksi.");
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", process.env.REACT_APP_MIDTRANS_CLIENT_KEY);
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // Close the modal and reload the page or navigate
  const handleModalClose = () => {
    window.location.reload(); // Reload the page
  };

  if (!checkoutData) {
    return (
      <div>
        <p>No checkout data found!</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Pembelian</h1>
        <hr />
        <div className="row">
          <div className="col-md-5 order-md-last">
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5>Ringkasan Pesanan</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  {checkoutData.products.map((item) => (
                    <li key={item.product_id} className="list-group-item d-flex justify-content-between">
                      {item.product_name} {item.level_id} ({item.product_quantity})
                      <span>{formatRupiah(item.harga * item.product_quantity)}</span>
                    </li>
                  ))}
                  <li className="list-group-item d-flex justify-content-between">
                    <strong>Total</strong>
                    <strong>{formatRupiah(subtotal)}</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <div className="card mb-4">
              <div className="card-header">
                <h4>Alamat & Pembayaran</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handlePayment}>
                  <div className="mb-3">
                    <label htmlFor="nama" className="form-label">Nama Lengkap</label>
                    <input
                      type="text"
                      id="nama"
                      className="form-control"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="alamat" className="form-label">Alamat</label>
                    <input
                      type="text"
                      id="alamat"
                      className="form-control"
                      value={alamat}
                      onChange={(e) => setAlamat(e.target.value)}
                      required
                    />
                  </div>

                  <hr />

                  <h5>Metode Pembayaran</h5>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="cash"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={() => setPaymentMethod("cash")}
                    />
                    <label className="form-check-label" htmlFor="cash">
                      Bayar Cash
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="midtrans"
                      value="midtrans"
                      checked={paymentMethod === "midtrans"}
                      onChange={() => setPaymentMethod("midtrans")}
                    />
                    <label className="form-check-label" htmlFor="midtrans">
                      Midtrans (VA)
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 mt-4">
                    Bayar Sekarang
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Cash Payment */}
      {showModal && (
        <div className="modal show" style={{ display: "block" }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Pesanan Berhasil</h5>
                <button type="button" className="close" onClick={handleModalClose}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Anda telah berhasil memesan. Mohon tunggu panggilan dari kasir!</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleModalClose}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Checkout;
