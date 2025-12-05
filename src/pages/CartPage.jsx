import React from "react";
import { useCart } from "../context/useCart.js";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();
  const items = cart.items;
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleRemove = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", id });
  };

  const handleClear = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="display-6 fw-bold text-primary mb-2">🛒 Your Cart</h1>
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "contain",
                          marginRight: 10,
                        }}
                      />
                      <span>{item.title}</span>
                    </div>
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Card className="mb-4">
            <Card.Body className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <h4 className="mb-0">
                Total: <span className="text-success">${total.toFixed(2)}</span>
              </h4>
              <div className="d-flex gap-2">
                <Button variant="primary" onClick={() => navigate("/checkout")}>
                  Checkout
                </Button>
                <Button variant="outline-danger" onClick={handleClear}>
                  Clear Cart
                </Button>
              </div>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default CartPage;
