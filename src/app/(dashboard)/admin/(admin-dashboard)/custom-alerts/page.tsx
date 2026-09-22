"use client";
import React, { useEffect, useState } from 'react';
import { Button, Alert, Space, Typography } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined, CloseCircleOutlined, BellOutlined } from '@ant-design/icons';
// import { cn } from '@/lib/utils';  // Removed cn import

interface CustomAlertProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  description?: string;
  closable?: boolean;
  onClose?: () => void;
  duration?: number; // Added duration for auto-dismiss
}

const CustomAlert: React.FC<CustomAlertProps> = ({ type, message, description, closable = true, onClose, duration }) => {
  const [visible, setVisible] = useState(true);

  // Auto-dismiss logic
  useEffect(() => {
    if (visible && duration) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.(); // Call the onClose callback if provided
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  if (!visible) {
    return null;
  }

  return (
    <Alert
      message={message}
      description={description}
      type={type}
      showIcon
      closable={closable}
      onClose={handleClose}
      className={
        'mb-4 transition-all duration-300 shadow-lg rounded-md py-4 px-4 flex items-start gap-3 ' +
        (type === 'success'
          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-400 dark:border-green-600'
          : type === 'error'
          ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-400 dark:border-red-600'
          : type === 'info'
          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-400 dark:border-blue-600'
          : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-400 dark:border-yellow-600')
      }
      icon={
        type === 'success' ? (
          <CheckCircleOutlined className="text-green-500 dark:text-green-300 h-5 w-5 mt-0.5" />
        ) : type === 'error' ? (
          <CloseCircleOutlined className="text-red-500 dark:text-red-300 h-5 w-5 mt-0.5" />
        ) : type === 'info' ? (
          <InfoCircleOutlined className="text-blue-500 dark:text-blue-300 h-5 w-5 mt-0.5" />
        ) : (
          <ExclamationCircleOutlined className="text-yellow-500 dark:text-yellow-300 h-5 w-5 mt-0.5" />
        )
      }
    />
  );
};

const CustomAlertsPage = () => {
  const [alerts, setAlerts] = useState<CustomAlertProps[]>([]);

  const addAlert = (alert: Omit<CustomAlertProps, 'onClose'>) => {
    const newAlert = {
      ...alert,
      onClose: () => removeAlert(alert.message), // Pass message to removeAlert
    };
    setAlerts([...alerts, newAlert]);
  };

  const removeAlert = (messageToRemove: string) => {
    setAlerts(alerts.filter(alert => alert.message !== messageToRemove));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-2">
        <BellOutlined className="text-red-500" /> Custom Alerts
      </h1>

      <div className="space-y-6">
        {/* Trigger Alerts Section */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-6">
          <h2 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Trigger Alerts</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Click the buttons below to display custom alerts with different types and configurations.
          </p>
          <Space className="mb-4 flex flex-wrap gap-2">
            <Button type="primary" onClick={() => addAlert({ type: 'success', message: 'Success!', description: 'Operation completed successfully.' })}>
              Show Success Alert
            </Button>
            <Button danger onClick={() => addAlert({ type: 'error', message: 'Error!', description: 'Failed to process the request.' })}>
              Show Error Alert
            </Button>
            <Button  onClick={() => addAlert({ type: 'info', message: 'Information', description: 'Here is some useful information.' })}>
              Show Info Alert
            </Button>
            <Button  onClick={() => addAlert({ type: 'warning', message: 'Warning!', description: 'Please be aware of potential issues.' })}>
              Show Warning Alert
            </Button>
            <Button onClick={() => addAlert({ type: 'info', message: 'Closable Alert', description: 'This alert can be dismissed by the user.', closable: true })}>
              Show Closable Alert
            </Button>
             <Button onClick={() => addAlert({ type: 'info', message: 'Auto-Dismiss Alert', description: 'This alert will automatically dismiss after 3 seconds.', duration: 3000 })}>
              Show Auto-Dismiss Alert (3s)
            </Button>
            <Button onClick={() => clearAllAlerts()}>
                Clear All Alerts
            </Button>
          </Space>
        </div>

        {/* Displayed Alerts */}
        <div>
          <h2 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">Displayed Alerts</h2>
          {alerts.length === 0 ? (
            <Typography.Text className="text-gray-500 dark:text-gray-400">No alerts to display.</Typography.Text>
          ) : (
            <Space direction="vertical" className="w-full">
              {alerts.map((alertProps) => (
                <CustomAlert
                  key={alertProps.message} // Use message as key
                  {...alertProps}
                />
              ))}
            </Space>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomAlertsPage;
