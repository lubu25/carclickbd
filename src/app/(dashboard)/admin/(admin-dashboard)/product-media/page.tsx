"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, message, Upload, Spin, Row, Col, Card } from "antd";
import { UploadOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";

export default function ProductMediaManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [backups, setBackups] = useState<string[]>([]);
  const [backupLoading, setBackupLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchBackups();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/local-products");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      message.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchBackups = async () => {
    try {
      const res = await fetch("/api/local-products/backup");
      const data = await res.json();
      if (Array.isArray(data)) {
        setBackups(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/local-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(products),
      });
      if (res.ok) {
        message.success("Products updated successfully");
      } else {
        message.error("Failed to update products");
      }
    } catch (error) {
      message.error("Error saving data");
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    setBackupLoading(true);
    try {
      const res = await fetch("/api/local-products/backup", { method: "POST" });
      if (res.ok) {
        message.success("Backup created successfully");
        fetchBackups();
      } else {
        message.error("Failed to create backup");
      }
    } catch (error) {
      message.error("Error creating backup");
    } finally {
      setBackupLoading(false);
    }
  };

  const restoreBackup = async (filename: string) => {
    setBackupLoading(true);
    try {
      const res = await fetch("/api/local-products/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      if (res.ok) {
        message.success("Backup restored successfully");
        fetchProducts();
      } else {
        message.error("Failed to restore backup");
      }
    } catch (error) {
      message.error("Error restoring backup");
    } finally {
      setBackupLoading(false);
    }
  };

  const updateProductPhoto = (index: number, type: 'mainPhoto' | 'others', val: any) => {
    const newProducts = [...products];
    if (type === 'mainPhoto') {
      newProducts[index].photos.mainPhoto = val;
    } else {
      newProducts[index].photos.others = val;
    }
    setProducts(newProducts);
  };

  const updateHighlights = (index: number, val: string) => {
    const newProducts = [...products];
    newProducts[index].highlights = val.split("\n");
    setProducts(newProducts);
  };

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <h2>Product Media & Description Management</h2>
        <div>
          <Button type="primary" onClick={handleSave} icon={<SaveOutlined />} style={{ marginRight: 8 }}>
            Save All Changes
          </Button>
          <Button type="dashed" onClick={createBackup} loading={backupLoading}>
            Create Backup
          </Button>
        </div>
      </Row>

      {backups.length > 0 && (
        <Card title="Available Backups" style={{ marginBottom: 24 }}>
          {backups.map((bkp) => (
            <div key={bkp} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>{bkp}</span>
              <Button size="small" onClick={() => restoreBackup(bkp)}>Restore</Button>
            </div>
          ))}
        </Card>
      )}

      {loading ? (
        <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: 50 }} />
      ) : (
        <Row gutter={[16, 16]}>
          {products.map((prod, index) => (
            <Col xs={24} md={12} key={prod._id || index}>
              <Card title={`${prod.make} ${prod.model} - ${prod.vin}`}>
                <div>
                  <strong>Main Photo URL:</strong>
                  <Input 
                    value={prod.photos?.mainPhoto || ''} 
                    onChange={(e) => updateProductPhoto(index, 'mainPhoto', e.target.value)} 
                    style={{ marginBottom: 8 }}
                  />
                  {prod.photos?.mainPhoto && (
                    <img src={prod.photos.mainPhoto} alt="Main" style={{ width: 100, height: 60, objectFit: 'cover', marginBottom: 16 }} />
                  )}
                </div>

                <div>
                  <strong>Other Photos (Comma separated URLs):</strong>
                  <Input.TextArea 
                    rows={3} 
                    value={(prod.photos?.others || []).join(",\n")} 
                    onChange={(e) => updateProductPhoto(index, 'others', e.target.value.split(",\n").map(s => s.trim()).filter(Boolean))}
                    style={{ marginBottom: 8 }}
                  />
                </div>

                <div>
                  <strong>Description / Highlights:</strong>
                  <Input.TextArea 
                    rows={5} 
                    value={(prod.highlights || []).join("\n")} 
                    onChange={(e) => updateHighlights(index, e.target.value)}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
