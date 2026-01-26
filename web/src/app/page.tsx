import WizardLayout from '@/components/wizard/WizardLayout';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] py-12">
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center space-y-4">
          <h1 className="text-5xl font-black tracking-tight text-gray-900">
            Generate <span className="text-brand-red">5 Days</span> of Social Media Content in Minutes
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Generate on-brand social media content with the power of n8n workflows and AI!
          </p>
        </header>

        <WizardLayout />
      </div>
    </main>
  );
}
