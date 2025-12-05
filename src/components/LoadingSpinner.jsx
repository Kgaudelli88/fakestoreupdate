import { Spinner, Container, Row, Col, Card } from "react-bootstrap";

const LoadingSpinner = ({
  message = "Loading...",
  variant = "primary",
  size = "large",
  showCard = false,
  icon = null,
}) => {
  const getSpinnerSize = () => {
    switch (size) {
      case "small":
        return { width: "1.5rem", height: "1.5rem" };
      case "medium":
        return { width: "2rem", height: "2rem" };
      case "large":
        return { width: "3rem", height: "3rem" };
      default:
        return { width: "3rem", height: "3rem" };
    }
  };

  const LoadingContent = () => (
    <div className="text-center">
      <div className="mb-3">
        {icon && (
          <div className="position-relative d-inline-block">
            <Spinner
              animation="border"
              role="status"
              variant={variant}
              style={getSpinnerSize()}
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <div className="position-absolute top-50 start-50 translate-middle">
              <span
                style={{ fontSize: size === "small" ? "0.8rem" : "1.2rem" }}
              >
                {icon}
              </span>
            </div>
          </div>
        )}
        {!icon && (
          <Spinner
            animation="border"
            role="status"
            variant={variant}
            style={getSpinnerSize()}
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
      </div>
      <p className={`text-muted mb-3 ${size === "small" ? "small" : "lead"}`}>
        {message}
      </p>
      <div className="d-flex justify-content-center">
        <div
          className="spinner-grow text-primary me-1"
          style={{ width: "0.5rem", height: "0.5rem" }}
        ></div>
        <div
          className="spinner-grow text-primary me-1"
          style={{ width: "0.5rem", height: "0.5rem", animationDelay: "0.1s" }}
        ></div>
        <div
          className="spinner-grow text-primary"
          style={{ width: "0.5rem", height: "0.5rem", animationDelay: "0.2s" }}
        ></div>
      </div>
    </div>
  );

  if (showCard) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} lg={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-5">
                <LoadingContent />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <LoadingContent />
    </Container>
  );
};

export default LoadingSpinner;
