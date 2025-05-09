import React from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { addCart, delCart, clearCart, decreaseCart } from "../redux/action";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const cart = useSelector((state) => state.handleCart) || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to add item to cart
  const addItem = (item) => dispatch(addCart(item));

  // Function to remove item from cart
  const removeItem = (item) => dispatch(decreaseCart(item));

  // Handle the checkout process
  const handleCheckout = async () => {
    try {
      const totalAmount = cart.reduce(
        (acc, item) => acc + item.qty * parseFloat(item.harga),
        0
      );
      const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

      // Prepare the data to be sent to the checkout page
      const checkoutData = {
        total_amount: totalAmount,
        total_items: totalItems,
        products: cart.map((item) => ({
          product_id: item.id,
          product_name: item.nama,
          product_quantity: item.qty,
          harga: item.harga,
          level_id: item.level_id,
        })),
      };

      // Pass the data to the checkout page
      navigate("/checkout", { state: checkoutData });

      // Clear the cart after successful checkout
      dispatch(clearCart());
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  // Display when the cart is empty
  const EmptyCart = () => (
    <div className="container text-center py-5">
      <h4 className="display-5 mb-3">Keranjang Kamu Kosong </h4>
      <Link to="/" className="btn btn-outline-dark">
        <i className="fa fa-arrow-left"></i> Silahkan Pesan dulu ya!
      </Link>
    </div>
  );

  // Show the cart items with the total price and quantity
  const ShowCart = () => {
    const subtotal = cart.reduce(
      (acc, item) => acc + item.qty * parseFloat(item.harga),
      0
    );
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

    return (
      <section className="h-100 gradient-custom">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card mb-4">
                <div className="card-header">
                  <h5>Lis Pesanan Anda</h5>
                </div>
                <div className="card-body">
                  {cart.map((item, i) => (
                    <div
                      key={`${item.id}-${item.level_id}-${i}`}
                      className="mb-4 border-bottom pb-3"
                    >
                      <div className="row align-items-center">
                        <div className="col-lg-3 col-md-12">
                          <img
                            src={item.img || "https://via.placeholder.com/100"}
                            alt={item.nama}
                            width={100}
                            height={75}
                            className="rounded"
                          />
                        </div>
                        <div className="col-lg-5 col-md-6">
                          <p>
                            <strong>{item.nama}</strong>
                          </p>
                          <p className="text-muted">
                            Level: {item.level_id ? item.level_id : "Not Selected"}
                          </p>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="d-flex align-items-center mb-2">
                            <button
                              className="btn btn-outline-dark"
                              onClick={() => removeItem(item)}
                            >
                              <i className="fas fa-minus"></i>
                            </button>
                            <span className="mx-3">{item.qty}</span>
                            <button
                              className="btn btn-outline-dark"
                              onClick={() => addItem(item)}
                            >
                              <i className="fas fa-plus"></i>
                            </button>
                          </div>
                          <p className="text-center">
                            <strong>
                              {item.qty} x Rp{parseFloat(item.harga).toFixed(2)}
                            </strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card">
                <div className="card-header bg-light">
                  <h5>Jumlah Orderan</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group mb-3">
                    <li className="list-group-item d-flex justify-content-between">
                      Products ({totalItems})
                      <span>Rp {subtotal.toFixed(2)}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between">
                      <strong>Total</strong>
                      <strong>Rp {subtotal.toFixed(2)}</strong>
                    </li>
                  </ul>
                  <button className="btn btn-dark w-100" onClick={handleCheckout}>
                    Lanjut ke Pembelian
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container my-3">
        <h1 className="text-center">Keranjang</h1> {/* Changed here */}
        <hr />
        {cart.length > 0 ? <ShowCart /> : <EmptyCart />}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
