import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface SettingsState {
    radiusPort: string | number | string[] | undefined;
    mikrotikPort: string | number | string[] | undefined;
    mikrotikPassword: string;
    timezone: string | number | readonly string[] | undefined;
    tooltips: boolean | undefined;
    requestTimeout: string | number | string[] | undefined;
    enableCache: boolean | undefined;
    emailNotifications: boolean | undefined;
    soundNotifications: boolean | undefined;
    language: string;
    autoRefresh: boolean;
    apiEndpoint: string;
    notifications: boolean;
    denseMode: boolean;
    animations: boolean;
    refreshInterval: number;

    // Integrations
    enableRadius: boolean;
    radiusHost: string;
    radiusSecret: string;

    enableMikrotik: boolean;
    mikrotikHost: string;
    mikrotikLogin: string;

    enableTelegram: boolean;
    telegramToken: string;

    enableZabbix: boolean;
    zabbixURL: string;

    enableIpam: boolean;
    ipamURL: string;
    ipamToken: string;

    enableNetbox: boolean;
    netboxURL: string;
    netboxToken: string;
}

const defaultSettings: SettingsState = {
    language: "ru",
    autoRefresh: true,
    apiEndpoint: "https://api.vpn.satory.kz",
    notifications: true,
    denseMode: false,
    animations: true,
    refreshInterval: 60,

    enableRadius: true,
    radiusHost: "10.216.201.5",
    radiusSecret: "radius_secret",

    enableMikrotik: true,
    mikrotikHost: "10.216.200.1",
    mikrotikLogin: "api_admin",

    enableTelegram: true,
    telegramToken: "123456789:ABC-DEF1234",

    enableZabbix: true,
    zabbixURL: "https://zabbix.satory.kz",

    enableIpam: true,
    ipamURL: "https://ipam.satory.kz/api/",
    ipamToken: "",

    enableNetbox: true,
    netboxURL: "https://netbox.satory.kz/api/",
    netboxToken: "",
    radiusPort: undefined,
    mikrotikPort: undefined,
    mikrotikPassword: "",
    timezone: undefined,
    tooltips: undefined,
    requestTimeout: undefined,
    enableCache: undefined,
    emailNotifications: undefined,
    soundNotifications: undefined
};

interface SettingsContextType {
    settings: SettingsState;
    updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
    resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<SettingsState>(() => {
        const saved = localStorage.getItem("vpn-settings");
        return saved ? JSON.parse(saved) : defaultSettings;
    });

    useEffect(() => {
        localStorage.setItem("vpn-settings", JSON.stringify(settings));
    }, [settings]);

    const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
        localStorage.setItem("vpn-settings", JSON.stringify(defaultSettings));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error("useSettings must be used within SettingsProvider");
    return context;
};
