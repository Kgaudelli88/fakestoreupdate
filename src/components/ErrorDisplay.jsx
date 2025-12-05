import { Alert, Container, Row, Col, Card, Button } from "react-bootstrap";

const ErrorDisplay = ({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  icon = "⚠️",
  variant = "danger",
  showRetry = true,
  onRetry = null,
  showRefresh = false,
  additionalInfo = null,
  identifier = null,
}) => {
  const handleRetry = () => {
    if (onRetry && typeof onRetry === "function") {
      onRetry();
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-5 text-center">
              <div className="mb-4" style={{ fontSize: "4rem" }}>
                {icon}
              </div>

              <h4 className={`text-${variant} mb-3`}>{title}</h4>

              <p className="text-muted mb-4">{message}</p>

              {additionalInfo && (
                <Alert variant="light" className="text-start mb-4">
                  <Alert.Heading className="h6 mb-2">
                    💡 This might be due to:
                  </Alert.Heading>
                  <ul className="mb-0 small">
                    {additionalInfo.map((info, index) => (
                      <li key={index}>{info}</li>
                    ))}
                  </ul>
                </Alert>
              )}

              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                {showRetry && (
                  <Button
                    variant={variant}
                    onClick={handleRetry}
                    className="px-4"
                    disabled={!onRetry}
                  >
                    <span className="me-2">🔄</span>Try Again
                  </Button>
                )}

                {showRefresh && (
                  <Button
                    variant="outline-secondary"
                    onClick={handleRefresh}
                    className="px-4"
                  >
                    <span className="me-2">↻</span>Refresh Page
                  </Button>
                )}
              </div>

              {identifier && (
                <>
                  <hr className="my-4" />
                  <small className="text-muted">
                    {identifier} • If this problem persists, please contact
                    support
                  </small>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorDisplay;
