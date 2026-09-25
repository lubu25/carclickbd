"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  CreditCard,
  Save,
  ShieldCheck,
  Store,
  User,
  Key,
  Lock,
  RefreshCw,
  Globe,
  Settings,
  Info,
  CheckCircle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface EpsConfig {
  merchantId: string;
  storeId: string;
  userName: string;
  password: string;
  hashKey: string;
  gatewayUrl: string;
  isSandbox: boolean;
  isActive: boolean;
  isSandboxEnvConfigured?: boolean;
}

export default function PaymentGatewaySettings() {
  const [config, setConfig] = useState<EpsConfig>({
    merchantId: "",
    storeId: "",
    userName: "",
    password: "",
    hashKey: "",
    gatewayUrl: "https://sandbox.eps.com.bd/payment",
    isSandbox: true,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [testAmount, setTestAmount] = useState<number>(10);
  // Tracks whether active credentials come from environment variables (permanent)
  // or from the local admin-panel save (session-only, lost on redeploy)
  const [envVarsActive, setEnvVarsActive] = useState(false);
  const [sandboxModeIsPersistent, setSandboxModeIsPersistent] = useState(false);

  const fetchConfig = useCallback(async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/eps/config");
      const data = await res.json();
      if (data.success && data.data) {
        const cfg = data.data;
        setConfig({
          ...cfg,
          gatewayUrl: cfg.gatewayUrl || "https://sandbox.eps.com.bd/payment",
        });
        // If merchantId is already filled, env vars are working
        setEnvVarsActive(!!cfg.merchantId);
        setSandboxModeIsPersistent(cfg.isSandboxEnvConfigured === true);
      }
    } catch (error) {
      console.error("Failed to load EPS config:", error);
      toast.error("Failed to load configuration.");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSandboxChange = (isSandbox: boolean) => {
    setConfig((prev) => ({
      ...prev,
      isSandbox,
      gatewayUrl: isSandbox
        ? "https://sandbox.eps.com.bd/payment"
        : "https://eps.com.bd/payment",
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/eps/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          sandboxModeIsPersistent
            ? "Payment Gateway settings saved. The hosting environment controls the payment mode."
            : `Settings saved for this deployment. Add EPS_IS_SANDBOX=${config.isSandbox ? "true" : "false"} in Hostinger to keep ${config.isSandbox ? "Sandbox" : "Live Mode"} after redeploys.`,
        );
      } else {
        toast.error("Failed to save settings: " + data.message);
      }
    } catch {
      toast.error("An error occurred while saving settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/eps/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: testAmount,
          chassis: "TEST-CHASSIS-123",
          name: "Test Admin User",
          email: "admin@example.com",
          mobileNumber: "01700000000",
          address: "Dhaka, Bangladesh",
        }),
      });
      const data = await res.json();
      setTestResult(data);
      if (data.success) {
        toast.success("Test payment link generated successfully!");
      } else {
        toast.error("Test failed: " + data.message);
      }
    } catch (e: any) {
      setTestResult({ success: false, message: e.message || "Connection error" });
      toast.error("Connection error during testing!");
    } finally {
      setTesting(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header Section */}
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-slate-900">
            <CreditCard className="h-8 w-8 text-blue-600" />
            Payment Gateway Setup
          </h1>
          <p className="mt-2 text-base text-slate-500">
            Configure your EPS (Easy Payment System) credentials to enable secure live payments on your platform.
          </p>
        </div>

        {/* Permanent Status Banner */}
        <div className={`flex items-start gap-4 rounded-2xl border p-5 ${
          envVarsActive
            ? "border-green-200 bg-green-50"
            : "border-amber-200 bg-amber-50"
        }`}>
          {envVarsActive ? (
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
          ) : (
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          )}
          <div className="space-y-1">
            <p className={`text-sm font-semibold ${
              envVarsActive ? "text-green-800" : "text-amber-800"
            }`}>
              {envVarsActive
                ? "✅ Credentials loaded from Hostinger Environment Variables (Permanent)"
                : "⚠️ Credentials not found in Environment Variables"}
            </p>
            <p className={`text-xs leading-relaxed ${
              envVarsActive ? "text-green-700" : "text-amber-700"
            }`}>
              {envVarsActive
                ? "Payment gateway will stay connected even after every website update or deployment. The values shown below are read from your Hostinger hPanel environment variables."
                : "Go to Hostinger hPanel → Websites → Node.js → Environment Variables and add EPS_MERCHANT_ID, EPS_STORE_ID, EPS_USERNAME, EPS_PASSWORD, EPS_HASH_KEY, EPS_IS_SANDBOX=false, EPS_IS_ACTIVE=true. Do this once and the gateway will never disconnect on deployment again."}
            </p>
          </div>
        </div>

        {!sandboxModeIsPersistent && (
          <div
            role="alert"
            className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900"
          >
            <p className="font-semibold">Payment mode is not permanent yet</p>
            <p className="mt-1 leading-6">
              The current mode is saved only for this deployment and can revert
              after a GitHub redeploy. To keep the selected{" "}
              {config.isSandbox ? "Sandbox" : "Live"} mode, add{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 font-bold">
                EPS_IS_SANDBOX={config.isSandbox ? "true" : "false"}
              </code>{" "}
              to the <strong>carclickbd.com frontend</strong> environment
              variables in Hostinger, then redeploy. The environment variable
              will take priority over this temporary setting.
            </p>
            {!config.isSandbox && (
              <p className="mt-2 leading-6">
                Before switching real payments on, confirm these are your live
                EPS Merchant ID, Store ID, username, password, and hash key.
              </p>
            )}
          </div>
        )}

        {/* Status Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-900">Gateway Status</h3>
              <p className="text-sm text-slate-500">Enable or disable payments site-wide</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                name="isActive"
                className="peer sr-only"
                checked={config.isActive}
                onChange={handleChange}
              />
              <div className="peer h-7 w-14 rounded-full bg-slate-200 after:absolute after:left-[4px] after:top-[4px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
            </label>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-900">Environment</h3>
              <p className="text-sm text-slate-500">Switch between Testing and Live mode</p>
            </div>
            <div className="flex rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => handleSandboxChange(true)}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                  config.isSandbox
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sandbox
              </button>
              <button
                type="button"
                onClick={() => handleSandboxChange(false)}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                  !config.isSandbox
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Live Mode
              </button>
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <Settings className="h-5 w-5 text-slate-500" />
              EPS Merchant Credentials
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Provide the required keys exactly as shown in your EPS Merchant Dashboard.
            </p>
          </div>

          <form onSubmit={handleSave} className="p-8">
            <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Merchant ID</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <ShieldCheck className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="merchantId"
                    value={config.merchantId}
                    onChange={handleChange}
                    placeholder="Enter your Merchant ID"
                    className="block w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Store ID</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Store className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="storeId"
                    value={config.storeId}
                    onChange={handleChange}
                    placeholder="Enter your Store ID"
                    className="block w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">User Name</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="userName"
                    value={config.userName}
                    onChange={handleChange}
                    placeholder="Enter EPS User Name"
                    className="block w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={config.password}
                    onChange={handleChange}
                    placeholder="Enter EPS Password"
                    className="block w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Hash Key</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Key className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    name="hashKey"
                    value={config.hashKey}
                    onChange={handleChange}
                    placeholder="Enter your Secret Hash Key"
                    className="block w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">Gateway URL (Auto-configured based on mode)</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Globe className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="gatewayUrl"
                    value={config.gatewayUrl}
                    readOnly
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={fetchConfig}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                Discard Changes
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save & Make Live
              </button>
            </div>
          </form>
        </div>

        {/* Testing Section */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-12">
          <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-5 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                Live Gateway Testing
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Test your configuration to ensure the payment gateway generates links correctly.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="text-sm font-medium text-slate-500">Amount (BDT):</span>
                <input
                  type="number"
                  min="10"
                  value={testAmount}
                  onChange={(e) => setTestAmount(Number(e.target.value))}
                  className="w-24 outline-none text-sm font-semibold text-slate-900 bg-transparent"
                />
              </div>
              <button
                type="button"
                onClick={handleTest}
                disabled={testing || !config.merchantId}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {testing ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Run Test"}
              </button>
            </div>
          </div>
          
          {testResult && (
            <div className="p-8">
              {testResult.success ? (
                <div className="rounded-xl border border-green-200 bg-green-50 p-6">
                  <h3 className="text-sm font-bold text-green-800 mb-2">✅ Test Successful! Payment link generated.</h3>
                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-green-700">Order ID:</p>
                      <p className="font-mono text-sm text-green-900 bg-white/60 p-2 rounded border border-green-100 inline-block mt-1">{testResult.data?.orderId}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-green-700">Payment URL:</p>
                      <div className="flex items-center gap-2 mt-1">
                        <input 
                          readOnly 
                          value={testResult.data?.payment_url} 
                          className="w-full text-xs p-2 rounded bg-white/60 border border-green-100 text-green-900 outline-none font-mono"
                        />
                        <a 
                          href={testResult.data?.payment_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-4 py-2 bg-green-600 text-white rounded text-xs font-bold hover:bg-green-700 transition-colors whitespace-nowrap"
                        >
                          Open Link
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                  <h3 className="text-sm font-bold text-red-800 mb-2">❌ Test Failed</h3>
                  <p className="text-sm text-red-700">
                    {testResult.message || "Failed to generate payment link. Please check your credentials and try again."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
