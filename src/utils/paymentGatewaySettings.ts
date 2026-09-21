export type PaymentGatewayMode = 'sandbox' | 'live';
export type ActivePaymentGateway = 'eps';

export type PaymentGatewaySettings = {
  activeGateway: ActivePaymentGateway;
  mode: PaymentGatewayMode;
  epsApiKey: string;
  enabled: boolean;
  updatedAt: string;
};

export const PAYMENT_GATEWAY_SETTINGS_KEY = 'carclickbd_payment_gateway_settings';

export const defaultPaymentGatewaySettings: PaymentGatewaySettings = {
  activeGateway: 'eps',
  mode: 'sandbox',
  epsApiKey: '',
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
  return 'eps';
};

export const isGatewayConfigured = (_gateway: ActivePaymentGateway): boolean => {
  const settings = getPaymentGatewaySettings();
  return settings.enabled;
};
