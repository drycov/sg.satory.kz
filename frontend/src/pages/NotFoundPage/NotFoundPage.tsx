import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { House, ArrowCounterclockwise } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="text-center shadow" style={{ maxWidth: "400px" }}>
        <Card.Body className="p-5">
          <div className="display-1 text-muted mb-4">404</div>
          <h3>Page Not Found</h3>
          <p className="text-muted mb-4">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <div className="d-grid gap-2">
            <Button 
              variant="primary" 
              onClick={() => navigate("/")}
              className="d-flex align-items-center justify-content-center"
            >
              <House className="me-2" />
              Go Home
            </Button>
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate(-1)}
              className="d-flex align-items-center justify-content-center"
            >
              <ArrowCounterclockwise className="me-2" />
              Go Back
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NotFoundPage;