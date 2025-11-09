import { useState } from "react";
import {
    Card,
    Button,
    Form,
    Row,
    Col,
    ListGroup,
    Tab,
} from "react-bootstrap";
import {
    Gear,
    Bell,
    InfoCircle,
    Display,
    Plug,
    Server,
    Telegram,
    Database,
    Save2,
} from "react-bootstrap-icons";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
    const { theme, toggleTheme } = useTheme();

    const [activeKey, setActiveKey] = useState("interface");

    const [language, setLanguage] = useState("ru");
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [apiEndpoint, setApiEndpoint] = useState("https://api.vpn.satory.kz");
    const [notifications, setNotifications] = useState(true);
    const [radiusHost, setRadiusHost] = useState("10.216.201.5");
    const [radiusSecret, setRadiusSecret] = useState("radius_secret");
    const [mikrotikHost, setMikrotikHost] = useState("10.216.200.1");
    const [mikrotikLogin, setMikrotikLogin] = useState("api_admin");
    const [telegramToken, setTelegramToken] = useState("123456789:ABC-DEF1234");
    const [zabbixURL, setZabbixURL] = useState("https://zabbix.satory.kz");

    const handleSave = () => {
        console.log("✅ Настройки сохранены:", {
            theme,
            language,
            autoRefresh,
            apiEndpoint,
            notifications,
            radiusHost,
            mikrotikHost,
            telegramToken,
            zabbixURL,
        });
        alert("Настройки успешно сохранены");
    };

    const isDark = theme === "dark";
    const cardStyle = isDark
        ? { backgroundColor: "#1e1e1e", color: "#f8f9fa" }
        : { backgroundColor: "#fff", color: "#212529" };

    const buttonVariant = isDark ? "light" : "dark";

    const menuItems = [
        { key: "interface", icon: <Display />, label: "Интерфейс" },
        { key: "system", icon: <Gear />, label: "Система" },
        { key: "notifications", icon: <Bell />, label: "Уведомления" },
        { key: "integrations", icon: <Plug />, label: "Интеграции" },
        { key: "about", icon: <InfoCircle />, label: "О программе" },
    ];

    return (
        <Card className="shadow-sm p-0" style={cardStyle}>
            <div
                className={`p-4 border-bottom ${isDark ? "border-secondary" : "border-light"
                    }`}
            >
                <h4 className="d-flex align-items-center mb-0">
                    <Gear className="me-2" />
                    Центр настроек
                </h4>
            </div>

            <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k || "interface")}>
                <Row className="g-0">
                    {/* ВЕРТИКАЛЬНОЕ МЕНЮ */}
                    <Col sm={3} className={isDark ? "bg-dark border-end" : "bg-light border-end"}>
                        <ListGroup variant="flush" className="list-group-flush">
                            {menuItems.map((item) => {
                                const isActive = activeKey === item.key;
                                const activeClass = isActive
                                    ? isDark
                                        ? "bg-white text-dark"
                                        : "bg-black text-white"
                                    : isDark
                                        ? "bg-dark text-light"
                                        : "bg-light text-dark";

                                return (
                                    <ListGroup.Item
                                        key={item.key}
                                        action
                                        eventKey={item.key}
                                        onClick={() => setActiveKey(item.key)}
                                        className={`py-3 fw-semibold border-0 ${activeClass}`}
                                        style={{
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                        }}
                                    >
                                        <span className="me-2">{item.icon}</span>
                                        {item.label}
                                    </ListGroup.Item>
                                );
                            })}
                        </ListGroup>
                    </Col>

                    {/* КОНТЕНТ ВКЛАДОК */}
                    <Col sm={9} className="p-4">
                        <Tab.Content>
                            {/* Интерфейс */}
                            <Tab.Pane eventKey="interface">
                                <Form>
                                    <Form.Group className="mb-4">
                                        <Form.Label>Текущая тема интерфейса</Form.Label>
                                        <div className="d-flex align-items-center gap-2">
                                            <Form.Control
                                                type="text"
                                                value={theme}
                                                readOnly
                                                className={isDark ? "bg-secondary text-light border-0" : ""}
                                            />
                                            <Button
                                                variant={buttonVariant}
                                                className={
                                                    isDark
                                                        ? "text-dark bg-white border-0"
                                                        : "text-white bg-black border-0"
                                                }
                                                onClick={toggleTheme}
                                            >
                                                Переключить
                                            </Button>
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Язык интерфейса</Form.Label>
                                        <Form.Select
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className={isDark ? "bg-secondary text-light border-0" : ""}
                                        >
                                            <option value="ru">Русский</option>
                                            <option value="en">English</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Form>
                            </Tab.Pane>

                            {/* Система */}
                            <Tab.Pane eventKey="system">
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>API Endpoint</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={apiEndpoint}
                                            onChange={(e) => setApiEndpoint(e.target.value)}
                                            className={isDark ? "bg-secondary text-light border-0" : ""}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Автообновление данных</Form.Label>
                                        <Form.Check
                                            type="switch"
                                            id="auto-refresh-switch"
                                            label="Включить автообновление каждые 60 сек"
                                            checked={autoRefresh}
                                            onChange={(e) => setAutoRefresh(e.target.checked)}
                                        />
                                    </Form.Group>
                                </Form>
                            </Tab.Pane>

                            {/* Уведомления */}
                            <Tab.Pane eventKey="notifications">
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="switch"
                                            id="notify-switch"
                                            label="Telegram-уведомления о событиях VPN"
                                            checked={notifications}
                                            onChange={(e) => setNotifications(e.target.checked)}
                                        />
                                    </Form.Group>
                                    <p className="text-muted">
                                        Уведомления отправляются при активации/блокировке VPN-пользователя, ошибках авторизации и сбоях FreeRADIUS.
                                    </p>
                                </Form>
                            </Tab.Pane>

                            {/* Интеграции */}
                            <Tab.Pane eventKey="integrations">
                                <Form>
                                    <h5 className="mb-3">
                                        <Server className="me-2" /> FreeRADIUS
                                    </h5>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Адрес сервера</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={radiusHost}
                                                    onChange={(e) => setRadiusHost(e.target.value)}
                                                    className={isDark ? "bg-secondary text-light border-0" : ""}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Секрет</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    value={radiusSecret}
                                                    onChange={(e) => setRadiusSecret(e.target.value)}
                                                    className={isDark ? "bg-secondary text-light border-0" : ""}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <h5 className="mt-4 mb-3">
                                        <Plug className="me-2" /> MikroTik API
                                    </h5>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Адрес устройства</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={mikrotikHost}
                                                    onChange={(e) => setMikrotikHost(e.target.value)}
                                                    className={isDark ? "bg-secondary text-light border-0" : ""}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Пользователь</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={mikrotikLogin}
                                                    onChange={(e) => setMikrotikLogin(e.target.value)}
                                                    className={isDark ? "bg-secondary text-light border-0" : ""}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <h5 className="mt-4 mb-3">
                                        <Telegram className="me-2" /> Telegram Bot
                                    </h5>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Bot Token</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={telegramToken}
                                            onChange={(e) => setTelegramToken(e.target.value)}
                                            className={isDark ? "bg-secondary text-light border-0" : ""}
                                        />
                                    </Form.Group>

                                    <h5 className="mt-4 mb-3">
                                        <Database className="me-2" /> Zabbix / Monitoring
                                    </h5>
                                    <Form.Group className="mb-3">
                                        <Form.Label>URL мониторинга</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={zabbixURL}
                                            onChange={(e) => setZabbixURL(e.target.value)}
                                            className={isDark ? "bg-secondary text-light border-0" : ""}
                                        />
                                    </Form.Group>
                                </Form>
                            </Tab.Pane>

                            {/* О программе */}
                            <Tab.Pane eventKey="about">
                                <h5>VPN User Manager</h5>
                                <p className="text-muted mb-1">
                                    Версия: <strong>1.3.2 (build 2025.11.09)</strong>
                                </p>
                                <p className="text-muted">
                                    Разработано для централизованного управления пользователями VPN RouterOS и FreeRADIUS.
                                </p>
                                <p>© 2025 Satory Company Ltd. Все права защищены.</p>
                            </Tab.Pane>
                        </Tab.Content>

                        <div className="text-end mt-4">
                            <Button
                                variant={buttonVariant}
                                className={
                                    isDark
                                        ? "bg-white text-dark border-0"
                                        : "bg-black text-white border-0"
                                }
                                onClick={handleSave}
                            >
                                <span className="me-2">{<Save2 />}</span>
                                Сохранить изменения
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Tab.Container>
        </Card>
    );
}
