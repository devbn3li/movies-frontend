"use client";

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>

      </div>

      {/* Content */}
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <div className="space-y-8">

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                By accessing and using Movie Zone, you accept and agree to be bound by the terms
                and provision of this agreement. If you do not agree to abide by the above,
                please do not use this service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Movie Zone is a platform that provides information about movies and TV series,
                including ratings, reviews, and recommendations. Our service allows users to:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Browse and search for movies and TV series</li>
                <li>Create and manage personal watchlists</li>
                <li>View ratings and reviews</li>
                <li>Receive personalized recommendations</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                When you create an account with us, you must provide information that is accurate,
                complete, and current at all times.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>You are responsible for safeguarding your password</li>
                <li>You must notify us immediately of any unauthorized use</li>
                <li>We reserve the right to refuse service or terminate accounts</li>
                <li>One person or legal entity may maintain no more than one account</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>You agree not to use the service to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Upload, post, or transmit any content that is unlawful, harmful, or objectionable</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with or disrupt the service or servers</li>
                <li>Attempt to gain unauthorized access to any part of the service</li>
                <li>Use automated scripts or bots to access the service</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Content and Intellectual Property</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                The service and its original content, features, and functionality are and will remain
                the exclusive property of Movie Zone and its licensors.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>All content is protected by copyright, trademark, and other laws</li>
                <li>You may not reproduce, distribute, or create derivative works</li>
                <li>Movie information is provided for informational purposes only</li>
                <li>User-generated content remains your property but you grant us usage rights</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Privacy Policy</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which also governs
                your use of the service, to understand our practices.
              </p>
              <p>
                <a href="/privacy" className="text-primary hover:underline">Read our Privacy Policy</a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Disclaimers</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                The information on this service is provided on an &quot;as is&quot; basis. To the fullest extent
                permitted by law, this Company:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Excludes all representations and warranties relating to this website</li>
                <li>Does not guarantee the accuracy of movie information</li>
                <li>Excludes all liability for damages arising from your use</li>
                <li>Does not warrant that the service will be uninterrupted or error-free</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                In no event shall Movie Zone, nor its directors, employees, partners, agents, suppliers,
                or affiliates, be liable for any indirect, incidental, special, consequential, or punitive
                damages, including without limitation, loss of profits, data, use, goodwill, or other
                intangible losses.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability,
                for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p>
                Upon termination, your right to use the service will cease immediately. If you wish to
                terminate your account, you may simply discontinue using the service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                If a revision is material, we will try to provide at least 30 days notice prior to any new
                terms taking effect.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Email: legal@moviezone.com</li>
                <li>Contact form: <a href="/contact" className="text-primary hover:underline">Contact Us</a></li>
              </ul>
            </div>
          </section>

        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          By using Movie Zone, you acknowledge that you have read and understood these terms and agree to be bound by them.
        </p>
      </div>
    </div>
  );
}
