export type PaymentGatewayMode = 'sandbox' | 'live';
export type ActivePaymentGateway = 'bdgate' | 'eps';

export type PaymentGatewaySettings = {
  activeGateway: ActivePaymentGateway;
  mode: PaymentGatewayMode;
  epsApiKey: string;
  bdGateApiKey: string;
  enabled: boolean;
  updatedAt: string;
};

export const PAYMENT_GATEWAY_SETTINGS_KEY = 'carclickbd_payment_gateway_settings';

export const defaultPaymentGatewaySettings: PaymentGatewaySettings = {
  activeGateway: 'bdgate',
  mode: 'sandbox',
  epsApiKey: '',
  bdGateApiKey: '',
  enabled: true,
  updatedAt: '',
};

export const getPaymentGatewaySettings = (): PaymentGatewaySettings => {
  if (typeof window === 'undefined') {
    return defaultPaymentGatewaySettings;
  }

  try {
    const rawSettings = window.localStorage.getItem(PAYMENT_GATEWAY_SETTINGS_KEY);

    if (!rawSettings) {
      return defaultPaymentGatewaySettings;
    }

    return {
      ...defaultPaymentGatewaySettings,
      ...JSON.parse(rawSettings),
    };
  } catch (error) {
    console.error('Failed to load payment gateway settings', error);
    return defaultPaymentGatewaySettings;
  }
};

export const savePaymentGatewaySettings = (
  nextSettings: Partial<PaymentGatewaySettings>,
): PaymentGatewaySettings => {
  if (typeof window === 'undefined') {
    return defaultPaymentGatewaySettings;
  }

  const mergedSettings: PaymentGatewaySettings = {
    ...defaultPaymentGatewaySettings,
    ...getPaymentGatewaySettings(),
    ...nextSettings,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(
    PAYMENT_GATEWAY_SETTINGS_KEY,
    JSON.stringify(mergedSettings),
  );

  return mergedSettings;
};

export const getActivePaymentGateway = (): ActivePaymentGateway => {
  const settings = getPaymentGatewaySettings();

  if (!settings.enabled) {
    return 'bdgate';
  }

  if (settings.activeGateway === 'eps' && !settings.epsApiKey.trim()) {
    return 'bdgate';
  }

  return settings.activeGateway;
};

export const isGatewayConfigured = (gateway: ActivePaymentGateway): boolean => {
  const settings = getPaymentGatewaySettings();

  if (!settings.enabled) {
    return false;
  }

  if (gateway === 'eps') {
    return Boolean(settings.epsApiKey?.trim());
  }

  return Boolean(settings.bdGateApiKey?.trim()) || settings.activeGateway === 'bdgate';
};
