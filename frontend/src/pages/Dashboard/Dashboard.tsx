import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { useAuth } from "@hooks/useAuth";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dashboard</h1>
        <span className="text-muted">Welcome back, {user?.name}!</span>
      </div>

      <Row>
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Users</Card.Title>
              <Card.Text className="h3 text-primary">1,234</Card.Text>
              <small className="text-muted">Total users</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Revenue</Card.Title>
              <Card.Text className="h3 text-success">$12,456</Card.Text>
              <small className="text-muted">This month</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Orders</Card.Title>
              <Card.Text className="h3 text-warning">567</Card.Text>
              <small className="text-muted">Pending orders</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Growth</Card.Title>
              <Card.Text className="h3 text-info">+12.5%</Card.Text>
              <small className="text-muted">Compared to last month</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;