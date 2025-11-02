import React, { Component, type ErrorInfo, useState } from "react";
import { Button, Card, Alert, Container, Row, Col } from "react-bootstrap";
import { ExclamationTriangleFill, EyeFill, EyeSlashFill, ArrowRepeat } from "react-bootstrap-icons";

interface Props {
  children: React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  showDetails: boolean;
}

/**
 * Классический Error Boundary — отлавливает ошибки рендеринга
 */
class ErrorBoundaryImpl extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, showDetails: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("🧱 ErrorBoundary catch:", error, info.componentStack);
    this.props.onError?.(error, info);
    this.setState({ errorInfo: info });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback {...this.state} />;
    }
    return this.props.children;
  }
}

/**
 * UI отображения ошибки (Bootstrap)
 */
const ErrorFallback: React.FC<State> = ({ error, errorInfo, showDetails }) => {
  const [details, setDetails] = useState(showDetails);

  const toggleDetails = () => setDetails((prev) => !prev);
  const reload = () => window.location.reload();

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm border-0 text-center">
            <Card.Body>
              <div className="mb-3 text-warning">
                <ExclamationTriangleFill size={48} />
              </div>

              <Card.Title as="h4">Упс! Что-то пошло не так</Card.Title>
              <Card.Text className="text-muted">
                Мы уже получили уведомление об ошибке. Попробуйте обновить страницу.
              </Card.Text>

              {error && (
                <Alert variant="danger" className="mt-3 text-start">
                  <strong>Ошибка:</strong> {error.message}
                </Alert>
              )}

              {details && errorInfo?.componentStack && (
                <pre className="bg-light border rounded p-2 text-start mt-3 small overflow-auto" style={{ maxHeight: "200px" }}>
                  {errorInfo.componentStack}
                </pre>
              )}

              <div className="d-flex justify-content-center gap-2 mt-4">
                <Button variant="outline-secondary" onClick={toggleDetails}>
                  {details ? <EyeSlashFill className="me-1" /> : <EyeFill className="me-1" />}
                  {details ? "Скрыть стек" : "Показать стек"}
                </Button>

                <Button variant="primary" onClick={reload}>
                  <ArrowRepeat className="me-1" />
                  Перезагрузить
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

/**
 * Основной экспорт
 */
export const ErrorBoundary: React.FC<Props> = (props) => {
  return <ErrorBoundaryImpl {...props} />;
};
