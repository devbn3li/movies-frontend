"use client";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>

      </div>

      {/* Content */}
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <div className="space-y-8">

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We collect information you provide directly to us, such as when you create an account,
                update your profile, or contact us for support.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Personal information (name, email address)</li>
                <li>Account preferences and settings</li>
                <li>Usage data and interactions with our platform</li>
                <li>Device information and IP address</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Provide and maintain our services</li>
                <li>Personalize your experience</li>
                <li>Send you updates and notifications</li>
                <li>Improve our platform and user experience</li>
                <li>Respond to your requests and provide customer support</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties
                without your consent, except in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>With trusted service providers who assist us in operating our platform</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We implement appropriate security measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Encryption of sensitive data</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication</li>
                <li>Secure data storage and transmission</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and data</li>
                <li>Object to processing of your data</li>
                <li>Data portability</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We use cookies and similar tracking technologies to enhance your browsing experience
                and analyze how you use our platform.
              </p>
              <p>
                You can control cookies through your browser settings, but disabling them may affect
                some functionality of our service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Children&apos;s Privacy</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Our service is not intended for children under 13 years of age. We do not knowingly
                collect personal information from children under 13.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes
                by posting the new policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Email: privacy@moviezone.com</li>
                <li>Contact form: <a href="/contact" className="text-primary hover:underline">Contact Us</a></li>
              </ul>
            </div>
          </section>

        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          This policy is effective as of January 24, 2025 and was last updated on January 24, 2025.
        </p>
      </div>
    </div>
  );
}
