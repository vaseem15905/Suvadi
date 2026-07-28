export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background pt-16">
      <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Terms and Conditions</h1>
          <p className="text-foreground-muted">Last updated: July 2026</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            Please read these terms and conditions carefully before using the Suvadi platform.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Suvadi, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">2. Use License</h2>
          <p>
            Permission is granted to temporarily use the materials (information or software) on Suvadi's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>attempt to decompile or reverse engineer any software contained on Suvadi's website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">4. User Content</h2>
          <p>
            Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
          </p>
          <p>
            By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service. You retain any and all of your rights to any Content you submit, post or display on or through the Service and you are responsible for protecting those rights.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">5. Termination</h2>
          <p>
            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
          <p>
            All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">6. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">7. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at <a href="mailto:hello@suvadi.com" className="text-brand hover:underline">hello@suvadi.com</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
