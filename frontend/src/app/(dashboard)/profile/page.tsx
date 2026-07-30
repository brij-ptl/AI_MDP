"use client";
 
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { 
  User, Mail, Phone, Calendar, Heart, ShieldAlert, Award, 
  ChevronLeft, ChevronRight, Activity, Globe, Compass, 
  ShieldCheck, Check, Info, Award as StarIcon
} from "lucide-react";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user.service";
import { dashboardService } from "@/services/dashboard.service";

// Custom Calendar Date Picker Component removed since backend uses Age.

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);
  
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    bloodGroup: "",
    height: "",
    weight: "",
    familyHistory: "",
    existingConditions: "",
    activityLevel: "",
    smoking: "",
    alcohol: "",
  });
  
  const [completion, setCompletion] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const responses = await Promise.all([
          dashboardService.overview(),
          userService.getMedicalProfile()
        ]);
        const dashRes: any = responses[0];
        const medRes: any = responses[1];
        setOverview(dashRes.data);
        
        const med = medRes.data;
        setProfileData({
          fullName: user?.full_name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          age: med?.age ? String(med.age) : "",
          gender: med?.gender || "",
          bloodGroup: med?.blood_group || "",
          height: med?.height_cm ? String(med.height_cm) : "",
          weight: med?.weight_kg ? String(med.weight_kg) : "",
          familyHistory: med?.family_history || "",
          existingConditions: med?.existing_conditions || "",
          activityLevel: med?.physical_activity || "",
          smoking: med?.smoking || "",
          alcohol: med?.alcohol || "",
        });
      } catch (err) {
        setMessage("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      loadData();
    }
  }, [user]);

  // Compute profile completion percentage dynamically
  useEffect(() => {
    const totalFields = Object.keys(profileData).length;
    const filledFields = Object.values(profileData).filter(val => String(val).trim() !== "").length;
    setCompletion(Math.round((filledFields / totalFields) * 100));
  }, [profileData]);

  const handleChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      // 1. Update basic info
      if (profileData.fullName !== user?.full_name || profileData.phone !== user?.phone) {
        await userService.updateMe({ full_name: profileData.fullName, phone: profileData.phone });
        await refreshUser();
      }
      
      // 2. Update medical profile
      await userService.saveMedicalProfile({
        age: profileData.age ? parseInt(profileData.age) : null,
        gender: profileData.gender || null,
        height_cm: profileData.height ? parseFloat(profileData.height) : null,
        weight_kg: profileData.weight ? parseFloat(profileData.weight) : null,
        blood_group: profileData.bloodGroup || null,
        smoking: profileData.smoking || null,
        alcohol: profileData.alcohol || null,
        physical_activity: profileData.activityLevel || null,
        family_history: profileData.familyHistory || null,
        existing_conditions: profileData.existingConditions || null,
      });

      setMessage("Clinical Profile Successfully Synchronized.");
    } catch (err: any) {
      setMessage(err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  if (loading) {
    return <><DashboardTopbar title="Clinical Profile" /><div className="p-10 text-center text-muted">Loading profile...</div></>;
  }

  return (
    <>
      <DashboardTopbar title="Clinical Profile" />
      <div className="p-6 lg:p-10 space-y-8 bg-bg min-h-screen pb-24 animate-fadeIn">
        {/* Upper Profile Box */}
        <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary border border-border flex items-center justify-center text-xl font-bold text-bg">
                {user?.full_name?.charAt(0)?.toUpperCase()}
              </div>
              {overview?.is_premium_active && (
                <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#FBBF24] border-2 border-bg text-bg text-[10px] font-bold shadow-md animate-pulse">
                  ★
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-extrabold text-text">{user?.full_name}</h2>
                <span className="flex items-center gap-1 rounded-full bg-surface2 border border-border px-2 py-0.5 text-[9px] font-bold text-muted capitalize">
                  {user?.role} Role
                </span>
                {overview?.is_premium_active && (
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[9px] font-bold text-primary">
                    Care+ Subscriber
                  </span>
                )}
              </div>
              <p className="text-xs text-muted mt-1">{user?.email}</p>
              {overview && (
                <p className="text-xs text-primary font-medium mt-1">
                  Tokens: {overview.prediction_tokens} | Plan: {overview.subscription_plan}
                </p>
              )}
            </div>
          </div>
          <div className="w-full sm:w-auto text-right">
            <Button variant="outline" className="!px-4 !py-2 text-xs w-full sm:w-auto border-border text-text hover:bg-surface2 transition-all">Change photo</Button>
          </div>
        </div>

        {/* Completion Progress Bar */}
        <div className="rounded-2xl border border-border bg-surface p-6 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-text uppercase tracking-wider flex items-center gap-1.5"><Activity size={14} className="text-primary" /> Profile Completion</span>
            <span className="font-bold text-primary">{completion}% Complete</span>
          </div>
          <div className="h-2 w-full bg-surface2 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500" style={{ width: `${completion}%` }} />
          </div>
          <p className="text-[10px] text-muted leading-relaxed">Complete your health parameters to receive highly personalized preventative indicators during screening.</p>
        </div>

        {/* Main Forms Grid */}
        <form onSubmit={handleSave} className="grid gap-8 lg:grid-cols-3 items-start">
          {/* Form Left Fields */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-6">
              <h3 className="font-bold text-text text-sm pb-2 border-b border-border/40">1. Vital Demographics</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    value={profileData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    value={profileData.email}
                    disabled
                    className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-sm text-muted opacity-60 outline-none cursor-not-allowed" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Phone Number</label>
                  <input 
                    type="text" 
                    value={profileData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Age</label>
                  <input 
                    type="number" 
                    value={profileData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Gender</label>
                  <select 
                    value={profileData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-sm text-text outline-none focus:border-primary cursor-pointer" 
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 space-y-6">
              <h3 className="font-bold text-text text-sm pb-2 border-b border-border/40">2. Physical & Clinical Metrics</h3>
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Blood Group</label>
                  <select 
                    value={profileData.bloodGroup}
                    onChange={(e) => handleChange("bloodGroup", e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-sm text-text outline-none focus:border-primary cursor-pointer" 
                  >
                    <option value="">Select</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => (
                      <option key={b} value={b} className="bg-surface text-text">{b}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Height (cm)</label>
                  <input 
                    type="number" 
                    value={profileData.height}
                    onChange={(e) => handleChange("height", e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={profileData.weight}
                    onChange={(e) => handleChange("weight", e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200" 
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 space-y-6">
              <h3 className="font-bold text-text text-sm pb-2 border-b border-border/40">3. Anamnesis / Medical History</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Family History</label>
                  <input 
                    type="text" 
                    value={profileData.familyHistory}
                    placeholder="e.g. Diabetes, Hypertension"
                    onChange={(e) => handleChange("familyHistory", e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Existing Conditions</label>
                  <input 
                    type="text" 
                    value={profileData.existingConditions}
                    placeholder="e.g. Asthma"
                    onChange={(e) => handleChange("existingConditions", e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Settings Column */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-border bg-surface p-6 space-y-6">
              <h3 className="font-bold text-text text-sm pb-2 border-b border-border/40">4. Lifestyle Parameters</h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider block">Physical Activity</label>
                  <select 
                    value={profileData.activityLevel}
                    onChange={(e) => handleChange("activityLevel", e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-xs text-text outline-none focus:border-primary cursor-pointer" 
                  >
                    <option value="">Select</option>
                    {["sedentary", "moderate", "active"].map((a) => (
                      <option key={a} value={a} className="bg-surface text-text capitalize">{a}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider block">Smoking Habits</label>
                  <select 
                    value={profileData.smoking}
                    onChange={(e) => handleChange("smoking", e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-xs text-text outline-none focus:border-primary cursor-pointer" 
                  >
                    <option value="">Select</option>
                    {["never", "former", "current"].map((s) => (
                      <option key={s} value={s} className="bg-surface text-text capitalize">{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider block">Alcohol Consumption</label>
                  <select 
                    value={profileData.alcohol}
                    onChange={(e) => handleChange("alcohol", e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-xs text-text outline-none focus:border-primary cursor-pointer" 
                  >
                    <option value="">Select</option>
                    {["never", "occasional", "regular"].map((a) => (
                      <option key={a} value={a} className="bg-surface text-text capitalize">{a}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {message && (
                <div className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-center text-xs font-semibold text-primary">
                  {message}
                </div>
              )}
              <Button type="submit" disabled={saving} className="w-full py-4 text-xs font-bold shadow-glow hover:-translate-y-0.5">
                {saving ? "Saving..." : "Save & Synchronize Changes"}
              </Button>
              <div className="flex items-center gap-2 text-[10px] text-muted justify-center">
                <ShieldCheck size={12} className="text-primary" />
                <span>Encrypted HIPAA clinical profile syncing</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
