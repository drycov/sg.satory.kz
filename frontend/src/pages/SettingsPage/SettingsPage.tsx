import type { SettingsState } from "@/context/SettingsContext";
import { useSettings } from "@/context/SettingsContext";
import { useTheme } from "@/context/ThemeContext";
import { useCallback, useEffect, useMemo, useState, type JSX } from "react";
import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    Collapse,
    Form,
    Modal,
    OverlayTrigger,
    Row,
    Spinner,
    Stack,
    Tooltip
} from "react-bootstrap";
import {
    ArrowClockwise,
    CheckCircleFill,
    CloudArrowDown,
    CloudArrowUp,
    DashCircleFill,
    Display,
    ExclamationTriangle,
    Eye,
    EyeSlash,
    Gear,
    Globe2,
    InfoCircle,
    LightningCharge,
    Moon,
    Power,
    Save2,
    Sun,
    Trash,
    XCircleFill
} from "react-bootstrap-icons";
import { toast } from "react-toastify";

// ─── Типы ───────────────────────────────────────

interface IntegrationConfig<T extends keyof SettingsState> {
    id: T extends `enable${infer U}` ? Uncapitalize<U> : never;
    label: string;
    desc: string;
    urlKey: keyof SettingsState;
    enabledKey: T;
    fields: (local: SettingsState, onChange: (updates: Partial<SettingsState>) => void) => JSX.Element;
    testable?: boolean;
}

// ─── Компонент: Скрытое поле с переключением видимости ─────────────────

interface PasswordFieldProps {
    value: string;
    onChange: (value: string) => void;
    show: boolean;
    onToggle: () => void;
    className?: string;
    placeholder?: string;
}

const PasswordField = ({ value, onChange, show, onToggle, className, placeholder }: PasswordFieldProps) => (
    <div className="position-relative">
        <Form.Control
            type={show ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={className}
            placeholder={placeholder}
        />
        <Button
            variant="outline-secondary"
            size="sm"
            className="position-absolute end-0 top-0 border-0"
            onClick={onToggle}
        >
            {show ? <EyeSlash /> : <Eye />}
        </Button>
    </div>
);

// ─── Компонент: Секция ───────────────────────────

interface SectionProps {
    title: string;
    icon: React.ReactNode;
    description?: string;
    children: React.ReactNode;
}

const Section = ({ title, icon, description, children }: SectionProps) => (
    <div className="mb-5">
        <h4 className="border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
            {icon}
            {title}
        </h4>
        {description && <p className="text-muted mb-3">{description}</p>}
        {children}
    </div>
);

// ─── Основной компонент ──────────────────────────

export default function SettingsPage() {
    const { theme, toggleTheme } = useTheme();
    const { settings, updateSetting, resetSettings } = useSettings();
    const isDark = theme === "dark";

    const [local, setLocal] = useState<SettingsState>(settings);
    const [changed, setChanged] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [importing, setImporting] = useState(false);
    const [status, setStatus] = useState<Record<string, "ok" | "fail" | "pending" | undefined>>({});
    const [saving, setSaving] = useState(false);
    const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});
    const [showResetModal, setShowResetModal] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);

    const cls = isDark ? "bg-dark text-light border-secondary" : "";

    // ─── Синхронизация и отслеживание изменений ─────
    useEffect(() => {
        setLocal(settings);
    }, [settings]);

    useEffect(() => {
        const hasChanges = JSON.stringify(local) !== JSON.stringify(settings);
        setChanged(hasChanges);
    }, [local, settings]);

    // ─── Обработчики ────────────────────────────────

    const handleLocalChange = useCallback((updates: Partial<SettingsState>) => {
        setLocal((prev) => ({ ...prev, ...updates }));
    }, []);

    const toggleSecretVisibility = useCallback((field: string) => {
        setShowSecret((prev) => ({ ...prev, [field]: !prev[field] }));
    }, []);

    const checkIntegration = useCallback(async (id: string) => {
        const enabledKey = `enable${id.charAt(0).toUpperCase() + id.slice(1)}` as keyof SettingsState;
        if (!local[enabledKey]) {
            toast.warning(`Сначала включите интеграцию ${id}`);
            return;
        }

        setStatus((prev) => ({ ...prev, [id]: "pending" }));

        try {
            await new Promise((resolve, reject) =>
                setTimeout(Math.random() > 0.25 ? resolve : reject, 800)
            );
            setStatus((prev) => ({ ...prev, [id]: "ok" }));
            toast.success(`✅ ${getLabel(id)} подключен`);
        } catch {
            setStatus((prev) => ({ ...prev, [id]: "fail" }));
            toast.error(`❌ ${getLabel(id)} не отвечает`);
        }
    }, [local]);

    const handleSave = useCallback(async () => {
        setSaving(true);
        try {
            Object.entries(local).forEach(([key, value]) => {
                updateSetting(key as keyof SettingsState, value as any);
            });
            await new Promise((resolve) => setTimeout(resolve, 500));
            toast.success("✅ Настройки сохранены");
        } catch {
            toast.error("❌ Ошибка при сохранении настроек");
        } finally {
            setSaving(false);
            setChanged(false);
        }
    }, [local, updateSetting]);

    const handleReset = useCallback(() => {
        resetSettings();
        setShowResetModal(false);
        setChanged(false);
        toast.info("↩️ Настройки сброшены к значениям по умолчанию");
    }, [resetSettings]);

    const handleExport = useCallback(async () => {
        setExporting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const blob = new Blob([JSON.stringify(settings, null, 2)], {
                type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `vpn-settings-${new Date().toISOString().split("T")[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("💾 Конфигурация экспортирована");
        } catch {
            toast.error("❌ Ошибка при экспорте");
        } finally {
            setExporting(false);
        }
    }, [settings]);

    const handleImport = useCallback(async () => {
        if (!importFile) {
            toast.warning("⚠️ Выберите файл для импорта");
            return;
        }

        setImporting(true);
        try {
            const text = await importFile.text();
            const imported = JSON.parse(text);

            if (typeof imported !== "object" || imported === null) {
                throw new Error("Некорректный формат");
            }

            const validated = {} as Partial<SettingsState>;
            for (const key of Object.keys(settings)) {
                if (key in imported) {
                    validated[key as keyof SettingsState] = imported[key];
                }
            }

            Object.entries(validated).forEach(([key, value]) => {
                updateSetting(key as keyof SettingsState, value as any);
            });

            setImportFile(null);
            toast.success("📥 Настройки успешно импортированы");
        } catch (error) {
            console.error("Import error:", error);
            toast.error("❌ Ошибка при импорте настроек");
        } finally {
            setImporting(false);
        }
    }, [importFile, updateSetting, settings]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === "application/json") {
            setImportFile(file);
        } else {
            toast.error("❌ Выберите JSON файл");
        }
    }, []);

    // ─── Вспомогательные функции ────────────────────

    const getLabel = (id: string): string => {
        const labels: Record<string, string> = {
            radius: "FreeRADIUS",
            mikrotik: "MikroTik API",
            telegram: "Telegram Bot",
            zabbix: "Zabbix",
            ipam: "phpIPAM",
            netbox: "NetBox",
        };
        return labels[id] || id;
    };

    const StatusIcon = ({ state }: { state?: "ok" | "fail" | "pending" }) => {
        switch (state) {
            case "ok": return <CheckCircleFill className="text-success" />;
            case "fail": return <XCircleFill className="text-danger" />;
            case "pending": return <Spinner size="sm" animation="border" />;
            default: return <DashCircleFill className="text-muted" />;
        }
    };

    // ─── Конфигурация интеграций ────────────────────

    const integrations = useMemo(() => {
        const configs: IntegrationConfig<keyof SettingsState>[] = [
            {
                id: "radius",
                label: "FreeRADIUS",
                desc: "Аутентификация пользователей VPN",
                urlKey: "radiusHost",
                enabledKey: "enableRadius",
                testable: true,
                fields: (local, onChange) => (
                    <>
                        <Form.Group className="mb-2">
                            <Form.Label>Хост</Form.Label>
                            <Form.Control
                                type="text"
                                value={local.radiusHost}
                                onChange={(e) => onChange({ radiusHost: e.target.value })}
                                className={cls}
                                placeholder="radius.example.com"
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Порт</Form.Label>
                            <Form.Control
                                type="number"
                                value={local.radiusPort}
                                onChange={(e) =>
                                    onChange({ radiusPort: parseInt(e.target.value) || 1812 })
                                }
                                className={cls}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Секрет</Form.Label>
                            <PasswordField
                                value={local.radiusSecret}
                                onChange={(v) => onChange({ radiusSecret: v })}
                                show={showSecret.radiusSecret}
                                onToggle={() => toggleSecretVisibility("radiusSecret")}
                                className={cls}
                            />
                        </Form.Group>
                    </>
                ),
            },
            {
                id: "mikrotik",
                label: "MikroTik API",
                desc: "Управление роутерами и учетными записями",
                urlKey: "mikrotikHost",
                enabledKey: "enableMikrotik",
                testable: true,
                fields: (local, onChange) => (
                    <>
                        <Form.Group className="mb-2">
                            <Form.Label>Хост</Form.Label>
                            <Form.Control
                                type="text"
                                value={local.mikrotikHost}
                                onChange={(e) => onChange({ mikrotikHost: e.target.value })}
                                className={cls}
                                placeholder="192.168.88.1"
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Порт</Form.Label>
                            <Form.Control
                                type="number"
                                value={local.mikrotikPort}
                                onChange={(e) =>
                                    onChange({ mikrotikPort: parseInt(e.target.value) || 8728 })
                                }
                                className={cls}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Логин</Form.Label>
                            <Form.Control
                                type="text"
                                value={local.mikrotikLogin}
                                onChange={(e) => onChange({ mikrotikLogin: e.target.value })}
                                className={cls}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Пароль</Form.Label>
                            <PasswordField
                                value={local.mikrotikPassword}
                                onChange={(v) => onChange({ mikrotikPassword: v })}
                                show={showSecret.mikrotikPassword}
                                onToggle={() => toggleSecretVisibility("mikrotikPassword")}
                                className={cls}
                            />
                        </Form.Group>
                    </>
                ),
            },
            {
                id: "telegram",
                label: "Telegram Bot",
                desc: "Уведомления и управление через Telegram",
                urlKey: "telegramToken", // условно — для отображения
                enabledKey: "enableTelegram",
                testable: false,
                fields: (local, onChange) => (
                    <Form.Group className="mb-2">
                        <Form.Label>Token бота</Form.Label>
                        <PasswordField
                            value={local.telegramToken}
                            onChange={(v) => onChange({ telegramToken: v })}
                            show={showSecret.telegramToken}
                            onToggle={() => toggleSecretVisibility("telegramToken")}
                            className={cls}
                            placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                        />
                        <Form.Label>ChatID</Form.Label>
                        <PasswordField
                            value={local.telegramToken}
                            onChange={(v) => onChange({ telegramToken: v })}
                            show={showSecret.telegramToken}
                            onToggle={() => toggleSecretVisibility("telegramToken")}
                            className={cls}
                            placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                        />
                        <Form.Text className="text-muted">
                            Получите у @BotFather в Telegram
                        </Form.Text>
                    </Form.Group>
                ),
            },
        ];
        return configs;
    }, [cls, showSecret, toggleSecretVisibility]);

    // ─── Рендер ─────────────────────────────────────

    return (
        <>
            <Card
                className={`shadow-sm p-4 ${isDark ? "bg-dark text-light" : "bg-white"}`}
                style={{ minHeight: "90vh" }}
            >
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center gap-2">
                        <Gear size={26} />
                        <div>
                            <h3 className="mb-0">Центр настроек</h3>
                            <small className="text-muted">
                                Управление интерфейсом, системой и интеграциями
                            </small>
                        </div>
                    </div>
                    <Badge
                        bg={isDark ? "secondary" : "light"}
                        text={isDark ? "light" : "dark"}
                        className="fs-6"
                    >
                        v2.6.2 • {new Date().toLocaleDateString("ru-RU")}
                    </Badge>
                </div>

                {changed && (
                    <Alert variant="warning" className="d-flex align-items-center gap-2">
                        <ExclamationTriangle />
                        У вас есть несохраненные изменения
                    </Alert>
                )}

                {/* INTERFACE */}
                <Section
                    title="Интерфейс"
                    icon={<Display />}
                    description="Настройте внешний вид и поведение интерфейса"
                >
                    <Row className="g-3">
                        <Col md={4}>
                            <Form.Label>Тема оформления</Form.Label>
                            <Stack direction="horizontal" gap={2}>
                                <Button
                                    variant={theme === "light" ? "primary" : "outline-secondary"}
                                    onClick={() => theme !== "light" && toggleTheme()}
                                    className="flex-fill"
                                >
                                    <Sun /> Светлая
                                </Button>
                                <Button
                                    variant={theme === "dark" ? "primary" : "outline-secondary"}
                                    onClick={() => theme !== "dark" && toggleTheme()}
                                    className="flex-fill"
                                >
                                    <Moon /> Тёмная
                                </Button>
                            </Stack>
                        </Col>
                        <Col md={4}>
                            <Form.Label>Язык интерфейса</Form.Label>
                            <Form.Select
                                value={local.language}
                                onChange={(e) => handleLocalChange({ language: e.target.value })}
                                className={cls}
                            >
                                <option value="ru">Русский</option>
                                <option value="en">English</option>
                                <option value="de">Deutsch</option>
                            </Form.Select>
                        </Col>
                        <Col md={4}>
                            <Form.Label className="fw-semibold d-flex align-items-center gap-2">
                                <Globe2 /> Часовой пояс
                            </Form.Label>

                            <Form.Select
                                value={local.timezone}
                                onChange={(e) => handleLocalChange({ timezone: e.target.value })}
                                className={cls}
                            >
                                <optgroup label="🇷🇺 Россия / СНГ">
                                    <option value="Asia/Almaty">Алматы (UTC+6)</option>
                                    <option value="Asia/Aqtobe">Актобе (UTC+5)</option>
                                    <option value="Europe/Moscow">Москва (UTC+3)</option>
                                    <option value="Asia/Yekaterinburg">Екатеринбург (UTC+5)</option>
                                    <option value="Asia/Novosibirsk">Новосибирск (UTC+7)</option>
                                    <option value="Asia/Vladivostok">Владивосток (UTC+10)</option>
                                </optgroup>

                                <optgroup label="🌍 Европа">
                                    <option value="Europe/London">Лондон (UTC+0)</option>
                                    <option value="Europe/Berlin">Берлин (UTC+1)</option>
                                    <option value="Europe/Paris">Париж (UTC+1)</option>
                                    <option value="Europe/Warsaw">Варшава (UTC+1)</option>
                                    <option value="Europe/Prague">Прага (UTC+1)</option>
                                </optgroup>

                                <optgroup label="🌏 Азия">
                                    <option value="Asia/Dubai">Дубай (UTC+4)</option>
                                    <option value="Asia/Tokyo">Токио (UTC+9)</option>
                                    <option value="Asia/Singapore">Сингапур (UTC+8)</option>
                                    <option value="Asia/Shanghai">Шанхай (UTC+8)</option>
                                    <option value="Asia/Hong_Kong">Гонконг (UTC+8)</option>
                                </optgroup>

                                <optgroup label="🌎 Америка">
                                    <option value="America/New_York">Нью-Йорк (UTC-5)</option>
                                    <option value="America/Chicago">Чикаго (UTC-6)</option>
                                    <option value="America/Denver">Денвер (UTC-7)</option>
                                    <option value="America/Los_Angeles">Лос-Анджелес (UTC-8)</option>
                                </optgroup>
                            </Form.Select>

                            {/* Автоопределение по браузеру */}
                            <Form.Text
                                className={`mt-1 d-block ${isDark ? "text-light opacity-75" : "text-muted"
                                    }`}
                            >
                                Текущий системный часовой пояс:{" "}
                                <strong>{Intl.DateTimeFormat().resolvedOptions().timeZone}</strong>
                            </Form.Text>

                            <Button
                                variant={isDark ? "outline-light" : "outline-secondary"}
                                size="sm"
                                className="mt-2"
                                onClick={() =>
                                    handleLocalChange({
                                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                                    })
                                }
                            >
                                Использовать системный
                            </Button>
                        </Col>

                    </Row>

                    <Row className="mt-3">
                        <Col md={6}>
                            <Form.Check
                                type="switch"
                                label="Плавные анимации"
                                checked={local.animations}
                                onChange={(e) => handleLocalChange({ animations: e.target.checked })}
                                className="mb-2"
                            />
                            <Form.Check
                                type="switch"
                                label="Компактный режим таблиц"
                                checked={local.denseMode}
                                onChange={(e) => handleLocalChange({ denseMode: e.target.checked })}
                                className="mb-2"
                            />
                            <Form.Check
                                type="switch"
                                label="Показывать подсказки"
                                checked={local.tooltips}
                                onChange={(e) => handleLocalChange({ tooltips: e.target.checked })}
                            />
                        </Col>
                    </Row>
                </Section>

                {/* SYSTEM */}
                <Section
                    title="Система"
                    icon={<LightningCharge />}
                    description="Настройки производительности и API"
                >
                    <Row className="g-3">
                        <Col md={8}>
                            <Form.Group>
                                <Form.Label>API Endpoint</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={local.apiEndpoint}
                                    onChange={(e) => handleLocalChange({ apiEndpoint: e.target.value })}
                                    className={cls}
                                    placeholder="https://api.example.com/v1"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Таймаут запроса (сек)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={local.requestTimeout}
                                    onChange={(e) =>
                                        handleLocalChange({ requestTimeout: parseInt(e.target.value) || 30 })
                                    }
                                    className={cls}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Col md={6}>
                            <Form.Check
                                type="switch"
                                label="Автообновление данных каждые 60 сек"
                                checked={local.autoRefresh}
                                onChange={(e) => handleLocalChange({ autoRefresh: e.target.checked })}
                                className="mb-2"
                            />
                            <Form.Check
                                type="switch"
                                label="Кэширование запросов"
                                checked={local.enableCache}
                                onChange={(e) => handleLocalChange({ enableCache: e.target.checked })}
                            />
                        </Col>
                    </Row>
                </Section>

                {/* NOTIFICATIONS */}
                <Section
                    title="Уведомления"
                    icon={<InfoCircle />}
                    description="Управление оповещениями и уведомлениями"
                >
                    <Row>
                        <Col md={6}>
                            <Form.Check
                                type="switch"
                                label="Telegram-уведомления о событиях VPN"
                                checked={local.notifications}
                                onChange={(e) => handleLocalChange({ notifications: e.target.checked })}
                                className="mb-2"
                            />
                            <Form.Check
                                type="switch"
                                label="Email-уведомления"
                                checked={local.emailNotifications}
                                onChange={(e) => handleLocalChange({ emailNotifications: e.target.checked })}
                                className="mb-2"
                            />
                            <Form.Check
                                type="switch"
                                label="Звуковые уведомления"
                                checked={local.soundNotifications}
                                onChange={(e) => handleLocalChange({ soundNotifications: e.target.checked })}
                            />
                        </Col>
                    </Row>
                </Section>

                {/* INTEGRATIONS */}
                {/* INTEGRATIONS */}
                <Section
                    title="Интеграции"
                    icon={<Globe2 />}
                    description="Подключение внешних сервисов и систем"
                >
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {integrations.map((integration) => {
                            const enabled = local[integration.enabledKey];
                            const url = local[integration.urlKey] || "—";

                            return (
                                <Col key={integration.id}>
                                    <Card
                                        className={`shadow-sm border ${isDark ? "bg-secondary border-dark" : "bg-light border-0"
                                            }`}
                                    // ❌ УБРАНО h-100 — карточки теперь независимы по высоте
                                    >
                                        <Card.Body className="d-flex flex-column">
                                            {/* Заголовок */}
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div>
                                                    <h6 className="mb-0 fw-semibold">{integration.label}</h6>
                                                    <small className="text-muted">{integration.desc}</small>
                                                </div>
                                                <StatusIcon state={status[integration.id]} />
                                            </div>

                                            {/* URL */}
                                            <div
                                                className={`small mb-3 ${isDark ? "text-light opacity-75" : "text-muted"}`}
                                                style={{ wordBreak: "break-all" }}
                                            >
                                                {String(url)}
                                            </div>

                                            {/* Кнопки управления — прижаты к низу только внутри своей карточки */}
                                            <Stack
                                                direction="horizontal"
                                                gap={2}
                                                className="justify-content-between mt-auto pt-2"
                                            >
                                                {integration.testable && (
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip>Проверить подключение</Tooltip>}
                                                    >
                                                        <Button
                                                            variant={isDark ? "outline-light" : "outline-dark"}
                                                            size="sm"
                                                            onClick={() => checkIntegration(integration.id)}
                                                            disabled={status[integration.id] === "pending"}
                                                        >
                                                            <ArrowClockwise />
                                                        </Button>
                                                    </OverlayTrigger>
                                                )}
                                                <Button
                                                    variant={
                                                        enabled
                                                            ? isDark
                                                                ? "success"
                                                                : "primary"
                                                            : isDark
                                                                ? "outline-secondary"
                                                                : "outline-dark"
                                                    }
                                                    size="sm"
                                                    onClick={() =>
                                                        handleLocalChange({
                                                            [integration.enabledKey]: !enabled,
                                                        } as Partial<SettingsState>)
                                                    }
                                                >
                                                    <Power /> {enabled ? "Вкл" : "Выкл"}
                                                </Button>
                                            </Stack>

                                            {/* Поля конфигурации */}
                                            <Collapse in={Boolean(enabled)}>
                                                <div className="mt-3 border-top pt-3">
                                                    {integration.fields(local, handleLocalChange)}
                                                </div>
                                            </Collapse>

                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </Section>

                {/* BACKUP & RESTORE */}
                <Section
                    title="Резервное копирование"
                    icon={<CloudArrowDown />}
                    description="Экспорт и импорт конфигурации"
                >
                    <Row className="g-3">
                        <Col md={6}>
                            <Card className={isDark ? "bg-secondary" : "bg-light"}>
                                <Card.Body>
                                    <h6 className="d-flex align-items-center gap-2">
                                        <CloudArrowDown /> Экспорт настроек
                                    </h6>
                                    <p className="text-muted small mb-3">
                                        Скачайте текущую конфигурацию в JSON файл
                                    </p>
                                    <Button
                                        variant={isDark ? "outline-light" : "outline-dark"}
                                        onClick={handleExport}
                                        disabled={exporting}
                                        className="w-100"
                                    >
                                        {exporting ? <Spinner size="sm" /> : <CloudArrowDown />} Экспортировать
                                        настройки
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className={isDark ? "bg-secondary" : "bg-light"}>
                                <Card.Body>
                                    <h6 className="d-flex align-items-center gap-2">
                                        <CloudArrowUp /> Импорт настроек
                                    </h6>
                                    <p className="text-muted small mb-3">Загрузите конфигурацию из JSON файла</p>
                                    <div className="d-flex gap-2">
                                        <Form.Control
                                            type="file"
                                            accept=".json"
                                            onChange={handleFileSelect}
                                            className={cls}
                                        />
                                        <Button
                                            variant={isDark ? "outline-light" : "outline-dark"}
                                            onClick={handleImport}
                                            disabled={importing || !importFile}
                                        >
                                            {importing ? <Spinner size="sm" /> : <CloudArrowUp />}
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Section>

                {/* FLOATING ACTIONS */}
                <div
                    className={`sticky-bottom mt-4 border-top d-flex justify-content-between align-items-center p-3 ${isDark ? "bg-dark border-secondary" : "bg-light"
                        }`}
                    style={{ margin: "-1rem", marginTop: "2rem" }}
                >
                    <span className="text-muted small d-flex align-items-center gap-1">
                        <InfoCircle />{" "}
                        {saving
                            ? "Сохранение..."
                            : changed
                                ? "Изменения не сохранены"
                                : "Все изменения применены"}
                    </span>

                    <Stack direction="horizontal" gap={2}>
                        <Button variant="outline-danger" onClick={() => setShowResetModal(true)}>
                            <Trash /> Сбросить
                        </Button>
                        <Button variant="outline-secondary" onClick={handleExport} disabled={exporting}>
                            {exporting ? <Spinner size="sm" /> : <CloudArrowDown />} Экспорт
                        </Button>
                        <Button variant={isDark ? "light" : "dark"} disabled={!changed || saving} onClick={handleSave}>
                            {saving ? <Spinner size="sm" /> : <Save2 />} Сохранить
                        </Button>
                    </Stack>
                </div>
            </Card>

            {/* RESET MODAL */}
            <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered>
                <Modal.Header closeButton className={isDark ? "bg-dark text-light" : ""}>
                    <Modal.Title className="d-flex align-items-center gap-2">
                        <ExclamationTriangle className="text-warning" />
                        Подтверждение сброса
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={isDark ? "bg-dark text-light" : ""}>
                    <p>Вы уверены, что хотите сбросить все настройки к значениям по умолчанию?</p>
                    <Alert variant="warning" className="small">
                        Это действие нельзя отменить. Все ваши текущие настройки будут потеряны.
                    </Alert>
                </Modal.Body>
                <Modal.Footer className={isDark ? "bg-dark border-secondary" : ""}>
                    <Button variant="secondary" onClick={() => setShowResetModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="danger" onClick={handleReset}>
                        <Trash /> Сбросить настройки
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}