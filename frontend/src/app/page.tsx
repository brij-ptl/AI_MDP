import Link from "next/link";
import PublicLayout from "./(public)/layout";
import { DISEASES } from "@/constants/diseases";
import { PLANS } from "@/constants/plans";
import ScrollReveal from "@/components/common/ScrollReveal";

export default function HomePage() {
  return (
    <PublicLayout>
      
<ScrollReveal className="hero">
  <svg className="hero-pulse" viewBox="0 0 1200 280" preserveAspectRatio="none">
    <polyline className="hero-pulse-line" points="0,140 220,140 250,60 285,220 320,140 1200,140" fill="none" strokeWidth="1.5" opacity="0.35"/>
  </svg>
  <div className="wrap">
    <span className="pill"><span className="dot"></span> AI Precision Healthcare Platform</span>
    <h1 className="hero-title">Predict Disease Before<br/><em>Symptoms Become Serious.</em></h1>
    <p className="lede">AI-powered clinical screening that helps identify health risks early using explainable machine learning models trained on trusted medical datasets.</p>
    <div className="hero-ctas">
      <Link href="/register" className="btn btn-primary">Start Free Screening →</Link>
      <Link href="#modules" className="btn btn-outline">Explore Disease Modules</Link>
    </div>
    <div className="hero-check">
      <div><span>✓</span>Privacy First</div>
      <div><span>✓</span>Explainable AI</div>
      <div><span>✓</span>16 Disease Models</div>
      <div><span>✓</span>Secure Cloud</div>
    </div>
  </div>
</ScrollReveal>

<ScrollReveal className="why">
  <div className="wrap">
    <div className="section-head">
      <span className="eyebrow" style={{justifyContent:'center'}}>Clinical Excellence</span>
      <h2>Why Trust Nidaan+</h2>
      <p>Designed to offer rigorous, evidence-based preliminary triage based on proven datasets.</p>
    </div>
    <div className="why-grid">
      <div className="why-item"><div className="num">01 · UserCheck</div><h3>Clinical Accuracy</h3><p>Models aligned with guidelines from institutions like WHO, CDC, and the Mayo Clinic.</p></div>
      <div className="why-item"><div className="num">02 · Brain</div><h3>Explainable AI</h3><p>Get model transparency report showcasing feature importance with SHAP &amp; LIME values.</p></div>
      <div className="why-item"><div className="num">03 · ShieldCheck</div><h3>Privacy First</h3><p>End-to-end data encryption. Your personal health metrics are never shared or sold.</p></div>
      <div className="why-item"><div className="num">04 · Server</div><h3>Secure Cloud</h3><p>HIPAA-ready cloud database infrastructure with granular user-controlled data rights.</p></div>
      <div className="why-item"><div className="num">05 · Database</div><h3>Medical Dataset</h3><p>Trained and verified on anonymized, high-fidelity medical research cohorts.</p></div>
      <div className="why-item"><div className="num">06 · Zap</div><h3>Fast Results</h3><p>Structured intake forms deliver a comprehensive health action report in under 5 minutes.</p></div>
    </div>
  </div>
</ScrollReveal>

<ScrollReveal className="stats">
  <div className="wrap stats-row">
    <div className="stat"><div className="val">120K+</div><div className="lbl">Predictions Generated</div></div>
    <div className="stat"><div className="val">16</div><div className="lbl">Disease Models</div></div>
    <div className="stat"><div className="val">98%</div><div className="lbl">User Satisfaction</div></div>
    <div className="stat"><div className="val">24/7</div><div className="lbl">AI Availability</div></div>
  </div>
</ScrollReveal>

<ScrollReveal className="modules" id="modules">
  <div className="wrap">
    <div className="section-head">
      <span className="eyebrow" style={{justifyContent:'center'}}>Clinical Modules</span>
      <h2>16 conditions. One intelligent platform.</h2>
      <p>Explore our specialized prediction modules. Each leverages diagnostic criteria and lifestyle metrics.</p>
    </div>
    <div className="module-grid">
      {DISEASES.map((d) => (
        <Link href={`/prediction/${d.slug}`} key={d.slug} className="module-card">
          <div>
            <div className="module-top">
              <span className="module-emoji">{d.emoji}</span>
              <span className="module-idx">{d.category.substring(0,3).toUpperCase()}</span>
            </div>
            <h4>{d.name}</h4>
            <span className="module-cat">{d.category}</span>
            <p className="tagline">{d.tagline}</p>
          </div>
          <div className="module-foot">
            <span>⏱ ~3 mins <span className="acc">✓ ~96% Acc.</span></span>
            <span className="arrow">→</span>
          </div>
        </Link>
      ))}
    </div>
  </div>
</ScrollReveal>

<ScrollReveal className="how">
  <div className="wrap">
    <div className="section-head">
      <span className="eyebrow" style={{justifyContent:'center'}}>Triage Pipeline</span>
      <h2>How Nidaan+ Works</h2>
      <p>Our step-by-step interactive framework allows you to gain instant clinical insight safely.</p>
    </div>
    <div className="how-track">
      <div className="how-step"><div className="how-num">01</div><h3>Create Account</h3><p>Start with 2 free credentials. Secured via session privacy safeguards.</p></div>
      <div className="how-step"><div className="how-num">02</div><h3>Enter Symptoms</h3><p>Guided questions collect lifestyle history and current physiological indicators.</p></div>
      <div className="how-step"><div className="how-num">03</div><h3>AI Analysis</h3><p>Machine learning models match inputs against thousands of clinical metrics.</p></div>
      <div className="how-step"><div className="how-num">04</div><h3>Get Report</h3><p>Receive action plan, specialist referrals, and a detailed SHAP feature report.</p></div>
    </div>
  </div>
</ScrollReveal>

<ScrollReveal className="compare">
  <div className="wrap">
    <div className="section-head">
      <span className="eyebrow" style={{justifyContent:'center'}}>Comparison</span>
      <h2>Traditional Search vs Nidaan+</h2>
      <p>How Nidaan+ resolves the information problem of diagnostic self-evaluation.</p>
    </div>
    <div className="compare-grid">
      <div className="compare-col bad">
        <div className="compare-head"><span className="tag">Search</span><h3>Traditional Web Search</h3></div>
        <ul>
          <li><span className="mk">×</span>Prompts generalized panic with unweighted condition matches.</li>
          <li><span className="mk">×</span>Does not evaluate combined clinical markers dynamically.</li>
          <li><span className="mk">×</span>Unfiltered, heavily ad-supported medical content.</li>
          <li><span className="mk">×</span>No personalized action guide or specialist directions.</li>
        </ul>
      </div>
      <div className="compare-col good">
        <div className="compare-head"><span className="tag">Triage</span><h3>Nidaan+ Triage</h3></div>
        <ul>
          <li><span className="mk">✓</span>Calibrated confidence indexes mapping to precise risk brackets.</li>
          <li><span className="mk">✓</span>Clinically informed intake forms mimicking a doctor's history.</li>
          <li><span className="mk">✓</span>Explainable AI reports clarifying the specific causes of risk.</li>
          <li><span className="mk">✓</span>Tailored physician specialist routing and physical intake checklists.</li>
        </ul>
      </div>
    </div>
  </div>
</ScrollReveal>

<ScrollReveal className="xai">
  <div className="wrap xai-grid">
    <div>
      <span className="eyebrow">Algorithm Clarity</span>
      <h2>Understand the "Why" with Explainable AI (XAI)</h2>
      <p>We reject black-box diagnostics. Every health risk report produced by Nidaan+ includes a feature relevance output showing exactly which metrics most heavily influenced the confidence metrics.</p>
      <div className="xai-check">
        <div className="xai-check-item"><span className="ck">✓</span><div><h4>Confidence Score</h4><p>Granular likelihood distributions based on thousands of control patients.</p></div></div>
        <div className="xai-check-item"><span className="ck">✓</span><div><h4>Model Transparency</h4><p>SHAP and LIME visualizations indicate specific lifestyle or diagnostic metrics.</p></div></div>
        <div className="xai-check-item"><span className="ck">✓</span><div><h4>Medical References</h4><p>Hyperlinked reference material mapping models directly to peer-reviewed journals.</p></div></div>
        <div className="xai-check-item"><span className="ck">✓</span><div><h4>Clinical Validation</h4><p>Backtested algorithms under physician-guided performance audits.</p></div></div>
      </div>
    </div>
    <div className="readout">
      <div className="readout-title">SHAP Insight Simulation</div>
      <div className="readout-row"><div className="rr-top"><span className="rr-label">Systolic Blood Pressure &gt;140</span><span className="rr-val up">+18.4%</span></div><div className="readout-bar"><span className="up" style={{width:'55%'}}></span></div></div>
      <div className="readout-row"><div className="rr-top"><span className="rr-label">Serum Cholesterol (220 mg/dL)</span><span className="rr-val up">+12.1%</span></div><div className="readout-bar"><span className="up" style={{width:'36%'}}></span></div></div>
      <div className="readout-row"><div className="rr-top"><span className="rr-label">Cardio Exercise (5 hr/wk)</span><span className="rr-val down">−8.5%</span></div><div className="readout-bar"><span className="down" style={{width:'26%'}}></span></div></div>
      <div className="readout-row"><div className="rr-top"><span className="rr-label">Age Factor (54 yrs)</span><span className="rr-val up">+4.2%</span></div><div className="readout-bar"><span className="up" style={{width:'13%'}}></span></div></div>
      <div className="readout-row"><div className="rr-top"><span className="rr-label">Zero Smoking Habit</span><span className="rr-val down">−14.3%</span></div><div className="readout-bar"><span className="down" style={{width:'43%'}}></span></div></div>
      <div className="readout-note">ⓘ Real-time models map personal clinical factors against normalized baseline cohorts.</div>
    </div>
  </div>
</ScrollReveal>

<ScrollReveal className="security">
  <div className="wrap">
    <span className="eyebrow" style={{justifyContent:'center'}}>Enterprise Security</span>
    <h2>Strict Clinical Security. Guaranteed.</h2>
    <p className="desc">Your medical metrics are extremely sensitive. We secure all inputs and analytical predictions using bank-grade protection mechanisms.</p>
    <div className="sec-grid">
      <div className="sec-item"><h3><span className="ic">⚿</span> Encrypted Storage</h3><p>All active database payloads undergo end-to-end AES-256 and SSL/TLS transmission encryption.</p></div>
      <div className="sec-item"><h3><span className="ic">⛨</span> HIPAA Aligned</h3><p>System architecture strictly complies with standard HIPAA physical, network, and policy rules.</p></div>
      <div className="sec-item"><h3><span className="ic">▤</span> FHIR Standard</h3><p>All generated logs and analytical files strictly support interoperable FHIR format specs.</p></div>
    </div>
  </div>
</ScrollReveal>

<ScrollReveal className="reviews">
  <div className="wrap">
    <div className="section-head">
      <span className="eyebrow" style={{justifyContent:'center'}}>Testimonials</span>
      <h2>Premium Patient Feedback</h2>
      <p>Hear from some of our verified health consumers who caught metrics ahead of schedules.</p>
    </div>
    <div className="review-grid">
      <div className="review-card"><div><div className="q">&ldquo;</div><p className="text">Nidaan+ helped identify my diabetes risk early. The report was clear enough to discuss with my doctor.</p></div><div className="review-foot"><div><div className="who">Aditya V.<span className="verified">Verified</span></div><div className="loc">Mumbai</div></div><div className="rating">5.0</div></div></div>
      <div className="review-card"><div><div className="q">&ldquo;</div><p className="text">The explainable AI breakdown showing factor importance helped me realize my salt intake was directly spiking metrics.</p></div><div className="review-foot"><div><div className="who">Raman K.<span className="verified">Verified</span></div><div className="loc">Delhi</div></div><div className="rating">5.0</div></div></div>
      <div className="review-card"><div><div className="q">&ldquo;</div><p className="text">Unbelievably simple OCR report scan. It filled out the complex kidney marker form automatically in seconds.</p></div><div className="review-foot"><div><div className="who">Priya S.<span className="verified">Verified</span></div><div className="loc">Bangalore</div></div><div className="rating">5.0</div></div></div>
      <div className="review-card"><div><div className="q">&ldquo;</div><p className="text">A necessary preliminary check before scheduling a specialist. It helped calm my anxiety with actual data.</p></div><div className="review-foot"><div><div className="who">Sunita G.<span className="verified">Verified</span></div><div className="loc">Chennai</div></div><div className="rating">5.0</div></div></div>
      <div className="review-card"><div><div className="q">&ldquo;</div><p className="text">Clean, Stripe-level experience. No ads or spam, just high-fidelity clinical model reporting.</p></div><div className="review-foot"><div><div className="who">Vikram R.<span className="verified">Verified</span></div><div className="loc">Pune</div></div><div className="rating">5.0</div></div></div>
      <div className="review-card"><div><div className="q">&ldquo;</div><p className="text">The premium subscription was worth every rupee for my parents. We monitor their cardiovascular health monthly.</p></div><div className="review-foot"><div><div className="who">Dr. Anil B.<span className="verified">Verified</span></div><div className="loc">Hyderabad</div></div><div className="rating">5.0</div></div></div>
    </div>
  </div>
</ScrollReveal>

<ScrollReveal className="pricing" id="pricing">
  <div className="wrap">
    <div className="section-head">
      <span className="eyebrow" style={{justifyContent:'center'}}>Simple, affordable pricing</span>
      <h2>Plans built for everyday patients</h2>
      <p>All pricing cards have equal value. Select the plan tailored to your tracking requirements.</p>
    </div>
    <div className="price-grid">
      {PLANS.map((plan) => (
        <div key={plan.id} className={plan.highlighted ? "price-card pop" : "price-card"}>
          {plan.highlighted && <div className="price-tag">Most Popular</div>}
          <div>
            <h3>{plan.name}</h3>
            <p className="tag-line">{plan.tagline}</p>
            <p className="amount">₹{plan.price}<span className="per">/{plan.period}</span></p>
            <p className="limit">{plan.predictionsLimit}</p>
            <ul>
              {plan.features.map(f => (
                <li key={f}><span className="mk">✓</span>{f}</li>
              ))}
            </ul>
          </div>
          <Link href="/register" className={plan.highlighted ? "btn btn-primary" : "btn btn-outline"}>Choose {plan.name}</Link>
        </div>
      ))}
    </div>
  </div>
</ScrollReveal>

<ScrollReveal className="final-cta">
  <div className="wrap">
    <h2>Your Health,<br/>Decoded by Clinical AI.</h2>
    <p>Join thousands using Nidaan+ to identify risks early, organize lab reports, and manage wellness targets.</p>
    <Link href="/register" className="btn btn-primary">Create Free Account</Link>
  </div>
</ScrollReveal>

    </PublicLayout>
  );
}
