import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { ShieldExclamation, ArrowLeft, House } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="text-center shadow" style={{ maxWidth: "400px" }}>
        <Card.Body className="p-5">
          <ShieldExclamation 
            size={64} 
            className="text-warning mb-3"
          />
          <h3>Access Denied</h3>
          <p className="text-muted mb-4">
            You don't have permission to access this page. 
            Please contact your administrator if you believe this is an error.
          </p>
          <div className="d-grid gap-2">
            <Button 
              variant="primary" 
              onClick={() => navigate(-1)}
              className="d-flex align-items-center justify-content-center"
            >
              <ArrowLeft className="me-2" />
              Go Back
            </Button>
            <Button 
              variant="outline-primary" 
              onClick={() => navigate("/")}
              className="d-flex align-items-center justify-content-center"
            >
              <House className="me-2" />
              Go Home
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UnauthorizedPage;