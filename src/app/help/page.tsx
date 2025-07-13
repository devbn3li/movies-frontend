"use client";

import Link from "next/link";

export default function HelpCenter() {
  const faqs = [
    {
      question: "How do I create an account?",
      answer: "Click on the 'Register' button in the top navigation, fill out the required information, and verify your email address."
    },
    {
      question: "How can I search for movies or TV series?",
      answer: "Use the search bar at the top of the page or browse through our categories in the Movies and TV Series sections."
    },
    {
      question: "Can I create a watchlist?",
      answer: "Yes! Once you're logged in, you can add movies and TV series to your personal watchlist from any content page."
    },
    {
      question: "How do I report a problem?",
      answer: "You can contact us through the Contact Us page or email us directly at support@moviezone.com"
    },
    {
      question: "Is Movie Zone free to use?",
      answer: "Yes, Movie Zone is completely free to use. You can browse, search, and manage your watchlist without any cost."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Help Center</h1>
        <p className="text-muted-foreground text-lg">
          Find answers to frequently asked questions and get help with Movie Zone
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link href="/contact" className="group p-6 border rounded-lg hover:border-primary transition-colors">
          <div className="text-2xl mb-3">📧</div>
          <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Contact Support</h3>
          <p className="text-sm text-muted-foreground">Get in touch with our support team</p>
        </Link>

        <Link href="/dashboard" className="group p-6 border rounded-lg hover:border-primary transition-colors">
          <div className="text-2xl mb-3">📊</div>
          <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Dashboard</h3>
          <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
        </Link>

        <Link href="/main-movies" className="group p-6 border rounded-lg hover:border-primary transition-colors">
          <div className="text-2xl mb-3">🎬</div>
          <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Browse Movies</h3>
          <p className="text-sm text-muted-foreground">Explore our movie collection</p>
        </Link>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg p-6 hover:border-primary/50 transition-colors">
              <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
              <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="text-center p-8 bg-muted/30 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Still need help?</h3>
        <p className="text-muted-foreground mb-6">
          Our support team is here to help you with any questions or issues you might have.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
