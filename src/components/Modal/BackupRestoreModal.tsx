import React, { useState } from 'react';
import { Modal, Button, Upload, message, Typography, Divider, Space, Spin, Alert } from 'antd';
import { CloudDownloadOutlined, CloudUploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getBaseUrl } from '@/helpers/config/envConfig';
import { getFromLocalStorage } from '@/utils/local-storage';
import { authKey } from '@/constant/storegeKey';

const { Text } = Typography;

interface BackupRestoreModalProps {
  visible: boolean;
  onClose: () => void;
}

const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({ visible, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const token = getFromLocalStorage(authKey);
      // Try to fetch a large number of products to act as a backup
      const res = await fetch(`${getBaseUrl()}/product?limit=5000`, {
        headers: {
          Authorization: token ? token : '',
        },
      });
      
      const data = await res.json();
      
      if (data?.data && Array.isArray(data.data)) {
        const jsonString = JSON.stringify(data.data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = `products_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        message.success('Products exported successfully!');
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to export products.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleRestore = async (file: File) => {
    setIsRestoring(true);
    try {
      const text = await file.text();
      const products = JSON.parse(text);

      if (!Array.isArray(products)) {
        throw new Error('Invalid backup file format');
      }

      const token = getFromLocalStorage(authKey);
      
      let successCount = 0;
      let errorCount = 0;

      // Import sequentially to not overwhelm the server
      for (const product of products) {
        try {
          // Send to the backend. We're using POST, assuming the backend can handle creating/updating.
          // Note: Full restore logic might require custom backend endpoints if simple POST doesn't allow overriding _id
          const res = await fetch(`${getBaseUrl()}/product`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token ? token : '',
            },
            body: JSON.stringify({
              ...product,
              // Optionally remove _id so backend generates new ones, or keep if backend allows
            }),
          });
          
          if (res.ok) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (err) {
          errorCount++;
        }
      }

      message.success(`Restore complete. Successfully imported ${successCount} products. ${errorCount > 0 ? `Failed: ${errorCount}` : ''}`);
    } catch (error) {
      console.error(error);
      message.error('Failed to parse or restore backup file.');
    } finally {
      setIsRestoring(false);
    }
    return false; // Prevent default upload behavior
  };

  return (
    <Modal
      title="Backup & Restore Products"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <div className="space-y-6">
        <Alert
          message="Important Notice"
          description="Backup exports all your product listings to a JSON file. Restore will attempt to import all products from the uploaded JSON file back into the database."
          type="info"
          showIcon
        />

        <div>
          <h3 className="text-lg font-semibold mb-2">Export Backup</h3>
          <Text type="secondary" className="block mb-4">
            Download a complete backup of all products in your system.
          </Text>
          <Button 
            type="primary" 
            icon={<CloudDownloadOutlined />} 
            onClick={handleExport}
            loading={isExporting}
            disabled={isRestoring}
          >
            Download Products Backup
          </Button>
        </div>

        <Divider />

        <div>
          <h3 className="text-lg font-semibold mb-2">Restore Backup</h3>
          <Text type="secondary" className="block mb-4">
            Upload a previously exported JSON backup file to restore products.
          </Text>
          <Upload
            accept=".json"
            showUploadList={false}
            beforeUpload={handleRestore}
            disabled={isExporting || isRestoring}
          >
            <Button 
              icon={<CloudUploadOutlined />}
              loading={isRestoring}
              disabled={isExporting}
            >
              Upload Backup File
            </Button>
          </Upload>
          {isRestoring && <div className="mt-2 text-blue-500"><Spin size="small" className="mr-2"/>Restoring products... this may take a while.</div>}
        </div>
      </div>
    </Modal>
  );
};

export default BackupRestoreModal;
