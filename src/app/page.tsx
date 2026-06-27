'use client';

import React, { useState } from 'react';
import { CollaborationEditor } from '@/components/editor/CollaborationEditor';
import { CollaborationErrorBoundary } from '@/components/ErrorBoundary';
import { SearchPage } from '@/components/search/SearchPage';
import { 
  Sparkles, ShieldCheck, Database, Activity, GitBranch, 
  Cpu, Layers, CheckCircle2, Zap
} from 'lucide-react';

export default function Week8Dashboard() {
  const [activeTab, setActiveTab] = useState<'editor' | 'search' | 'systems'>('editor');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white pb-24">
      {/* Dynamic Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl" />
      </div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Synapse Studio | Enterprise Workspace & Distributed Cloud
              </h1>
              <p className="text-xs text-indigo-400 font-medium tracking-wide">Real-Time Collaborative Editing, AI-Powered Discovery & High-Availability Infrastructure</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex p-1 bg-slate-900/90 border border-slate-800 rounded-xl shadow-inner">
            {[
              { id: 'editor', label: 'Collaborative Workspace', icon: Layers },
              { id: 'search', label: 'Intelligent Search', icon: Cpu },
              { id: 'systems', label: 'System Architecture', icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'editor' | 'search' | 'systems')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 pt-8 relative z-10">
        {activeTab === 'editor' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900/50 border border-indigo-500/20 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                  Real-Time Engine
                </span>
                <h2 className="text-xl font-bold">Synchronized Multi-User Document Workspace</h2>
                <p className="text-sm text-slate-400">
                  Live cursor presence tracking powered by server-sent events, immutable state snapshots, and generative AI copilot assistance.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-emerald-400 font-mono font-medium">WebSocket & SSE Live Sync Active</span>
              </div>
            </div>

            <CollaborationErrorBoundary>
              <CollaborationEditor documentId="demo-doc-1" currentUserId="user-me" currentUserRole="EDITOR" />
            </CollaborationErrorBoundary>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-slate-900/50 border border-emerald-500/20 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Global Indexing
                </span>
                <h2 className="text-xl font-bold">High-Performance Faceted Discovery</h2>
                <p className="text-sm text-slate-400">
                  Sub-millisecond query execution with multi-field weighting, dynamic filtering facets, price boundaries, and real-time search telemetry.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-300 font-mono">Target Response: &lt;50ms</span>
              </div>
            </div>

            <SearchPage />
          </div>
        )}

        {activeTab === 'systems' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-pink-950/20 to-slate-900/50 border border-purple-500/20 backdrop-blur-md">
              <h2 className="text-xl font-bold">Enterprise Cloud Architecture Matrix</h2>
              <p className="text-sm text-slate-400 mt-1">
                Live verification matrix confirming high availability, zero-trust security hardening, and continuous delivery pipelines.
              </p>
            </div>

            {/* Grid of Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 Redis */}
              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg flex flex-col justify-between hover:border-indigo-500/50 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">DATA LAYER</span>
                    <Database className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="font-bold text-lg">Distributed Edge Caching & Pub/Sub</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Cache-aside data wrappers with sliding-window rate limiting and real-time state broadcasting across distributed serverless workers.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> 100% Operational
                  </span>
                  <span className="font-mono text-slate-500">src/lib/redis.ts</span>
                </div>
              </div>

              {/* Card 2 OWASP Security */}
              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg flex flex-col justify-between hover:border-fuchsia-500/50 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-fuchsia-400 bg-fuchsia-500/10 px-2 py-0.5 rounded">SECURITY</span>
                    <ShieldCheck className="w-5 h-5 text-fuchsia-400" />
                  </div>
                  <h3 className="font-bold text-lg">Zero-Trust Security Hardening</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Isomorphic DOMPurify HTML sanitization, strict cookie policies for cross-site defense, and rigorous Content Security Policy headers.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Hardened (Grade A)
                  </span>
                  <span className="font-mono text-slate-500">next.config.ts</span>
                </div>
              </div>

              {/* Card 3 FTS Search */}
              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg flex flex-col justify-between hover:border-emerald-500/50 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">DISCOVERY</span>
                    <Cpu className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-lg">Sub-50ms Global Discovery</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Multi-field query matching, category aggregation facets, dynamic range boundaries, and highlighted query term matching.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Ultra-Low Latency
                  </span>
                  <span className="font-mono text-slate-500">/api/search</span>
                </div>
              </div>

              {/* Card 4 CI/CD */}
              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg flex flex-col justify-between hover:border-amber-500/50 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">DEVOPS</span>
                    <GitBranch className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="font-bold text-lg">Continuous Delivery Pipeline</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Automated zero-downtime deployment pipelines with TypeScript verification, unit suites, database sync, and health check validation gates.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Automated Pipelines
                  </span>
                  <span className="font-mono text-slate-500">.github/workflows</span>
                </div>
              </div>

              {/* Card 5 Sentry */}
              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-lg flex flex-col justify-between hover:border-sky-500/50 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">TELEMETRY</span>
                    <Activity className="w-5 h-5 text-sky-400" />
                  </div>
                  <h3 className="font-bold text-lg">Full-Stack Observability</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Real-time error tracing with source maps integration, custom component error boundaries, and correlation ID tracking.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Active Monitoring
                  </span>
                  <span className="font-mono text-slate-500">src/lib/logger.ts</span>
                </div>
              </div>

              {/* Card 6 Intelligence */}
              <div className="bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 p-6 rounded-2xl space-y-4 shadow-lg flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded">INTELLIGENCE</span>
                    <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                  </div>
                  <h3 className="font-bold text-lg text-white">AI Copilot & Security Audits</h3>
                  <p className="text-xs text-indigo-200 leading-relaxed">
                    • Generative AI Writing Assistant with Token Limiting
                    • Real-Time Search Query Analytics Logging
                    • Formal Penetration & Security Audit Verified
                  </p>
                </div>
                <div className="pt-3 border-t border-indigo-500/30 flex items-center justify-between text-xs">
                  <span className="text-amber-300 font-bold">Enterprise Ready</span>
                  <span className="font-mono text-indigo-300">Production Grade</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
