/* eslint-disable react/no-unescaped-entities */
"use client";
import React from 'react';
import { Typography } from 'antd';
import { siteAddress, siteContact } from '@/constants/siteContact';

const { Title, Paragraph, Text, Link } = Typography;

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <Title level={1} className="text-3xl font-bold text-center">Privacy Policy</Title>

      <Paragraph>
        Your privacy is important to CarClickBD. This Privacy Policy explains how we collect, use, and disclose your
        information when you use our website, mobile applications, and other services (collectively, the "Services").
      </Paragraph>

      <Title level={2} className="text-2xl font-semibold">1. Information We Collect</Title>
      <Paragraph>
        We collect several types of information from and about users of our Services, including:
        <ol>
          <li>
            <strong>Information You Provide:</strong> When you create an account, participate in transactions, or communicate with
            us, we collect information such as your name, email address, phone number, and any other information you
            provide.
          </li>
          <li>
            <strong>Information We Collect Automatically:</strong> When you use our Services, we automatically collect certain
            information, including:
            <ul>
              <li><strong>Log Data:</strong> Information about your use of the Services, such as your IP address, browser type, operating system, and access times.</li>
              <li><strong>Cookies and Similar Technologies:</strong> We use cookies and similar technologies to collect information about your browsing behavior and preferences.</li>
              <li><strong>Device Information:</strong> We may collect information about your device, including the type of device, unique device identifiers, and mobile network information.</li>
            </ul>
          </li>
          <li>
          <strong>Information from Third Parties:</strong> We may receive information about you from third-party sources, such as social media platforms, partners, and service providers.
          </li>
        </ol>
      </Paragraph>

      <Title level={2} className="text-2xl font-semibold">2. How We Use Your Information</Title>
      <Paragraph>
        We use your information for various purposes, including:
        <ol>
          <li>To provide and maintain our Services.</li>
          <li>To support vehicle inquiries, listings, and buyer-seller communication.</li>
          <li>To communicate with you, including sending you updates, newsletters, and marketing communications.</li>
          <li>To personalize your experience and provide tailored content.</li>
          <li>To analyze how our Services are used and improve them.</li>
          <li>To detect, prevent, and address fraud and other illegal activities.</li>
          <li>To comply with legal obligations.</li>
        </ol>
      </Paragraph>

      <Title level={2} className="text-2xl font-semibold">3. How We Share Your Information</Title>
      <Paragraph>
        We may share your information with:
        <ol>
          <li>
            <strong>Service Providers:</strong> We share information with third-party service providers who help us operate our
            Services, such as payment processors, hosting providers, and analytics providers.
          </li>
          <li>
            <strong>Other Users:</strong> Information you share in public areas of our Services, such as community forums or
            vehicle listings, may be visible to other users.
          </li>
           <li>
            <strong>Business Partners:</strong> We may share information with business partners to offer you products or services.
          </li>
          <li>
            <strong>Legal Authorities:</strong> We may disclose your information to law enforcement agencies, government bodies,
            or other organizations if required by law or to protect our rights or the rights of others.
          </li>
          <li>
          <strong>Affiliates and Subsidiaries:</strong> We may share your information with our affiliates and subsidiaries.
          </li>
          <li>
            <strong>Business Transfers:</strong> In connection with a merger, acquisition, or other business transaction, we may
            transfer your information to the acquiring party.
          </li>
        </ol>
      </Paragraph>

      <Title level={2} className="text-2xl font-semibold">4. Your Choices</Title>
      <Paragraph>
        You have several choices regarding your information:
        <ol>
          <li>
            <strong>Access and Correction:</strong> You can access and update your account information at any time.
          </li>
          <li>
            <strong>Opt-Out of Marketing Communications:</strong> You can opt out of receiving marketing communications from
            us by following the unsubscribe instructions in those communications or by contacting us.
          </li>
          <li>
          <strong>Cookies:</strong> You can set your browser to refuse all or some cookies, or to alert you when cookies are being sent.
          </li>
          <li>
          <strong>Do Not Track:</strong> We do not currently respond to "Do Not Track" signals.
          </li>
        </ol>
      </Paragraph>

      <Title level={2} className="text-2xl font-semibold">5. Data Security</Title>
      <Paragraph>
        We take reasonable measures to protect your information from unauthorized access, use, or disclosure. However, no
        method of transmission over the internet or method of electronic storage is completely secure.
      </Paragraph>

      <Title level={2} className="text-2xl font-semibold">6. Data Retention</Title>
      <Paragraph>
        We retain your information for as long as necessary to provide you with our Services, comply with legal
        obligations, resolve disputes, and enforce our agreements.
      </Paragraph>

      <Title level={2} className="text-2xl font-semibold">7. International Transfers</Title>
      <Paragraph>
        Your information may be transferred to and maintained on servers located outside of your state, province,
        country, or other governmental jurisdiction where the data protection laws may differ from those of your
        jurisdiction.
      </Paragraph>

      <Title level={2} className="text-2xl font-semibold">8. Children's Privacy</Title>
      <Paragraph>
        Our Services are not intended for children under the age of 13, and we do not knowingly collect personal
        information from children under 13. If we become aware that we have collected personal information from a
        child under 13, we will take steps to delete such information.
      </Paragraph>

      <Title level={2} className="text-2xl font-semibold">9. Changes to This Privacy Policy</Title>
      <Paragraph>
        We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new
        Privacy Policy on our website or through other reasonable means. Your continued use of the Services after the
        effective date of the revised Privacy Policy constitutes your acceptance of the changes.
      </Paragraph>

      <Title level={2} className="text-2xl font-semibold">10. Contact Us</Title>
      <Paragraph>
        If you have any questions about this Privacy Policy, please contact {siteContact.company} at {siteContact.email},
        WhatsApp {siteContact.whatsapp}, or {siteAddress}.
      </Paragraph>
    </div>
  );
};

export default PrivacyPolicyPage;
