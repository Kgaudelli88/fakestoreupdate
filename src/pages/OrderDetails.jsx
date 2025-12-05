// src/pages/OrderDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchOrder } from "../utils/firestoreOrders";
import { Container, Card, ListGroup, Spinner, Alert } from "react-bootstrap";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getOrder = async () => {
      setLoading(true);
      try {
        const data = await fetchOrder(id);
        setOrder(data);
      } catch (err) {
        setError(err.message || "Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };
    getOrder();
  }, [id]);

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  if (error || !order)
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || "Order not found."}</Alert>
      </Container>
    );

  return (
    <Container className="py-5">
      <Card className="mx-auto" style={{ maxWidth: 600 }}>
        <Card.Body>
          <h3 className="mb-4">Order Details</h3>
          <p>
            <strong>Order ID:</strong> {order.id}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
          </p>
          <p>
            <strong>Total:</strong> ${order.total?.toFixed(2) || "0.00"}
          </p>
          <h5 className="mt-4">Products</h5>
          <ListGroup>
            {order.products?.map((product, idx) => (
              <ListGroup.Item key={idx}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{product.title}</strong>
                    <br />
                    <span className="text-muted">
                      ${product.price?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <span>Qty: {product.quantity || 1}</span>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderDetails;
