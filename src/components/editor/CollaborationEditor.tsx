'use client';

import React, { useState, useEffect, useRef } from 'react';
import { sanitizeHtml } from '@/lib/sanitize';
import { 
  History, Sparkles, Save, Shield, Eye, RotateCcw, Loader2, Bot
} from 'lucide-react';

interface DocumentVersion {
  id: string;
  contentSnapshot: string;
  commitMessage?: string;
  createdAt: string;
}

interface UserPresence {
  id: string;
  name: string;
  color: string;
  cursorX: number;
  cursorY: number;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
}

interface EditorProps {
  documentId: string;
  currentUserId?: string;
  currentUserRole?: 'OWNER' | 'EDITOR' | 'VIEWER';
}

export function CollaborationEditor({ 
  documentId = 'demo-doc-1', 
  currentUserId = 'user-me', 
  currentUserRole = 'EDITOR' 
}: EditorProps) {
  const [title, setTitle] = useState('Loading document...');
  const [content, setContent] = useState('');
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [activeUsers, setActiveUsers] = useState<UserPresence[]>([
    { id: 'u2', name: 'Sarah (Mentor)', color: '#ec4899', cursorX: 280, cursorY: 180, role: 'OWNER' },
    { id: 'u3', name: 'David (Intern)', color: '#3b82f6', cursorX: 450, cursorY: 320, role: 'VIEWER' }
  ]);
  
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showAiPalette, setShowAiPalette] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [aiError, setAiError] = useState('');

  const editorRef = useRef<HTMLDivElement>(null);

  const canEdit = currentUserRole !== 'VIEWER';

  // Load Document Data & Expose sanitizer for Lab 2 verification
  useEffect(() => {
    (window as unknown as Record<string, unknown>).testSanitize = sanitizeHtml;
    async function fetchDoc() {
      try {
        const res = await fetch(`/api/documents/${documentId}`);
        const data = await res.json();
        if (data.document) {
          setTitle(data.document.title);
          setContent(data.document.content);
          setVersions(data.document.versions || []);
        }
      } catch (err) {
        console.error('Failed to load document:', err);
      }
    }
    fetchDoc();
  }, [documentId]);

  // SSE Presence Connection Simulation
  useEffect(() => {
    const evtSource = new EventSource(`/api/presence/${documentId}`);
    
    evtSource.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.event === 'cursor_move' && msg.userId !== currentUserId) {
          setActiveUsers((prev) => 
            prev.map((u) => u.id === msg.userId ? { ...u, cursorX: msg.x, cursorY: msg.y } : u)
          );
        }
      } catch {
        // Heartbeat
      }
    };

    // Simulate subtle live cursor movement
    const simInterval = setInterval(() => {
      setActiveUsers((prev) => prev.map((u) => ({
        ...u,
        cursorX: Math.max(100, Math.min(600, u.cursorX + (Math.random() * 40 - 20))),
        cursorY: Math.max(100, Math.min(400, u.cursorY + (Math.random() * 30 - 15)))
      })));
    }, 3000);

    return () => {
      evtSource.close();
      clearInterval(simInterval);
    };
  }, [documentId, currentUserId]);

  // Keyboard shortcut Cmd+K / Ctrl+K for AI Assistant
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const selection = window.getSelection()?.toString();
        if (selection) {
          setSelectedText(selection);
          setShowAiPalette(true);
          setAiError('');
        } else {
          setAiError('Please select some text in the editor first to use AI assistant.');
          setShowAiPalette(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save changes
  const handleSave = async (createVersion = false) => {
    if (!canEdit) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/documents/${documentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          createVersion,
          commitMessage: createVersion ? `Manual Snapshot at ${new Date().toLocaleTimeString()}` : undefined
        }),
      });
      if (res.ok) {
        setLastSaved(new Date());
        if (createVersion) {
          const updated = await res.json();
          setVersions(updated.document.versions || []);
        }
      }
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  // Broadcast cursor position
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!editorRef.current) return;
    const rect = editorRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Throttle publish
    if (Math.random() > 0.8) {
      fetch(`/api/presence/${documentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'cursor_move', userId: currentUserId, x, y }),
      }).catch(() => {});
    }
  };

  // Run AI command
  const executeAiCommand = async (command: string) => {
    setAiLoading(true);
    setAiError('');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, selectedText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiError(data.error || 'AI request failed');
      } else {
        // Replace selected text
        setContent((prev) => prev.replace(selectedText, data.result));
        setShowAiPalette(false);
      }
    } catch {
      setAiError('Network failure connecting to AI endpoint.');
    } finally {
      setAiLoading(false);
    }
  };

  // Restore version
  const handleRestoreVersion = (snapshot: string) => {
    setContent(snapshot);
    setShowHistory(false);
    handleSave(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 text-slate-800 dark:text-slate-100 relative">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={title}
            disabled={!canEdit}
            onChange={(e) => setTitle(e.target.value)}
            className="font-extrabold text-2xl md:text-3xl bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 -ml-2"
          />
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-800">
            <Shield className="w-3.5 h-3.5" />
            Role: {currentUserRole}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Active Presence Indicators */}
          <div className="flex items-center -space-x-2 mr-2">
            {activeUsers.map((u) => (
              <div
                key={u.id}
                title={`${u.name} (${u.role})`}
                style={{ backgroundColor: u.color }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-slate-900 shadow"
              >
                {u.name[0]}
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowHistory(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            <History className="w-4 h-4" />
            <span>History ({versions.length})</span>
          </button>

          {canEdit && (
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Saving...' : 'Save Snapshot'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor & Presence Canvas Container */}
      <div 
        ref={editorRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-[550px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8"
      >
        {/* Live Cursors Overlay */}
        {activeUsers.map((u) => (
          <div
            key={u.id}
            style={{ left: `${u.cursorX}px`, top: `${u.cursorY}px` }}
            className="absolute pointer-events-none transition-all duration-300 z-10 flex flex-col items-start"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={u.color} className="-rotate-45 drop-shadow">
              <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" />
            </svg>
            <span 
              style={{ backgroundColor: u.color }}
              className="px-2 py-0.5 text-[10px] font-bold text-white rounded shadow-sm whitespace-nowrap -mt-1 ml-3"
            >
              {u.name}
            </span>
          </div>
        ))}

        {/* Read-Only Warning Banner */}
        {!canEdit && (
          <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl flex items-center gap-2 text-amber-800 dark:text-amber-200 text-sm">
            <Eye className="w-4 h-4 text-amber-600 shrink-0" />
            <span>You have <strong>Viewer</strong> access to this document. Content is read-only.</span>
          </div>
        )}

        {/* Editable Rich Text Content Area */}
        <div className="space-y-4">
          {canEdit ? (
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (!saving) handleSave(false);
              }}
              placeholder="Type your Notion-style notes here... Select text and press Cmd+K / Ctrl+K for AI Assistant."
              className="w-full h-[450px] bg-transparent resize-none border-none focus:outline-none font-mono text-base leading-relaxed"
            />
          ) : (
            <div 
              className="prose dark:prose-invert max-w-none font-sans text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
            />
          )}
        </div>

        {/* Footer info */}
        <div className="absolute bottom-4 right-6 text-xs text-slate-400 flex items-center gap-3">
          <span>OWASP DOMPurify Active</span>
          {lastSaved && <span>Saved {lastSaved.toLocaleTimeString()}</span>}
        </div>
      </div>

      {/* Version History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-500" />
                Version Snapshots
              </h3>
              <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {versions.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No historical versions recorded yet. Click Save Snapshot to create one.</p>
              ) : (
                versions.map((ver) => (
                  <div key={ver.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="font-medium text-sm">{ver.commitMessage || 'Snapshot'}</p>
                      <p className="text-xs text-slate-400">{new Date(ver.createdAt).toLocaleString()}</p>
                    </div>
                    {canEdit && (
                      <button
                        onClick={() => handleRestoreVersion(ver.contentSnapshot)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded shadow-sm text-indigo-600 dark:text-indigo-400 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" /> Restore
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Command Palette Modal (Cmd+K) */}
      {showAiPalette && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-start justify-center pt-24 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
                <Bot className="w-5 h-5" />
                <span>AI Writing Assistant</span>
                <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 px-1.5 py-0.5 rounded text-indigo-600 font-mono">Cmd+K</span>
              </div>
              <button onClick={() => setShowAiPalette(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            {aiError ? (
              <div className="p-3 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-300 text-xs rounded-lg">
                {aiError}
              </div>
            ) : (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-300 max-h-24 overflow-y-auto border border-slate-100 dark:border-slate-800">
                &ldquo;{selectedText}&rdquo;
              </div>
            )}

            <div className="grid grid-cols-1 gap-2 pt-1">
              {['Improve writing', 'Summarise', 'Translate', 'Continue'].map((cmd) => (
                <button
                  key={cmd}
                  disabled={aiLoading || !selectedText}
                  onClick={() => executeAiCommand(cmd)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800/80 dark:hover:bg-indigo-950/60 text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer text-left border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{cmd}</span>
                  </div>
                  {aiLoading && <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />}
                </button>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-100 dark:border-slate-800">
              Protected by Upstash Redis Sliding Window Rate Limiting (5 req/min)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
