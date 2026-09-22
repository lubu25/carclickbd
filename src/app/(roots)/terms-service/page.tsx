/* eslint-disable react/no-unescaped-entities */
"use client";
import React from 'react';
import { Typography } from 'antd';
import { siteAddress, siteContact } from '@/constants/siteContact';

const { Title, Paragraph, Text, Link } = Typography;

const TermsOfServicePage = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <Title level={1} className="text-3xl font-bold text-center">Terms of Service</Title>

      <Paragraph>
        Welcome to CarClickBD! These Terms of Service ("Terms") govern your access to and use of the CarClickBD website,
        mobile applications, and any other services we provide (collectively, the "Services"). By accessing or using
        the Services, you agree to be bound by these Terms.
      </Paragraph>

      <Title level={2} className="text-2xl font-semibold">1. Acceptance of Terms</Title>
      <Paragraph>
        By using our Services, you confirm that you have read, understood, and agree to be bound by these Terms. If you
        do not agree to these Terms, you may not use our Services.
      </Paragraph>

      <Title level={2} className="text-2xl font-semibold">2. Description of Services</Title>
      <Paragraph>
        CarClickBD provides an online car marketplace for vehicle listings and related information. Users can browse,
        inquire about, buy, and sell vehicles. We also offer listing management, seller dashboards, contact support, and other related services.
      </Paragraph>

      <Title level={2} className="text-2xl font-semibold">3. User Accounts</Title>
      <Paragraph>
        <ol>
          <li>
            <strong>Account Creation:</strong> To access certain features, you must create an account. You agree to provide
            accurate, complete, and current information during the registration process and to update such information
            to keep it accurate, complete, and current.
          </li>
          <li>
            <strong>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your account
            credentials and are responsible for all activities that occur under your account.
          </li>
          <li>
          <strong>Account Termination:</strong> We reserve the right to suspend or terminate your account at any time for any reason, including violation of these terms.
          </li>
        </ol>
      </Paragraph>

      <Title level={2} className="text-2xl font-semibold">4. Use of Services</Title>
      <Paragraph>
        <ol>
          <li>
            <strong>Eligibility:</strong> You must be at least 18 years old to use our Services.
          </li>
          <li>
            <strong>Lawful Use:</strong> You agree to use our Services only for lawful purposes and in compliance with all
            applicable laws and regulations.
          </li>
          <li>
            <strong>Prohibited Conduct:</strong> You agree not to:
            <ul>
              <li>Post, upload, or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, obscene, or otherwise objectionable.</li>
              <li>Use our Services to engage in any fraudulent activity.</li>
              <li>Attempt to interfere with the proper functioning of our Services.</li>
              <li>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
              <li>Collect information about other users without their consent.</li>
            </ul>
          </li>
        </ol>
      </Paragraph>

      <Title level={2} className="text-2xl font-semibold">5. Content</Title>
        <Paragraph>
        <ol>
            <li>
            <strong>User Content:</strong> You are responsible for any content you post, upload, or transmit through our Services.  You grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, publish, and distribute your content.
            </li>
            <li>
            <strong>Our Content:</strong> All content included in our Services (such as text, graphics, logos, images) is our property or the property of our licensors and is protected by copyright and other intellectual property laws.
            </li>
        </ol>
        </Paragraph>

      <Title level={2} className="text-2xl font-semibold">6. Transactions</Title>
      <Paragraph>
        <ol>
          <li>
            <strong>Listings and Sales:</strong> Our platform provides a venue for vehicle listings and buyer-seller communication. As a buyer or seller, you are responsible for understanding and complying with the terms of any transaction.
          </li>
          <li>
          <strong>Fees:</strong> We may charge fees for certain transactions.  You agree to pay all applicable fees.
          </li>
          <li>
            <strong>Disclaimer:</strong> We are not responsible for the condition, safety, or legality of vehicles listed on our Services.
          </li>
        </ol>
      </Paragraph>

      <Title level={2} className="text-2xl font-semibold">7. Intellectual Property</Title>
      <Paragraph>
        The Services and all related materials, including but not limited to copyrights, trademarks, and patents, are owned
        by CarClickBD or its licensors. You may not use our intellectual property without our prior written consent.
      </Paragraph>

      <Title level={2} className="text-2xl font-semibold">8. Privacy</Title>
      <Paragraph>
        Your use of our Services is subject to our <Link href="/privacy-policy" className="text-blue-500 hover:underline">Privacy Policy</Link>, which
        explains how we collect, use, and disclose your information.
      </Paragraph>

        <Title level={2} className="text-2xl font-semibold">9. Disclaimer of Warranties</Title>
        <Paragraph>
        OUR SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS.  WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.  WE DO NOT WARRANT THAT OUR SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
        </Paragraph>

        <Title level={2} className="text-2xl font-semibold">10. Limitation of Liability</Title>
        <Paragraph>
        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL CARCLICKBD BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OUR SERVICES.
        </Paragraph>

      <Title level={2} className="text-2xl font-semibold">11. Indemnification</Title>
      <Paragraph>
        You agree to indemnify and hold CarClickBD harmless from any claims, damages, and expenses (including attorneys' fees)
        arising out of or in connection with your use of our Services or your violation of these Terms.
      </Paragraph>

      <Title level={2} className="text-2xl font-semibold">12. Changes to These Terms</Title>
      <Paragraph>
        We may update these Terms from time to time. We will notify you of any material changes by posting the new Terms
        on our website or through other reasonable means. Your continued use of the Services after the effective date
        of the revised Terms constitutes your acceptance of the changes.
      </Paragraph>

      <Title level={2} className="text-2xl font-semibold">13. Governing Law</Title>
      <Paragraph>
        These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without
        regard to its conflict of laws principles.
      </Paragraph>

      <Title level={2} className="text-2xl font-semibold">14. Contact Us</Title>
      <Paragraph>
        If you have any questions about these Terms, please contact {siteContact.company} at {siteContact.email},
        WhatsApp {siteContact.whatsapp}, or {siteAddress}.
      </Paragraph>
    </div>
  );
};

export default TermsOfServicePage;
