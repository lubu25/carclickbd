"use client";
import React from 'react';
import { Button } from 'antd';
import { Card } from 'antd';
import { Typography } from 'antd';
import { siteAddress, siteContact } from "@/constants/siteContact";

const { Title, Paragraph, Text } = Typography;
const { Meta: CardMeta } = Card; // Corrected import

const PhotoguidePage = () => {
  const exampleImageUrl = "/assets/shared/car.png";

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Title level={1} className="text-center mb-6 text-gray-800 dark:text-gray-200">
        Photo Submission Guide
      </Title>

      <section className="mb-8">
        <Title level={2} className="mb-4 text-gray-700 dark:text-gray-300">Introduction</Title>
        <Paragraph className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Thank you for contributing to our platform! This guide will help you submit high-quality photos.
          Please follow these guidelines to ensure your photos are suitable for our needs.
        </Paragraph>
      </section>

      <section className="mb-8">
        <Title level={2} className="mb-4 text-gray-700 dark:text-gray-300">Image Requirements</Title>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardMeta title={<Title level={4} className="text-lg font-semibold text-gray-800 dark:text-gray-200">Technical Specifications</Title>} />
            <div className="p-6">
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                <li><strong>Resolution:</strong> Minimum 1024x768 pixels, recommended 1920x1080 pixels or higher.</li>
                <li><strong>Format:</strong> JPEG or PNG.</li>
                <li><strong>File Size:</strong> No fixed upload size limit for product photos.</li>
                <li><strong>Aspect Ratio:</strong>  Follow the specific aspect ratio requested (if any).  If no ratio is specified, 4:3 or 16:9 are generally preferred.</li>
                <li><strong>Focus:</strong> Images should be sharp and in focus.</li>
                <li><strong>Lighting:</strong>  Good lighting is essential.  Avoid overly dark, washed-out, or heavily shadowed images.</li>
                <li><strong>Orientation:</strong> Submit photos in the correct orientation (portrait or landscape).</li>
              </ul>
            </div>
          </Card>

          <Card className="shadow-md">
            <CardMeta title={<Title level={4} className="text-lg font-semibold text-gray-800 dark:text-gray-200">Content Guidelines</Title>} />
            <div className="p-6">
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                 <li><strong>Relevance:</strong> Photos must be relevant to the specific context.</li>
                <li><strong>Clarity:</strong> The subject of the photo should be clear and easily identifiable.</li>
                <li><strong>Composition:</strong> Consider the rule of thirds, leading lines, and other composition techniques.</li>
                <li><strong>No Watermarks:</strong> Please do not include watermarks, logos, or other identifying marks on the image itself.  Metadata is acceptable.</li>
                <li><strong>No Text Overlays:</strong> Avoid adding text overlays to the image.</li>
                <li><strong>Rights:</strong> You must have the right to submit the photo. Do not submit images that infringe on someone else&#39;s copyright.</li>
                <li><strong>Authenticity:</strong>  Do not heavily manipulate the image.  Basic adjustments (cropping, color correction) are usually acceptable, but avoid alterations that significantly change the content.</li>
              </ul>
            </div>
          </Card>
        </div>
      </section>

      <section className="mb-8">
        <Title level={2} className="mb-4 text-gray-700 dark:text-gray-300">Example Image and Explanation</Title>
        <Card className="shadow-md">
          <CardMeta title={<Title level={4}  className="text-lg font-semibold text-gray-800 dark:text-gray-200">Example</Title>}
                    description={<Paragraph className="text-gray-600 dark:text-gray-400">
                      Here&#39;s an example of a photo and an explanation of why it is/is not a good submission.
                    </Paragraph>}
          />
          <div className="p-6 space-y-4">
            <div className="relative">
              <img
                src={exampleImageUrl}  // Use the placeholder or your actual image URL
                alt="Example Submission"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700"
              />
              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-3 py-1 rounded-md text-sm">
                Example Photo
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Title level={3} className="text-xl font-semibold text-green-600 dark:text-green-400">Good Example Explanation</Title>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                  <li>Clear subject with good focus.</li>
                  <li>Appropriate resolution and aspect ratio.</li>
                  <li>Good lighting and color balance.</li>
                  <li>No watermarks or text overlays.</li>
                  <li>Relevant to the context.</li>
                   <li>Proper orientation.</li>
                </ul>
              </div>
              <div className="space-y-4">
                <Title level={3} className="text-xl font-semibold text-[#003399] dark:text-[#f0b90b]">Bad Example Explanation</Title>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                  <li>Blurry or out-of-focus subject.</li>
                  <li>Low resolution or incorrect aspect ratio.</li>
                  <li>Poor lighting (too dark, too bright, harsh shadows).</li>
                  <li>Presence of watermarks or text overlays.</li>
                  <li>Irrelevant to the context.</li>
                  <li>Incorrect orientation.</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mb-8">
        <Title level={2} className="mb-4 text-gray-700 dark:text-gray-300">Submission Process</Title>
        <Paragraph className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          To submit your photos, please follow these steps:
        </Paragraph>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li>Ensure your photo meets all the requirements outlined in this guide.</li>
          <li>Click the &quot;Upload Photo&quot; button on the submission page.  (If applicable)</li>
          <li>Select the image file from your computer.</li>
          <li>Provide any necessary information, such as a description of the photo, location, and date.</li>
          <li>Agree to the terms and conditions.</li>
          <li>Submit your photo.</li>
        </ol>
      </section>

      <section>
        <Title level={2} className="mb-4 text-gray-700 dark:text-gray-300">Contact</Title>
        <Paragraph className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          If you have any questions or need further assistance, please contact us at:
        </Paragraph>
        <Text className="text-blue-600 dark:text-blue-400">
          Company: {siteContact.company}
          <br />
          Email: {siteContact.email}
          <br />
          WhatsApp: {siteContact.whatsapp}
          <br />
          Address: {siteAddress}
        </Text>
      </section>
    </div>
  );
};

export default PhotoguidePage;
