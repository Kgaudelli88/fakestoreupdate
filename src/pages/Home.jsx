import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigateToProducts = () => {
    navigate("/products");
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5 text-center">
                <div className="mb-4">
                  <h1 className="display-4 fw-bold text-primary mb-3">
                    🛒 Welcome to Fake Store
                  </h1>
                  <h2 className="h4 text-secondary mb-4">
                    Your One-Stop Shop for Everything Amazing
                  </h2>
                </div>

                <div className="mb-4">
                  <p className="lead text-muted mb-3">
                    Discover an incredible collection of high-quality products
                    at unbeatable prices. From electronics to fashion, jewelry
                    to books - we have everything you need to make your shopping
                    experience extraordinary.
                  </p>
                  <p className="text-muted">
                    Browse through our carefully curated selection and find the
                    perfect items that match your style and needs. Fast
                    shipping, easy returns, and exceptional customer service
                    guaranteed!
                  </p>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleNavigateToProducts}
                    className="px-5 py-3 fw-bold"
                  >
                    🚀 Start Shopping Now
                  </Button>
                </div>

                <div className="mt-4 pt-3 border-top">
                  <Row className="text-center">
                    <Col xs={12} md={4} className="mb-3 mb-md-0">
                      <div className="h5 text-success mb-1">🚚</div>
                      <small className="text-muted">Free Shipping</small>
                    </Col>
                    <Col xs={12} md={4} className="mb-3 mb-md-0">
                      <div className="h5 text-warning mb-1">⭐</div>
                      <small className="text-muted">Top Quality</small>
                    </Col>
                    <Col xs={12} md={4}>
                      <div className="h5 text-info mb-1">🔒</div>
                      <small className="text-muted">Secure Payment</small>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Home;
