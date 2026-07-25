"use client";
 
import { useState } from "react";
import { 
  User, Lock, ShieldCheck, Eye, Bell, Activity, Laptop, 
  Trash2, Download, ToggleLeft, ToggleRight, Sparkles, Languages
} from "lucide-react";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import ThemeToggle from "@/components/common/ThemeToggle";
import Button from "@/components/ui/Button";

type SettingCategory = "account" | "security" | "clinical";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingCategory>("account");
  const [is2FAActive, setIs2FAActive] = useState(false);
  const [isBiometricActive, setIsBiometricActive] = useState(false);

  return (
    <>
      <DashboardTopbar title="Settings" />
      <div className="p-6 lg:p-10 space-y-8 bg-bg min-h-screen pb-24">
        {/* Navigation Tabs */}
        <div className="flex border-b border-border">
          {[
            { id: "account", label: "Account & Appearance", icon: User },
            { id: "security", label: "Security & Privacy", icon: ShieldCheck },
            { id: "clinical", label: "Clinical Preferences", icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as SettingCategory)}
                className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  isActive ? "border-primary text-primary" : "border-transparent text-muted hover:text-text"
                }`}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="max-w-3xl space-y-6">
          {activeTab === "account" && (
            <div className="space-y-6 animate-fadeIn">
              {/* General Account */}
              <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
                <h3 className="font-bold text-text text-sm border-b border-border/40 pb-2">General Account Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Username</label>
                    <input type="text" defaultValue="adityavarma" className="w-full rounded-xl border border-border bg-bg/50 px-4 py-2.5 text-xs text-text outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Verification Number</label>
                    <input type="text" defaultValue="+91 XXXXX XX210" disabled className="w-full rounded-xl border border-border bg-bg/20 px-4 py-2.5 text-xs text-muted outline-none cursor-not-allowed" />
                  </div>
                </div>
              </div>

              {/* Appearance */}
              <div className="flex items-center justify-between rounded-2xl border border-border bg-surface p-6">
                <div>
                  <h4 className="font-bold text-text text-sm">Appearance</h4>
                  <p className="text-xs text-muted mt-1">Switch between dark and light themes.</p>
                </div>
                <ThemeToggle />
              </div>

              {/* Languages & Localization */}
              <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
                <h3 className="font-bold text-text text-sm flex items-center gap-2"><Languages size={16} className="text-primary" /> Language & Accessibility</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Screen Reader Friendly</label>
                    <select className="w-full rounded-xl border border-border bg-bg/50 px-4 py-2.5 text-xs text-text outline-none focus:border-primary">
                      <option className="bg-surface">Default (Standard ARIA)</option>
                      <option className="bg-surface">Enhanced Reader Accessibility</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted tracking-wider">High Contrast Theme</label>
                    <select className="w-full rounded-xl border border-border bg-bg/50 px-4 py-2.5 text-xs text-text outline-none focus:border-primary">
                      <option className="bg-surface">Inactive</option>
                      <option className="bg-surface">Active (WCAG AAA Compliant)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Credentials & Access */}
              <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
                <h3 className="font-bold text-text text-sm border-b border-border/40 pb-2">Security Auditing</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-text">Two-Factor Authentication (2FA)</h4>
                    <p className="text-[10px] text-muted mt-0.5">Enforce login validation via secondary Authenticator app.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setIs2FAActive(!is2FAActive)}
                    className="text-primary transition-transform duration-200 active:scale-95"
                  >
                    {is2FAActive ? <ToggleRight size={38} /> : <ToggleLeft size={38} className="text-muted" />}
                  </button>
                </div>
                <div className="flex items-center justify-between border-t border-border/40 pt-4">
                  <div>
                    <h4 className="text-xs font-bold text-text">Biometric Authorization</h4>
                    <p className="text-[10px] text-muted mt-0.5">Unlock account dashboard via TouchID or WebAuthn metrics.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setIsBiometricActive(!isBiometricActive)}
                    className="text-primary transition-transform duration-200 active:scale-95"
                  >
                    {isBiometricActive ? <ToggleRight size={38} /> : <ToggleLeft size={38} className="text-muted" />}
                  </button>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
                <h3 className="font-bold text-text text-sm flex items-center gap-2"><Laptop size={16} className="text-primary" /> Connected Sessions</h3>
                <div className="flex items-center justify-between p-3 rounded-xl bg-bg/40 border border-border/60">
                  <div>
                    <p className="text-xs font-bold text-text">Chrome / Windows 10 (Current)</p>
                    <p className="text-[9px] text-muted">IP Address: 157.48.204.14 · Mumbai, India</p>
                  </div>
                  <span className="text-[10px] font-bold text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">Active</span>
                </div>
              </div>

              {/* Data Ownership */}
              <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
                <h3 className="font-bold text-text text-sm border-b border-border/40 pb-2">GDPR Data Portability</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-text">Export Clinical Profile</h4>
                    <p className="text-[10px] text-muted mt-0.5">Download entire medical metric logs in JSON/FHIR schema.</p>
                  </div>
                  <Button variant="outline" className="flex items-center gap-1.5 !px-3 !py-2 text-[10px] border-border text-text hover:bg-surface2">
                    <Download size={12} /> Export FHIR JSON
                  </Button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 space-y-3">
                <h4 className="font-bold text-red-400 text-sm flex items-center gap-2"><Trash2 size={16} /> Danger Zone</h4>
                <p className="text-xs text-muted leading-relaxed">Permanently delete your profile, prediction history, and reports. All cloud analytical assets will be destroyed. This cannot be undone.</p>
                <button type="button" className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all px-4 py-2 rounded-xl mt-2">
                  Permanently Delete Nidaan+ Account
                </button>
              </div>
            </div>
          )}

          {activeTab === "clinical" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Unit System */}
              <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
                <h3 className="font-bold text-text text-sm border-b border-border/40 pb-2">Medical Units</h3>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider block">Clinical Metrics Format</label>
                  <select className="w-full rounded-xl border border-border bg-bg/50 px-4 py-2.5 text-xs text-text outline-none focus:border-primary">
                    <option className="bg-surface">Metric System (cm, kg, mg/dL)</option>
                    <option className="bg-surface">Imperial System (lbs, inches, mmol/L)</option>
                  </select>
                </div>
              </div>

              {/* AI Prediction Settings */}
              <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
                <h3 className="font-bold text-text text-sm flex items-center gap-2"><Sparkles size={16} className="text-primary" /> AI Model Preferences</h3>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider block">Triage Engine Mode</label>
                  <select className="w-full rounded-xl border border-border bg-bg/50 px-4 py-2.5 text-xs text-text outline-none focus:border-primary">
                    <option className="bg-surface">Detailed Explainability Report (Generates SHAP/LIME diagrams)</option>
                    <option className="bg-surface">Summary Mode (Basic confidence index only)</option>
                  </select>
                </div>
                <div className="space-y-1 pt-2">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider block">Connected Health Hub</label>
                  <select className="w-full rounded-xl border border-border bg-bg/50 px-4 py-2.5 text-xs text-text outline-none focus:border-primary">
                    <option className="bg-surface">Standalone (No external hardware synced)</option>
                    <option className="bg-surface">Sync with Apple Health Kit</option>
                    <option className="bg-surface">Sync with Fitbit Developer API</option>
                    <option className="bg-surface">Sync with Garmin Connect</option>
                  </select>
                </div>
              </div>

              {/* Notifications */}
              <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
                <h3 className="font-bold text-text text-sm flex items-center gap-2"><Bell size={16} className="text-primary" /> Notifications & Alerts</h3>
                <div className="space-y-3 text-xs text-muted">
                  <label className="flex items-center gap-3 cursor-pointer hover:text-text transition-colors">
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border accent-primary cursor-pointer" />
                    <span>Email notifications for prediction results & report readiness</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer hover:text-text transition-colors">
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border accent-primary cursor-pointer" />
                    <span>Reminder alerts to perform recommended preventative blood panels</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer hover:text-text transition-colors">
                    <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary cursor-pointer" />
                    <span>Send system alerts for model version upgrades & clinical changes</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
