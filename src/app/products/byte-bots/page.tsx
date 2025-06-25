"use client";

import { Header } from "@/sections/Navbar";
import { Footer } from "@/sections/Footer";

export default function ByteBotsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">Byte Bots</h1>
          <p className="text-lg text-gray-300 mb-6">
            AI-powered automation solutions that revolutionize how businesses operate and scale.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Process Automation</h3>
              <p className="text-gray-300">
                Automate repetitive tasks and workflows to increase efficiency and reduce operational costs.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">AI Integration</h3>
              <p className="text-gray-300">
                Seamless integration with existing systems and intelligent decision-making capabilities.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 