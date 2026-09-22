"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Space,
  Button,
  Tag,
  Typography,
  Popconfirm,
  message,
  Input,
  Select,
  Badge,
  Avatar,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/en";

interface SupportTicket {
  id: string;
  subject: string;
  customerName: string;
  email: string;
  status: "open" | "pending" | "closed";
  priority: "high" | "medium" | "low";
  createdDate: string;
  lastUpdated: string;
  department: string;
  agent?: string; // Optional agent assigned
  messages: Message[];
}

interface Message {
  id: string;
  sender: "customer" | "agent";
  text: string;
  sentDate: string;
}

const SupportTicketPage = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null); // 'open', 'pending', 'closed'
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null); // 'high', 'medium', 'low'
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [replyText, setReplyText] = useState("");

  // Mock Data (Replace with actual API calls)
  const generateMockData = (): SupportTicket[] => {
    const today = dayjs();
    const data: SupportTicket[] = [
      {
        id: "1",
        subject: "Product Inquiry",
        customerName: "John Doe",
        email: "john.doe@example.com",
        status: "open",
        priority: "medium",
        createdDate: today.subtract(3, "days").format("YYYY-MM-DD HH:mm:ss"),
        lastUpdated: today.subtract(3, "days").format("YYYY-MM-DD HH:mm:ss"),
        department: "Sales",
        messages: [
          {
            id: "1",
            sender: "customer",
            text: "I have a question about product pricing.",
            sentDate: today.subtract(3, "days").format("YYYY-MM-DD HH:mm:ss"),
          },
        ],
      },
      {
        id: "2",
        subject: "Order Issue",
        customerName: "Jane Smith",
        email: "jane.smith@example.com",
        status: "pending",
        priority: "high",
        createdDate: today.subtract(1, "days").format("YYYY-MM-DD HH:mm:ss"),
        lastUpdated: today.subtract(1, "days").format("YYYY-MM-DD HH:mm:ss"),
        department: "Support",
        agent: "Agent Smith",
        messages: [
          {
            id: "1",
            sender: "customer",
            text: "My order has not arrived yet.",
            sentDate: today.subtract(1, "days").format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            id: "2",
            sender: "agent",
            text: "We are looking into your order.  Can you provide your order number?",
            sentDate: today.subtract(1, "days").format("YYYY-MM-DD HH:mm:ss"),
          },
        ],
      },
      {
        id: "3",
        subject: "Refund Request",
        customerName: "Bob Johnson",
        email: "bob.johnson@example.com",
        status: "closed",
        priority: "low",
        createdDate: today.subtract(7, "days").format("YYYY-MM-DD HH:mm:ss"),
        lastUpdated: today.subtract(2, "days").format("YYYY-MM-DD HH:mm:ss"),
        department: "Finance",
        agent: "Agent Lee",
        messages: [
          {
            id: "1",
            sender: "customer",
            text: "I would like to request a refund.",
            sentDate: today.subtract(7, "days").format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            id: "2",
            sender: "agent",
            text: "What is the reason for your refund request?",
            sentDate: today.subtract(7, "days").format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            id: "3",
            sender: "customer",
            text: "The product was damaged.",
            sentDate: today.subtract(6, "days").format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            id: "4",
            sender: "agent",
            text: "Your refund has been processed.",
            sentDate: today.subtract(2, "days").format("YYYY-MM-DD HH:mm:ss"),
          },
        ],
      },
      {
        id: "4",
        subject: "Account Help",
        customerName: "Alice Brown",
        email: "alice.brown@example.com",
        status: "open",
        priority: "medium",
        createdDate: today.subtract(2, "days").format("YYYY-MM-DD HH:mm:ss"),
        lastUpdated: today.subtract(2, "days").format("YYYY-MM-DD HH:mm:ss"),
        department: "Support",
        messages: [
          {
            id: "1",
            sender: "customer",
            text: "I need help resetting my password.",
            sentDate: today.subtract(2, "days").format("YYYY-MM-DD HH:mm:ss"),
          },
        ],
      },
      {
        id: "5",
        subject: "Shipping Inquiry",
        customerName: "Mike Wilson",
        email: "mike.wilson@example.com",
        status: "pending",
        priority: "high",
        createdDate: today.subtract(4, "days").format("YYYY-MM-DD HH:mm:ss"),
        lastUpdated: today.subtract(1, "days").format("YYYY-MM-DD HH:mm:ss"),
        department: "Shipping",
        agent: "Agent Johnson",
        messages: [
          {
            id: "1",
            sender: "customer",
            text: "Where is my package?",
            sentDate: today.subtract(4, "days").format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            id: "2",
            sender: "agent",
            text: "Can you provide the tracking number?",
            sentDate: today.subtract(4, "days").format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            id: "3",
            sender: "customer",
            text: "Tracking: 1234567890",
            sentDate: today.subtract(3, "days").format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            id: "4",
            sender: "agent",
            text: "Your package is out for delivery.",
            sentDate: today.subtract(1, "days").format("YYYY-MM-DD HH:mm:ss"),
          },
        ],
      },
    ];
    return data;
  };

  // Fetch Data
  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      const data = generateMockData();
      setTickets(data);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleViewTicket = (id: string) => {
    const ticket = tickets.find((t) => t.id === id);
    setSelectedTicket(ticket || null);
  };

  const handleCloseTicket = (id: string) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === id ? { ...ticket, status: "closed" } : ticket
      )
    );
    setSelectedTicket(null); // Close the detail view
    message.success("Ticket closed successfully");
  };

  const handleReply = (id: string) => {
    if (!replyText.trim()) {
      message.error("Please enter a reply.");
      return;
    }

    const newReply: Message = {
      id: String(Date.now()), // Simple unique ID
      sender: "agent", //  agent is sending the reply
      text: replyText,
      sentDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };

    setTickets((prevTickets) =>
      prevTickets.map((ticket) => {
        if (ticket.id === id) {
          return {
            ...ticket,
            messages: [...ticket.messages, newReply],
            lastUpdated: dayjs().format("YYYY-MM-DD HH:mm:ss"), // update lastUpdated
            status: ticket.status === "open" ? "pending" : ticket.status, // Move to pending if it was open
          };
        }
        return ticket;
      })
    );
    setReplyText(""); // Clear the reply input
    message.success("Reply sent");
  };

  const getStatusTag = (status: SupportTicket["status"]) => {
    switch (status) {
      case "open":
        return <Tag color="green">Open</Tag>;
      case "pending":
        return <Tag color="yellow">Pending</Tag>;
      case "closed":
        return <Tag color="red">Closed</Tag>;
      default:
        return null;
    }
  };

  const getPriorityTag = (priority: SupportTicket["priority"]) => {
    switch (priority) {
      case "high":
        return <Tag color="red">High</Tag>;
      case "medium":
        return <Tag color="yellow">Medium</Tag>;
      case "low":
        return <Tag color="blue">Low</Tag>;
      default:
        return null;
    }
  };

  // Filter and Search
  const filteredTickets = tickets.filter((ticket) => {
    const searchTextMatch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchQuery.toLowerCase());

    const statusMatch = !statusFilter || ticket.status === statusFilter;
    const priorityMatch = !priorityFilter || ticket.priority === priorityFilter;

    return searchTextMatch && statusMatch && priorityMatch;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter(null);
    setPriorityFilter(null);
  };

  interface ColumnType {
    title: string;
    dataIndex?: keyof SupportTicket;
    key: string;
    render?: (text: any, record?: SupportTicket) => React.ReactNode;
  }

  const columns: ColumnType[] = [
    {
      title: "Ticket ID",
      dataIndex: "id",
      key: "id",
      render: (text: string) => (
        <Typography.Text className="font-medium">{text}</Typography.Text>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: SupportTicket["status"]) => getStatusTag(status),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: SupportTicket["priority"]) => getPriorityTag(priority),
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text: string) => <>{dayjs(text).format("MMM DD, HH:mm:ss")}</>,
    },
    // {
    //   title: 'Last Updated',
    //   dataIndex: 'lastUpdated',
    //   key: 'lastUpdated',
    //   render: (text: string) => (
    //     <>
    //       <ClockCircleOutlined style={{ marginRight: 4, fontSize: '0.8em' }} />
    //       {dayjs(text).format('MMM DD, HH:mm:ss')}
    //     </>
    //   ),
    // },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Agent",
      dataIndex: "agent",
      key: "agent",
      render: (text: string) => (text ? text : "N/A"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record?: SupportTicket) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => record && handleViewTicket(record.id)}
          >
            View
          </Button>
          {record && record.status !== "closed" && (
            <Popconfirm
              title="Close Ticket"
              description="Are you sure you want to close this ticket?"
              onConfirm={() => handleCloseTicket(record.id)}
              okButtonProps={{ icon: <CheckCircleOutlined /> }}
              cancelButtonProps={{ icon: <CloseCircleOutlined /> }}
            >
              <Button danger size="small">
                Close
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
        Support Tickets
      </h1>

      <Card className="mb-6 shadow-md dark:bg-gray-800 dark:border-gray-700 flex flex-wrap gap-4 items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-auto"
            prefix={<SearchOutlined />}
          />
          <Select
            placeholder="Filter by Status"
            value={statusFilter || undefined}
            onChange={(value) => setStatusFilter(value || null)}
            className="w-full sm:w-auto"
          >
            <Select.Option value="open">Open</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="closed">Closed</Select.Option>
          </Select>
          <Select
            placeholder="Filter by Priority"
            value={priorityFilter || undefined}
            onChange={(value) => setPriorityFilter(value || null)}
            className="w-full sm:w-auto"
          >
            <Select.Option value="high">High</Select.Option>
            <Select.Option value="medium">Medium</Select.Option>
            <Select.Option value="low">Low</Select.Option>
          </Select>
          <Button onClick={clearFilters} className="w-full sm:w-auto">
            Clear Filters
          </Button>
        </div>
      </Card>

      <Card className="shadow-md dark:bg-gray-800 dark:border-gray-700">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <Table
            dataSource={filteredTickets}
            columns={columns}
            rowKey="id"
            className="dark:text-gray-300"
            scroll={{ x: true }}
          />
        )}
      </Card>

      {/* Ticket Detail View */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <Card className="w-full max-w-2xl h-[80vh] overflow-y-auto shadow-xl dark:bg-gray-800 dark:border-gray-700 relative">
            <Button
              className="absolute top-2 right-2"
              onClick={() => setSelectedTicket(null)}
              icon={<CloseCircleOutlined />}
              ghost
              size="small"
              danger
            />
            <div className="p-6">
              <Typography.Title
                level={3}
                className="mb-4 text-gray-800 dark:text-gray-200"
              >
                Ticket Details ({selectedTicket.id})
              </Typography.Title>
              <div className="grid grid-cols-2 gap-4 mb-4 text-gray-700 dark:text-gray-300">
                <div>
                  <p>
                    <span className="font-semibold">Subject:</span>{" "}
                    {selectedTicket.subject}
                  </p>
                  <p>
                    <span className="font-semibold">Customer:</span>{" "}
                    {selectedTicket.customerName}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {selectedTicket.email}
                  </p>
                  <p>
                    <span className="font-semibold">Department:</span>{" "}
                    {selectedTicket.department}
                  </p>
                  <p>
                    <span className="font-semibold">Agent:</span>{" "}
                    {selectedTicket.agent || "N/A"}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {getStatusTag(selectedTicket.status)}
                  </p>
                  <p>
                    <span className="font-semibold">Priority:</span>{" "}
                    {getPriorityTag(selectedTicket.priority)}
                  </p>
                  <p>
                    <span className="font-semibold">Created:</span>
                    <ClockCircleOutlined
                      style={{ marginRight: 4, fontSize: "0.8em" }}
                    />
                    {dayjs(selectedTicket.createdDate).format(
                      "MMM DD, HH:mm:ss"
                    )}
                  </p>
                  <p>
                    <span className="font-semibold">Last Updated:</span>
                    <ClockCircleOutlined
                      style={{ marginRight: 4, fontSize: "0.8em" }}
                    />
                    {dayjs(selectedTicket.lastUpdated).format(
                      "MMM DD, HH:mm:ss"
                    )}
                  </p>
                </div>
              </div>

              <Typography.Title
                level={4}
                className="mb-2 text-gray-800 dark:text-gray-200"
              >
                Messages
              </Typography.Title>
              <div className="space-y-4 mb-6">
                {selectedTicket.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-md ${
                      message.sender === "customer"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 ml-auto w-fit"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 mr-auto w-fit"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.sender === "customer" ? (
                        <>
                          <UserOutlined
                            className="text-blue-600 dark:text-blue-400"
                            size={16}
                          />
                          <span className="font-semibold">Customer:</span>
                        </>
                      ) : (
                        <>
                          <Avatar className="bg-green-500 text-white" size={16}>
                            Agent
                          </Avatar>
                          <span className="font-semibold">Agent:</span>
                        </>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {dayjs(message.sentDate).format("MMM DD, HH:mm:ss")}
                      </span>
                    </div>
                    <p>{message.text}</p>
                  </div>
                ))}
              </div>

              {selectedTicket.status !== "closed" && (
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 dark:bg-gray-700 dark:text-gray-200"
                  />
                  <Button
                    type="primary"
                    onClick={() => handleReply(selectedTicket.id)}
                  >
                    Reply
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SupportTicketPage;
