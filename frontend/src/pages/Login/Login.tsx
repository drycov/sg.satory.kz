import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "@hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(email, password);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <Container 
      className="d-flex justify-content-center align-items-center vh-100"
      fluid
    >
      <Card style={{ width: "100%", maxWidth: "400px" }}>
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <h2>Welcome Back</h2>
            <p className="text-muted">Please sign in to your account</p>
          </div>

          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Remember me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </Form>

          {/* Демо-аккаунты */}
          <div className="mt-4 p-3 bg-light rounded">
            <small className="text-muted">
              <strong>Demo accounts:</strong><br />
              admin@example.com / admin123<br />
              user@example.com / user123
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;