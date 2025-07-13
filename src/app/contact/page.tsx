"use client";

import { useState } from "react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold mb-4">Message Sent Successfully!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for contacting us. We&apos;ll get back to you within 24 hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground text-lg">
          We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Support</option>
                <option value="account">Account Issues</option>
                <option value="feature">Feature Request</option>
                <option value="bug">Bug Report</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                placeholder="Tell us how we can help you..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Get in touch</h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="text-2xl">📧</div>
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-muted-foreground">support@moviezone.com</p>
                <p className="text-sm text-muted-foreground">We reply within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-2xl">💬</div>
              <div>
                <h3 className="font-semibold mb-1">Live Chat</h3>
                <p className="text-muted-foreground">Available 24/7</p>
                <p className="text-sm text-muted-foreground">Get instant help with our chat support</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-2xl">🕒</div>
              <div>
                <h3 className="font-semibold mb-1">Response Time</h3>
                <p className="text-muted-foreground">Within 24 hours</p>
                <p className="text-sm text-muted-foreground">Monday to Friday, 9 AM - 6 PM EST</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-2xl">🔗</div>
              <div>
                <h3 className="font-semibold mb-1">Social Media</h3>
                <p className="text-muted-foreground">Follow us for updates</p>
                <div className="flex space-x-3 mt-2">
                  <a href="#" className="text-primary hover:text-primary/80 transition-colors">Twitter</a>
                  <a href="#" className="text-primary hover:text-primary/80 transition-colors">Facebook</a>
                  <a href="#" className="text-primary hover:text-primary/80 transition-colors">Instagram</a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Link */}
          <div className="mt-8 p-6 bg-muted/30 rounded-lg">
            <h3 className="font-semibold mb-2">Before you contact us</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Check our FAQ section for quick answers to common questions.
            </p>
            <a
              href="/help"
              className="inline-flex items-center text-primary hover:text-primary/80 transition-colors text-sm font-medium"
            >
              Visit Help Center →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
