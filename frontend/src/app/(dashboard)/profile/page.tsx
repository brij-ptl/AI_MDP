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

// Custom Calendar Date Picker Component
function CustomDatePicker({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date(1995, 0, 1));
  const containerRef = useRef<HTMLDivElement>(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Generate range of years
  const years: number[] = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 1920; y--) {
    years.push(y);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1));
  };

  // Get list of days in current month
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    
    // Fill empty slots before start of month
    const startDay = date.getDay();
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const selectDay = (day: Date) => {
    const yyyy = day.getFullYear();
    const mm = String(day.getMonth() + 1).padStart(2, "0");
    const dd = String(day.getDate()).padStart(2, "0");
    onChange(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const days = getDaysInMonth();
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="text-[10px] uppercase font-bold text-muted tracking-wider block mb-1">Date of Birth</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-xl border border-border bg-bg/50 px-4 py-3 cursor-pointer hover:border-primary/60 transition-colors"
      >
        <span className="text-sm text-text">{value ? new Date(value).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : "Select birthdate"}</span>
        <Calendar size={16} className="text-muted" />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-72 rounded-2xl border border-border bg-surface p-4 shadow-xl transition-all animate-fadeIn">
          {/* Calendar Header Controls */}
          <div className="flex items-center justify-between gap-1 mb-4 pb-2 border-b border-border/40">
            <button type="button" onClick={handlePrevMonth} className="p-1 rounded-lg hover:bg-bg text-muted hover:text-primary transition-colors"><ChevronLeft size={16} /></button>
            <div className="flex gap-1.5">
              <select 
                value={currentDate.getMonth()} 
                onChange={handleMonthChange}
                className="bg-bg text-text text-xs rounded-lg border border-border p-1 outline-none font-semibold cursor-pointer"
              >
                {months.map((m, i) => (
                  <option key={i} value={i}>{m}</option>
                ))}
              </select>
              <select 
                value={currentDate.getFullYear()} 
                onChange={handleYearChange}
                className="bg-bg text-text text-xs rounded-lg border border-border p-1 outline-none font-semibold cursor-pointer"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <button type="button" onClick={handleNextMonth} className="p-1 rounded-lg hover:bg-bg text-muted hover:text-primary transition-colors"><ChevronRight size={16} /></button>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {weekdays.map((w) => (
              <span key={w} className="text-[10px] font-bold text-muted uppercase">{w}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              if (day === null) return <span key={`empty-${i}`} />;
              const isSelected = value === `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
              const isToday = new Date().toDateString() === day.toDateString();
              return (
                <button
                  key={day.getTime()}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={`h-8 w-8 text-xs font-semibold rounded-lg flex items-center justify-center transition-all ${
                    isSelected ? "bg-primary text-bg font-extrabold shadow-sm scale-110" : 
                    isToday ? "border border-primary text-primary" : 
                    "text-text hover:bg-bg/60"
                  }`}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Aditya Varma",
    email: "aditya.varma@nidaanplus.in",
    phone: "+91 98765 43210",
    dob: "1995-04-12",
    bloodGroup: "O+",
    height: "178",
    weight: "74",
    emergencyContact: "Ramesh Varma (Father) - +91 99887 76655",
    allergies: "Peanuts, Penicillin",
    chronicConditions: "Mild Asthma",
    activityLevel: "Moderately Active",
    smoking: "Non-smoker",
    alcohol: "Occasional",
    insurance: "Star Health Assurance - #SH10034928"
  });
  
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    setIsSubscribed(Cookies.get("vitalis_subscribed") === "true");
  }, []);

  // Compute profile completion percentage dynamically
  useEffect(() => {
    const totalFields = Object.keys(profileData).length;
    const filledFields = Object.values(profileData).filter(val => val.trim() !== "").length;
    setCompletion(Math.round((filledFields / totalFields) * 100));
  }, [profileData]);

  const handleChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Clinical Profile Successfully Synchronized.");
  };

  return (
    <>
      <DashboardTopbar title="Clinical Profile" />
      <div className="p-6 lg:p-10 space-y-8 bg-bg min-h-screen pb-24">
        {/* Upper Profile Box */}
        <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary border border-border" />
              {isSubscribed && (
                <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#FBBF24] border-2 border-bg text-bg text-[10px] font-bold shadow-md animate-pulse">
                  ★
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-extrabold text-text">{profileData.fullName}</h2>
                {isSubscribed && (
                  <span className="flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[9px] font-bold text-primary">
                    Care+ Subscriber
                  </span>
                )}
              </div>
              <p className="text-xs text-muted mt-1">{profileData.email}</p>
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
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200" 
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
                  <CustomDatePicker 
                    value={profileData.dob} 
                    onChange={(val) => handleChange("dob", val)} 
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 space-y-6">
              <h3 className="font-bold text-text text-sm pb-2 border-b border-border/40">2. Physical & Clinical Metrics</h3>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Blood Group</label>
                  <select 
                    value={profileData.bloodGroup}
                    onChange={(e) => handleChange("bloodGroup", e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 cursor-pointer" 
                  >
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
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Emergency Contact</label>
                  <input 
                    type="text" 
                    value={profileData.emergencyContact}
                    onChange={(e) => handleChange("emergencyContact", e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Insurance Identification</label>
                  <input 
                    type="text" 
                    value={profileData.insurance}
                    onChange={(e) => handleChange("insurance", e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200" 
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 space-y-6">
              <h3 className="font-bold text-text text-sm pb-2 border-b border-border/40">3. Anamnesis / Medical History</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Known Allergies</label>
                  <input 
                    type="text" 
                    value={profileData.allergies}
                    onChange={(e) => handleChange("allergies", e.target.value)}
                    className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider">Chronic Conditions</label>
                  <input 
                    type="text" 
                    value={profileData.chronicConditions}
                    onChange={(e) => handleChange("chronicConditions", e.target.value)}
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
                    {["Sedentary", "Lightly Active", "Moderately Active", "Very Active"].map((a) => (
                      <option key={a} value={a} className="bg-surface text-text">{a}</option>
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
                    {["Non-smoker", "Occasional", "Regular Smoker"].map((s) => (
                      <option key={s} value={s} className="bg-surface text-text">{s}</option>
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
                    {["None", "Occasional", "Regular"].map((a) => (
                      <option key={a} value={a} className="bg-surface text-text">{a}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 space-y-6">
              <h3 className="font-bold text-text text-sm pb-2 border-b border-border/40">5. Preferences</h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider block">Preferred Language</label>
                  <select 
                    defaultValue="English" 
                    className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-xs text-text outline-none focus:border-primary cursor-pointer"
                  >
                    {["English", "Hindi", "Spanish", "French", "German"].map((l) => (
                      <option key={l} value={l} className="bg-surface text-text">{l}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted tracking-wider block">Timezone</label>
                  <select 
                    defaultValue="GMT+5:30" 
                    className="w-full rounded-xl border border-border bg-bg/50 px-4 py-3 text-xs text-text outline-none focus:border-primary cursor-pointer"
                  >
                    {["GMT+5:30 (IST)", "GMT-5:00 (EST)", "GMT+0:00 (UTC)", "GMT+8:00 (SGT)"].map((t) => (
                      <option key={t} value={t} className="bg-surface text-text">{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button type="submit" className="w-full py-4 text-xs font-bold shadow-glow hover:-translate-y-0.5">
                Save & Synchronize Changes
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
