export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background pt-16">
      <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Privacy Policy</h1>
          <p className="text-foreground-muted">Last updated: July 2026</p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            At Suvadi, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our application.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">1. Information We Collect</h2>
          <p>
            We may collect personal identification information from you in a variety of ways, including, but not limited to, when you visit our site, register on the site, subscribe to the newsletter, and in connection with other activities, services, features, or resources we make available on our Site.
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Personal Data:</strong> Name, email address, avatar, and authentication details.</li>
            <li><strong>Usage Data:</strong> Information on how the Service is accessed and used, such as your IP address, browser type, browser version, and the time and date of your visit.</li>
            <li><strong>Session Data:</strong> Notes, questions, whiteboard drawings, and resources uploaded during sessions.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">2. How We Use Your Information</h2>
          <p>
            We may use the information we collect from you in the following ways:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>To personalize your experience and deliver the type of content and product offerings in which you are most interested.</li>
            <li>To improve our website in order to better serve you.</li>
            <li>To manage and operate the real-time collaboration features of your sessions.</li>
            <li>To send periodic emails regarding your account or other products and services.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">3. Data Security</h2>
          <p>
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">4. Sharing Your Personal Information</h2>
          <p>
            We do not sell, trade, or rent users' personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates, and advertisers for the purposes outlined above.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">5. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal data, such as the right to access, update, or delete the information we have on you. If you wish to exercise any of these rights, please contact us.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">6. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:hello@suvadi.com" className="text-brand hover:underline">hello@suvadi.com</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
