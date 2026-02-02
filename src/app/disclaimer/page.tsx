import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer - Movie Zone",
  description: "Important legal disclaimer and terms of use for Movie Zone streaming service.",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Disclaimer
        </h1>

        <div className="prose dark:prose-invert max-w-none space-y-8 text-gray-700 dark:text-gray-300">
          <p className="text-lg leading-relaxed">
            Please read this disclaimer carefully before using the service operated by us.
          </p>

          <p className="leading-relaxed">
            <strong className="text-gray-900 dark:text-white">Movie Zone</strong> is a free online movie and TV show streaming website that allows users to watch content sourced from third parties. Movie Zone does not upload, host, own or store any movies, TV shows or video content displayed on the site. All content is provided by external sources and streamed directly from third party servers.
          </p>

          <p className="leading-relaxed">
            Movie Zone has no control over the content quality, availability, copyright, legality or validity of the third party material viewed via the site. Movie Zone cannot be held responsible for any streaming content on the site, whether authorized or unauthorized. Users are responsible for verifying they have the legal right to view any streamed content.
          </p>

          <p className="leading-relaxed">
            The operators of Movie Zone make no warranties or representations about the site or any of the content, and assume no liability for any costs, damages or losses from the use of the site. By using Movie Zone, you agree that access is provided &quot;as is&quot; at your own risk.
          </p>

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Copyright Infringement
            </h2>
            <p className="leading-relaxed">
              Movie Zone respects the intellectual property rights of others. Users are prohibited from using Movie Zone to engage in copyright infringement or the unauthorized distribution of copyrighted content. Movie Zone will promptly remove or disable access to any infringing content upon receipt of proper notification from the copyright holder.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Endorsement
            </h2>
            <p className="leading-relaxed">
              The content accessible through Movie Zone does not constitute an endorsement by the website operators of any third party content providers, services, or products. References and links to third party content are provided for informational and entertainment purposes only.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Age Restricted Content
            </h2>
            <p className="leading-relaxed">
              Movie Zone does not knowingly collect or distribute content considered obscene or harmful to minors as defined by applicable law. However, Movie Zone has no control over third party content and some material accessible through Movie Zone may be inappropriate for minors. Parents are advised to supervise minors using the service.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Warranties
            </h2>
            <p className="leading-relaxed">
              Movie Zone provides access to third party content on an &quot;as is&quot; basis without warranties of any kind, express or implied. The website operators make no guarantees regarding the accuracy, currency, suitability, completeness, usefulness, safety or intellectual property rights related to any accessible content.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              In no event shall Movie Zone be liable for any direct, indirect, punitive, incidental or consequential damages arising out of the use, inability to use, or unavailability of the service or any content accessible on the site. Users agree to fully indemnify and hold harmless Movie Zone and its operators from any claims arising from use of the service.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
