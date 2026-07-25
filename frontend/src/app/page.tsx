import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck, Sparkles, FileText, Stethoscope, ArrowRight, Lock,
  Database, TrendingUp, UserCheck, Server, Zap, Search, Brain,
  Clock, ArrowUpRight, Star, ShieldAlert, Check, X, Info, Activity
} from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { DISEASES } from "@/constants/diseases";
import { PLANS } from "@/constants/plans";
import { formatINR } from "@/lib/utils";
import PublicLayout from "./(public)/layout";

export default function HomePage() {
  return (
    <PublicLayout>
      {/* IMMERSIVE HERO WITH DARK OVERLAY */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-bg">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero_page.jpeg"
            alt="Nidaan+ clinical backdrop"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Subtle vignette / radial dark overlay */}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Content Container */}
        <Container className="relative z-10 text-center py-24 px-6 max-w-4xl">
          <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary backdrop-blur-md animate-pulse">
            <Sparkles size={14} /> AI Precision Healthcare Platform
          </p>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] text-slate-900 sm:text-5xl md:text-6xl tracking-[-0.03em]">
            Predict Disease Before <br />
            <span className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 bg-clip-text text-transparent">
              Symptoms Become Serious.
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-lg text-slate-700 leading-8">
            AI-powered clinical screening that helps identify health risks early using explainable machine learning models trained on trusted medical datasets.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/register" className="w-full sm:w-auto px-8 py-4 shadow-glow hover:-translate-y-[3px] transition-all duration-200">
              Start Free Screening <ArrowRight size={16} />
            </Button>
            <Button href="/diseases" variant="outline" className="w-full sm:w-auto px-8 py-4 border-white/20 text-white hover:bg-white/10 transition-all duration-200">
              Explore Disease Modules
            </Button>
          </div>

          {/* Checklist underneath CTA */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 justify-center text-xs sm:text-sm text-slate-400 max-w-3xl mx-auto pt-8 border-t border-white/10">
            <div className="flex items-center justify-center gap-2">
              <span className="text-primary font-bold text-lg">✓</span> Privacy First
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-primary font-bold text-lg">✓</span> Explainable AI
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-primary font-bold text-lg">✓</span> 16 Disease Models
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-primary font-bold text-lg">✓</span> Secure Cloud
            </div>
          </div>
        </Container>
      </section>

      {/* WHY TRUST NIDAAN+ SECTION */}
      <section className="py-24 border-y border-border bg-surface/20">
        <Container>
          <SectionHeading
            eyebrow="Clinical Excellence"
            title="Why Trust Nidaan+"
            description="Designed to offer rigorous, evidence-based preliminary triage based on proven datasets."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: UserCheck,
                title: "Clinical Accuracy",
                desc: "Models aligned with guidelines from institutions like WHO, CDC, and the Mayo Clinic."
              },
              {
                icon: Brain,
                title: "Explainable AI",
                desc: "Get model transparency report showcasing feature importance with SHAP & LIME values."
              },
              {
                icon: ShieldCheck,
                title: "Privacy First",
                desc: "End-to-end data encryption. Your personal health metrics are never shared or sold."
              },
              {
                icon: Server,
                title: "Secure Cloud",
                desc: "HIPAA-ready cloud database infrastructure with granular user-controlled data rights."
              },
              {
                icon: Database,
                title: "Medical Dataset",
                desc: "Trained and verified on anonymized, high-fidelity medical research cohorts."
              },
              {
                icon: Zap,
                title: "Fast Results",
                desc: "Structured intake forms deliver a comprehensive health action report in under 5 minutes."
              }
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="group relative rounded-2xl border border-border bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                    <IconComp size={24} />
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-text">{item.title}</h3>
                  <p className="mt-3 text-sm text-muted leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* STATISTICS SECTION */}
      <section className="py-20 bg-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-radial opacity-50 pointer-events-none" />
        <Container className="relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { val: "120K+", label: "Predictions Generated" },
              { val: "16", label: "Disease Models" },
              { val: "98%", label: "User Satisfaction" },
              { val: "24/7", label: "AI Availability" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2 p-4">
                <p className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#00A6D6] to-[#2F6BFF] bg-clip-text text-transparent tracking-tight">
                  {stat.val}
                </p>
                <p className="text-sm font-semibold uppercase tracking-wider text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* DISEASE MODULE SECTION */}
      <section className="py-24 border-t border-border bg-surface/10">
        <Container>
          <SectionHeading
            eyebrow="Clinical Modules"
            title="16 conditions. One intelligent platform."
            description="Explore our specialized prediction modules. Each leverages diagnostic criteria and lifestyle metrics."
          />

          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DISEASES.map((d) => (
              <Link
                key={d.slug}
                href={`/prediction/${d.slug}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl transition-transform duration-300 group-hover:scale-110 inline-block">{d.emoji}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {d.category}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-text group-hover:text-primary transition-colors duration-200">
                    {d.name}
                  </h3>
                  <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-2">
                    {d.tagline}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs">
                  <div className="flex flex-col gap-1 text-[11px] text-muted">
                    <span className="flex items-center gap-1"><Clock size={12} /> ~3 mins</span>
                    <span className="flex items-center gap-1 font-semibold text-primary/80"><Check size={12} /> ~96% Acc.</span>
                  </div>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:translate-x-1 group-hover:bg-primary group-hover:text-bg">
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* HOW IT WORKS TIMELINE */}
      <section className="py-24 border-t border-border bg-bg relative">
        <Container>
          <SectionHeading
            eyebrow="Triage Pipeline"
            title="How Nidaan+ Works"
            description="Our step-by-step interactive framework allows you to gain instant clinical insight safely."
          />

          <div className="mt-16 relative">
            {/* Timeline connection line (horizontal on desktop) */}
            <div className="hidden lg:block absolute top-10 left-1/8 right-1/8 h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 z-0" />

            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 relative z-10">
              {[
                {
                  step: "01",
                  title: "Create Account",
                  desc: "Start with 2 free credentials. Secured via session privacy safeguards."
                },
                {
                  step: "02",
                  title: "Enter Symptoms",
                  desc: "Guided questions collect lifestyle history and current physiological indicators."
                },
                {
                  step: "03",
                  title: "AI Analysis",
                  desc: "Machine learning models match inputs against thousands of clinical metrics."
                },
                {
                  step: "04",
                  title: "Get Report",
                  desc: "Receive action plan, specialist referrals, and a detailed SHAP feature report."
                }
              ].map((s, idx) => (
                <div key={idx} className="group flex flex-col items-center text-center bg-surface p-6 rounded-2xl border border-border shadow-card transition-all duration-200 hover:border-primary/30">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20 font-display font-extrabold text-lg text-primary shadow-glow transition-transform duration-300 group-hover:rotate-6">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-text text-base mt-2">{s.title}</h3>
                  <p className="mt-2.5 text-xs text-muted leading-relaxed max-w-xs">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* WHY PEOPLE CHOOSE NIDAAN+ COMPARISON */}
      <section className="py-24 border-t border-border bg-surface/10">
        <Container>
          <SectionHeading
            eyebrow="Comparison"
            title="Traditional Search vs Nidaan+"
            description="How Nidaan+ resolves the information problem of diagnostic self-evaluation."
          />

          <div className="mt-14 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Traditional Search */}
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 space-y-6">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-red-500/10 text-red-500"><Search size={22} /></span>
                <h3 className="font-bold text-lg text-text">Traditional Web Search</h3>
              </div>
              <ul className="space-y-4 text-sm text-muted">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 mt-0.5"><X size={16} /></span>
                  <span>Prompts generalized panic with unweighted condition matches.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 mt-0.5"><X size={16} /></span>
                  <span>Does not evaluate combined clinical markers dynamically.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 mt-0.5"><X size={16} /></span>
                  <span>Unfiltered, heavily ad-supported medical content.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 mt-0.5"><X size={16} /></span>
                  <span>No personalized action guide or specialist directions.</span>
                </li>
              </ul>
            </div>

            {/* Nidaan+ */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 space-y-6 shadow-glow">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-primary/10 text-primary"><Activity size={22} /></span>
                <h3 className="font-bold text-lg text-text">Nidaan+ Triage</h3>
              </div>
              <ul className="space-y-4 text-sm text-muted">
                <li className="flex items-start gap-2.5">
                  <span className="text-primary mt-0.5"><Check size={16} /></span>
                  <span>Calibrated confidence indexes mapping to precise risk brackets.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary mt-0.5"><Check size={16} /></span>
                  <span>Clinically informed intake forms mimicking a doctor's history.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary mt-0.5"><Check size={16} /></span>
                  <span>Explainable AI reports clarifying the specific causes of risk.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary mt-0.5"><Check size={16} /></span>
                  <span>Tailored physician specialist routing and physical intake checklists.</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* EXPLAINABLE AI */}
      <section className="py-24 border-t border-border bg-bg">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">Algorithm Clarity</p>
            <h2 className="font-display text-3xl font-extrabold leading-tight text-white md:text-4xl">
              Understand the "Why" with Explainable AI (XAI)
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              We reject black-box diagnostics. Every health risk report produced by Nidaan+ includes a feature relevance output showing exactly which metrics most heavily influenced the confidence metrics.
            </p>

            <div className="mt-8 space-y-6">
              {[
                { title: "Confidence Score", desc: "Granular likelihood distributions based on thousands of control patients." },
                { title: "Model Transparency", desc: "SHAP and LIME visualizations indicate specific lifestyle or diagnostic metrics." },
                { title: "Medical References", desc: "Hyperlinked reference material mapping models directly to peer-reviewed journals." },
                { title: "Clinical Validation", desc: "Backtested algorithms under physician-guided performance audits." }
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Check size={12} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted mt-1">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-3xl border border-border bg-surface p-8 shadow-card overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <h3 className="font-display font-bold text-sm text-text uppercase tracking-widest text-primary">SHAP Insight Simulation</h3>
            <div className="mt-6 space-y-4">
              {[
                { factor: "Systolic Blood Pressure >140", val: "+18.4%", type: "danger" },
                { factor: "Serum Cholesterol (220 mg/dL)", val: "+12.1%", type: "danger" },
                { factor: "Cardio Exercise (5 hr/wk)", val: "-8.5%", type: "good" },
                { factor: "Age Factor (54 yrs)", val: "+4.2%", type: "danger" },
                { factor: "Zero Smoking Habit", val: "-14.3%", type: "good" }
              ].map((row, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{row.factor}</span>
                    <span className={row.type === "good" ? "text-green-500 font-bold" : "text-amber-500 font-bold"}>
                      {row.val}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-surface2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${row.type === "good" ? "bg-green-500" : "bg-primary"}`}
                      style={{ width: `${Math.abs(parseFloat(row.val)) * 3}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2 text-[10px] text-muted bg-bg/50 p-3 rounded-xl">
              <Info size={14} className="text-primary shrink-0" />
              <span>Real-time models map personal clinical factors against normalized baseline cohorts.</span>
            </div>
          </div>
        </Container>
      </section>

      {/* SECURITY SECTION */}
      <section className="py-24 border-t border-border bg-surface/20">
        <Container className="max-w-4xl text-center space-y-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Enterprise Security</p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Strict Clinical Security. Guaranteed.
          </h2>
          <p className="text-muted text-base max-w-2xl mx-auto leading-relaxed">
            Your medical metrics are extremely sensitive. We secure all inputs and analytical predictions using bank-grade protection mechanisms.
          </p>

          <div className="grid gap-6 md:grid-cols-3 text-left mt-10">
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <h3 className="font-bold text-text flex items-center gap-2"><Lock size={16} className="text-primary" /> Encrypted Storage</h3>
              <p className="text-xs text-muted mt-2.5 leading-relaxed">All active database payloads undergo end-to-end AES-256 and SSL/TLS transmission encryption.</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <h3 className="font-bold text-text flex items-center gap-2"><ShieldCheck size={16} className="text-primary" /> HIPAA Aligned</h3>
              <p className="text-xs text-muted mt-2.5 leading-relaxed">System architecture strictly complies with standard HIPAA physical, network, and policy rules.</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <h3 className="font-bold text-text flex items-center gap-2"><Database size={16} className="text-primary" /> FHIR Standard</h3>
              <p className="text-xs text-muted mt-2.5 leading-relaxed">All generated logs and analytical files strictly support interoperable FHIR format specs.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* USER REVIEWS */}
      <section className="py-24 border-t border-border bg-bg">
        <Container>
          <SectionHeading
            eyebrow="Testimonials"
            title="Premium Patient Feedback"
            description="Hear from some of our verified health consumers who caught metrics ahead of schedules."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                text: "Nidaan+ helped identify my diabetes risk early. The report was clear enough to discuss with my doctor.",
                user: "Aditya V.",
                loc: "Mumbai",
                stars: 5
              },
              {
                text: "The explainable AI breakdown showing factor importance helped me realize my salt intake was directly spiking metrics.",
                user: "Raman K.",
                loc: "Delhi",
                stars: 5
              },
              {
                text: "Unbelievably simple OCR report scan. It filled out the complex kidney marker form automatically in seconds.",
                user: "Priya S.",
                loc: "Bangalore",
                stars: 5
              },
              {
                text: "A necessary preliminary check before scheduling a specialist. It helped calm my anxiety with actual data.",
                user: "Sunita G.",
                loc: "Chennai",
                stars: 5
              },
              {
                text: "Clean, Stripe-level experience. No ads or spam, just high-fidelity clinical model reporting.",
                user: "Vikram R.",
                loc: "Pune",
                stars: 5
              },
              {
                text: "The premium subscription was worth every rupee for my parents. We monitor their cardiovascular health monthly.",
                user: "Dr. Anil B.",
                loc: "Hyderabad",
                stars: 5
              }
            ].map((review, i) => (
              <div key={i} className="bg-surface p-6 rounded-2xl border border-border flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex text-amber-400">
                    {Array.from({ length: review.stars }).map((_, idx) => (
                      <Star key={idx} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 italic leading-relaxed">
                    "{review.text}"
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-border/40 text-xs">
                  <span className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    {review.user[0]}
                  </span>
                  <div>
                    <p className="font-semibold text-text">{review.user} <span className="text-[10px] text-green-500 font-bold bg-green-500/10 px-1.5 py-0.5 rounded-full ml-1">✓ Verified</span></p>
                    <p className="text-[10px] text-muted">{review.loc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* PRICING SECTION - REMOVED OVER-HIGHLIGHTING */}
      <section className="py-24 border-t border-border bg-surface/10">
        <Container>
          <SectionHeading
            eyebrow="Simple, affordable pricing"
            title="Plans built for everyday patients"
            description="All pricing cards have equal value. Select the plan tailored to your tracking requirements."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-glow relative"
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-bg shadow-glow">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="font-display text-xl font-bold text-text">{plan.name}</h3>
                  <p className="mt-2.5 text-xs text-muted">{plan.tagline}</p>
                  <p className="mt-5 text-4xl font-extrabold text-text">
                    {formatINR(plan.price)}
                    <span className="text-sm font-medium text-muted">/{plan.period}</span>
                  </p>
                  <p className="mt-2 text-xs font-semibold text-primary">{plan.predictionsLimit}</p>

                  <ul className="mt-6 space-y-3.5 border-t border-border/40 pt-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-xs text-muted">
                        <Check size={14} className="mt-0.5 shrink-0 text-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  href="/register"
                  variant={plan.highlighted ? "primary" : "outline"}
                  className="mt-8 w-full py-2.5 text-xs font-bold"
                >
                  Choose {plan.name}
                </Button>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-border py-28 bg-gradient-to-b from-surface/20 to-bg text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-radial opacity-30 pointer-events-none" />
        <Container className="relative z-10 max-w-2xl space-y-6">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white md:text-5xl leading-tight">
            Your Health, <br className="sm:hidden" /> Decoded by Clinical AI.
          </h2>
          <p className="text-muted text-base max-w-lg mx-auto leading-relaxed">
            Join thousands using Nidaan+ to identify risks early, organize lab reports, and manage wellness targets.
          </p>
          <div className="mt-10 flex justify-center">
            <Button href="/register" className="px-8 py-4 shadow-glow hover:-translate-y-[3px] transition-all duration-200">
              Create Free Account
            </Button>
          </div>
        </Container>
      </section>
    </PublicLayout>
  );
}
