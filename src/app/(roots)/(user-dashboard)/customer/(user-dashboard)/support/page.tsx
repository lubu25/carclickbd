/* eslint-disable react/no-unescaped-entities */
import React from 'react';

import {
  Headset,
  MessageCircle,
  FileText,
  Search,
  ArrowRight,
  LifeBuoy,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { Button, Card,  Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';



const SupportPage = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            How can we help?
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-80">
            Get in touch or find answers to your questions.
          </p>
          <div className="w-full max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search for topics or questions..."
              className="w-full text-black"
            />
          </div>
        </div>
      </header>

      {/* Quick Links Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center mb-8">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <div>
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Headset className="w-5 h-5" />
                Help Center
              </div>
              <p>
                Find answers to common questions.
              </p>
            </div>
            <p>
              <Button variant="link" className="p-0 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center">
                Visit the Help Center <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </p>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <div>
              <h2 className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <MessageCircle className="w-5 h-5" />
                Contact Support
              </h2>
              <p>
                Get in touch with our support team.
              </p>
            </div>
            <p>
              <Button variant="link" className="p-0 text-green-500 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center">
                Contact Us <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </p>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <div>
              <h2 className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <FileText className="w-5 h-5" />
                Resources
              </h2>
              <p>
                Explore guides, tutorials, and documentation.
              </p>
            </div>
            <p>
              <Button variant="link" className="p-0 text-purple-500 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center">
                View Resources <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </p>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                How do I contact a seller?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Open the vehicle listing and use the inquiry or chat option. Our team helps route the message so you can discuss availability, inspection, and next steps.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Is it safe to pay before inspection?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No. Inspect the vehicle, verify documents, and agree on all terms before sending any payment.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                How do I complete a purchase?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Contact the seller, inspect the vehicle, verify ownership documents, and complete payment only after both parties agree.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Is my payment information secure?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, we use industry-standard encryption to protect your payment information.  We are committed to your security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center mb-8">
          Still have questions? Contact us!
        </h2>
        <div className="w-full max-w-2xl mx-auto">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <Input
                type="text"
                id="name"
                placeholder="Your Name"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <Input
                type="email"
                id="email"
                placeholder="Your Email"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <TextArea
                id="message"
                placeholder="Your Message"
                rows={4}
                className="w-full"
              />
            </div>
            <Button type="primary" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              Send Message
            </Button>
          </form>
        </div>
      </section>

      {/* Support Features Section */}
      <section className="bg-gray-100 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center mb-8">
            Key Support Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="transition-transform transform hover:scale-105">
              <div>
                <h2 className="flex items-center gap-3 text-lg font-semibold text-blue-600 dark:text-blue-400">
                  <LifeBuoy className="w-6 h-6" />
                  24/7 Support
                </h2>
              </div>
              <p>
                <p className="text-gray-600 dark:text-gray-400">
                  We offer round-the-clock support to assist you anytime.
                </p>
              </p>
            </Card>

            <Card className="transition-transform transform hover:scale-105">
              <div>
                <h2 className="flex items-center gap-3 text-lg font-semibold text-green-600 dark:text-green-400">
                  <ShieldCheck className="w-6 h-6" />
                  Secure & Private
                </h2>
              </div>
              <p>
                <p className="text-gray-600 dark:text-gray-400">
                  Your data and interactions are kept secure and private.
                </p>
              </p>
            </Card>

            <Card className="transition-transform transform hover:scale-105">
               <div>
                <h2 className="flex items-center gap-3 text-lg font-semibold text-purple-600 dark:text-purple-400">
                    <Users className="w-6 h-6" />
                    Community Forum
                </h2>
              </div>
              <p>
                <p className="text-gray-600 dark:text-gray-400">
                  Connect with other users and experts in our community forum.
                </p>
              </p>
            </Card>

            <Card className="transition-transform transform hover:scale-105">
              <div>
                <h2 className="flex items-center gap-3 text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                  <FileText className="w-6 h-6" />
                  Knowledge Base
                </h2>
              </div>
              <p>
                <p className="text-gray-600 dark:text-gray-400">
                  Access a comprehensive library of articles and guides.
                </p>
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;
