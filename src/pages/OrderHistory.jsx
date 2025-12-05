// src/pages/OrderHistory.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { fetchUserOrders } from "../utils/firestoreOrders";
import {
  Container,
  Card,
  ListGroup,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getOrders = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await fetchUserOrders(user.uid);
        setOrders(data);
      } catch (err) {
        setError(err.message || "Failed to fetch order history.");
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, [user]);

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <Container className="py-5">
      <Card className="mx-auto" style={{ maxWidth: 600 }}>
        <Card.Body>
          <h3 className="mb-4">Order History</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <ListGroup>
              {orders.map((order) => (
                <ListGroup.Item key={order.id}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Order ID:</strong> {order.id}
                      <br />
                      <strong>Date:</strong>{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "-"}
                      <br />
                      <strong>Total:</strong> $
                      {order.total?.toFixed(2) || "0.00"}
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderHistory;
