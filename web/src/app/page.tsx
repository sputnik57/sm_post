import WizardLayout from '@/components/wizard/WizardLayout';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] py-12">
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center space-y-4">
          <div className="inline-block p-1 rounded-2xl bg-gradient-to-tr from-brand-red to-orange-400">
            <div className="bg-white rounded-xl px-4 py-1">
              <span className="text-xs font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-500">
                Internal Tool
              </span>
            </div>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-gray-900">
            Social<span className="text-brand-red">Post</span> AI
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Generate on-brand social media content with the power of n8n workflows and AI.
          </p>
        </header>

        <WizardLayout />
      </div>
    </main>
  );
}
