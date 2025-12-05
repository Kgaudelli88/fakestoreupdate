import React, { useState } from "react";
import { useCart } from "../context/useCart.js";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Form,
  Alert,
} from "react-bootstrap";
import { createOrder } from "../utils/firestoreOrders";
import { useAuth } from "../hooks/useAuth";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const CheckoutPage = () => {
  const { cart, dispatch } = useCart();
  const { user } = useAuth();
  const items = cart.items;
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [placingOrder, setPlacingOrder] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.address) {
      setToast({
        show: true,
        message: "Please fill in all fields.",
        variant: "danger",
      });
      return;
    }
    setPlacingOrder(true);
    try {
      await createOrder({
        userId: user ? user.uid : null,
        name: form.name,
        email: form.email,
        address: form.address,
        products: items,
        total,
        createdAt: new Date().toISOString(),
      });
      setToast({
        show: true,
        message: "Order placed successfully!",
        variant: "success",
      });
      setSubmitted(true);
      dispatch({ type: "CLEAR_CART" });
    } catch {
      setToast({
        show: true,
        message: "Failed to place order. Please try again.",
        variant: "danger",
      });
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!user) {
    return (
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Alert variant="warning" className="text-center">
              <h4 className="mb-3">🔒 Sign In Required</h4>
              <p>
                You must be signed in to complete checkout and place an order.
              </p>
              <Button href="/login" variant="primary">
                Sign In
              </Button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  if (submitted) {
    return (
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Alert variant="success" className="text-center">
              <h4 className="mb-3">✅ Order Placed!</h4>
              <p>Thank you, {form.name}! Your order has been received.</p>
              <p className="mb-0">
                A confirmation email will be sent to <b>{form.email}</b>.
              </p>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="display-6 fw-bold text-primary mb-2">🧾 Checkout</h1>
          <p className="text-muted mb-0">
            {items.length === 0
              ? "Your cart is empty."
              : `You have ${items.length} item(s) in your cart.`}
          </p>
        </Col>
      </Row>
      {items.length > 0 && (
        <>
          <Table bordered hover responsive className="mb-4">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Card className="mb-4">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                Total: <span className="text-success">${total.toFixed(2)}</span>
              </h4>
            </Card.Body>
          </Card>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-3">Shipping & Contact Info</h5>
              {/* Error alert removed; handled by toast notification */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={placingOrder}
                >
                  {placingOrder ? "Placing Order..." : "Place Order"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </>
      )}
      {/* Toast Notifications */}
      <ToastContainer className="position-fixed bottom-0 end-0 p-3">
        <Toast
          show={toast.show}
          onClose={() => setToast((t) => ({ ...t, show: false }))}
          delay={4000}
          autohide
          bg={toast.variant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toast.variant === "success" ? "✅ Success" : "❌ Error"}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default CheckoutPage;
