'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Modal, message, Space, Switch } from 'antd';
import { Trash2, Plus } from 'lucide-react';
import axios from 'axios';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountAmount: '',
    discountType: 'fixed',
    isActive: true
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/coupons');
      if (res.data.success) {
        setCoupons(res.data.data);
      }
    } catch (error) {
      message.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async () => {
    if (!newCoupon.code || !newCoupon.discountAmount) {
      message.error('Code and discount amount are required');
      return;
    }
    
    try {
      const res = await axios.post('/api/coupons', newCoupon);
      if (res.data.success) {
        message.success('Coupon created successfully');
        setIsModalOpen(false);
        setNewCoupon({ code: '', discountAmount: '', discountType: 'fixed', isActive: true });
        fetchCoupons();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/api/coupons/${id}`);
      if (res.data.success) {
        message.success('Coupon deleted');
        fetchCoupons();
      }
    } catch (error) {
      message.error('Failed to delete coupon');
    }
  };
  
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await axios.patch(`/api/coupons/${id}`, { isActive: !currentStatus });
      if (res.data.success) {
        message.success('Coupon status updated');
        fetchCoupons();
      }
    } catch (error) {
      message.error('Failed to update coupon status');
    }
  };

  const columns = [
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { 
      title: 'Discount', 
      key: 'discount',
      render: (record: any) => `${record.discountAmount} ${record.discountType === 'percentage' ? '%' : 'BDT'}`
    },
    { 
      title: 'Active', 
      key: 'isActive',
      render: (record: any) => (
        <Switch 
          checked={record.isActive} 
          onChange={() => handleToggleActive(record.id, record.isActive)} 
        />
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: any) => (
        <Button 
          danger 
          icon={<Trash2 size={16} />} 
          onClick={() => handleDelete(record.id)} 
        />
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Coupons</h1>
        <Button 
          type="primary" 
          icon={<Plus size={16} />} 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600"
        >
          Add Coupon
        </Button>
      </div>

      <Table 
        dataSource={coupons} 
        columns={columns} 
        rowKey="id" 
        loading={loading} 
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Create New Coupon"
        open={isModalOpen}
        onOk={handleCreate}
        onCancel={() => setIsModalOpen(false)}
        okText="Create"
      >
        <div className="space-y-4 pt-4">
          <div>
            <label className="block mb-1 font-medium">Coupon Code</label>
            <Input 
              value={newCoupon.code} 
              onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
              placeholder="e.g. TEST100" 
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Discount Amount</label>
            <Input 
              type="number"
              value={newCoupon.discountAmount} 
              onChange={e => setNewCoupon({...newCoupon, discountAmount: e.target.value})}
              placeholder="e.g. 100" 
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Discount Type</label>
            <Select 
              className="w-full"
              value={newCoupon.discountType}
              onChange={val => setNewCoupon({...newCoupon, discountType: val})}
              options={[
                { value: 'fixed', label: 'Fixed Amount (BDT)' },
                { value: 'percentage', label: 'Percentage (%)' }
              ]}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch 
              checked={newCoupon.isActive}
              onChange={val => setNewCoupon({...newCoupon, isActive: val})}
            />
            <label className="font-medium">Active</label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
