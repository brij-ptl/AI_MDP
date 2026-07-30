import re

html_content = '''
<section class="hero">
  <svg class="hero-pulse" viewBox="0 0 1200 280" preserveAspectRatio="none">
    <polyline class="hero-pulse-line" points="0,140 220,140 250,60 285,220 320,140 1200,140" fill="none" strokeWidth="1.5" opacity="0.35"/>
  </svg>
  <div class="wrap">
    <span class="pill"><span class="dot"></span> AI Precision Healthcare Platform</span>
    <h1 class="hero-title">Predict Disease Before<br/><em>Symptoms Become Serious.</em></h1>
    <p class="lede">AI-powered clinical screening that helps identify health risks early using explainable machine learning models trained on trusted medical datasets.</p>
    <div class="hero-ctas">
      <Link href="/register" class="btn btn-primary">Start Free Screening →</Link>
      <Link href="#modules" class="btn btn-outline">Explore Disease Modules</Link>
    </div>
    <div class="hero-check">
      <div><span>✓</span>Privacy First</div>
      <div><span>✓</span>Explainable AI</div>
      <div><span>✓</span>16 Disease Models</div>
      <div><span>✓</span>Secure Cloud</div>
    </div>
  </div>
</section>

<section class="why">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow" style={{justifyContent:'center'}}>Clinical Excellence</span>
      <h2>Why Trust Nidaan+</h2>
      <p>Designed to offer rigorous, evidence-based preliminary triage based on proven datasets.</p>
    </div>
    <div class="why-grid">
      <div class="why-item"><div class="num">01 · UserCheck</div><h3>Clinical Accuracy</h3><p>Models aligned with guidelines from institutions like WHO, CDC, and the Mayo Clinic.</p></div>
      <div class="why-item"><div class="num">02 · Brain</div><h3>Explainable AI</h3><p>Get model transparency report showcasing feature importance with SHAP &amp; LIME values.</p></div>
      <div class="why-item"><div class="num">03 · ShieldCheck</div><h3>Privacy First</h3><p>End-to-end data encryption. Your personal health metrics are never shared or sold.</p></div>
      <div class="why-item"><div class="num">04 · Server</div><h3>Secure Cloud</h3><p>HIPAA-ready cloud database infrastructure with granular user-controlled data rights.</p></div>
      <div class="why-item"><div class="num">05 · Database</div><h3>Medical Dataset</h3><p>Trained and verified on anonymized, high-fidelity medical research cohorts.</p></div>
      <div class="why-item"><div class="num">06 · Zap</div><h3>Fast Results</h3><p>Structured intake forms deliver a comprehensive health action report in under 5 minutes.</p></div>
    </div>
  </div>
</section>

<section class="stats">
  <div class="wrap stats-row">
    <div class="stat"><div class="val">120K+</div><div class="lbl">Predictions Generated</div></div>
    <div class="stat"><div class="val">16</div><div class="lbl">Disease Models</div></div>
    <div class="stat"><div class="val">98%</div><div class="lbl">User Satisfaction</div></div>
    <div class="stat"><div class="val">24/7</div><div class="lbl">AI Availability</div></div>
  </div>
</section>

<section class="modules" id="modules">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow" style={{justifyContent:'center'}}>Clinical Modules</span>
      <h2>16 conditions. One intelligent platform.</h2>
      <p>Explore our specialized prediction modules. Each leverages diagnostic criteria and lifestyle metrics.</p>
    </div>
    <div class="module-grid">
      {DISEASES.map((d) => (
        <Link href={`/prediction/${d.slug}`} key={d.slug} class="module-card">
          <div>
            <div class="module-top">
              <span class="module-emoji">{d.emoji}</span>
              <span class="module-idx">{d.category.substring(0,3).toUpperCase()}</span>
            </div>
            <h4>{d.name}</h4>
            <span class="module-cat">{d.category}</span>
            <p class="tagline">{d.tagline}</p>
          </div>
          <div class="module-foot">
            <span>⏱ ~3 mins <span class="acc">✓ ~96% Acc.</span></span>
            <span class="arrow">→</span>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>

<section class="how">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow" style={{justifyContent:'center'}}>Triage Pipeline</span>
      <h2>How Nidaan+ Works</h2>
      <p>Our step-by-step interactive framework allows you to gain instant clinical insight safely.</p>
    </div>
    <div class="how-track">
      <div class="how-step"><div class="how-num">01</div><h3>Create Account</h3><p>Start with 2 free credentials. Secured via session privacy safeguards.</p></div>
      <div class="how-step"><div class="how-num">02</div><h3>Enter Symptoms</h3><p>Guided questions collect lifestyle history and current physiological indicators.</p></div>
      <div class="how-step"><div class="how-num">03</div><h3>AI Analysis</h3><p>Machine learning models match inputs against thousands of clinical metrics.</p></div>
      <div class="how-step"><div class="how-num">04</div><h3>Get Report</h3><p>Receive action plan, specialist referrals, and a detailed SHAP feature report.</p></div>
    </div>
  </div>
</section>

<section class="compare">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow" style={{justifyContent:'center'}}>Comparison</span>
      <h2>Traditional Search vs Nidaan+</h2>
      <p>How Nidaan+ resolves the information problem of diagnostic self-evaluation.</p>
    </div>
    <div class="compare-grid">
      <div class="compare-col bad">
        <div class="compare-head"><span class="tag">Search</span><h3>Traditional Web Search</h3></div>
        <ul>
          <li><span class="mk">×</span>Prompts generalized panic with unweighted condition matches.</li>
          <li><span class="mk">×</span>Does not evaluate combined clinical markers dynamically.</li>
          <li><span class="mk">×</span>Unfiltered, heavily ad-supported medical content.</li>
          <li><span class="mk">×</span>No personalized action guide or specialist directions.</li>
        </ul>
      </div>
      <div class="compare-col good">
        <div class="compare-head"><span class="tag">Triage</span><h3>Nidaan+ Triage</h3></div>
        <ul>
          <li><span class="mk">✓</span>Calibrated confidence indexes mapping to precise risk brackets.</li>
          <li><span class="mk">✓</span>Clinically informed intake forms mimicking a doctor's history.</li>
          <li><span class="mk">✓</span>Explainable AI reports clarifying the specific causes of risk.</li>
          <li><span class="mk">✓</span>Tailored physician specialist routing and physical intake checklists.</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="xai">
  <div class="wrap xai-grid">
    <div>
      <span class="eyebrow">Algorithm Clarity</span>
      <h2>Understand the "Why" with Explainable AI (XAI)</h2>
      <p>We reject black-box diagnostics. Every health risk report produced by Nidaan+ includes a feature relevance output showing exactly which metrics most heavily influenced the confidence metrics.</p>
      <div class="xai-check">
        <div class="xai-check-item"><span class="ck">✓</span><div><h4>Confidence Score</h4><p>Granular likelihood distributions based on thousands of control patients.</p></div></div>
        <div class="xai-check-item"><span class="ck">✓</span><div><h4>Model Transparency</h4><p>SHAP and LIME visualizations indicate specific lifestyle or diagnostic metrics.</p></div></div>
        <div class="xai-check-item"><span class="ck">✓</span><div><h4>Medical References</h4><p>Hyperlinked reference material mapping models directly to peer-reviewed journals.</p></div></div>
        <div class="xai-check-item"><span class="ck">✓</span><div><h4>Clinical Validation</h4><p>Backtested algorithms under physician-guided performance audits.</p></div></div>
      </div>
    </div>
    <div class="readout">
      <div class="readout-title">SHAP Insight Simulation</div>
      <div class="readout-row"><div class="rr-top"><span class="rr-label">Systolic Blood Pressure &gt;140</span><span class="rr-val up">+18.4%</span></div><div class="readout-bar"><span class="up" style={{width:'55%'}}></span></div></div>
      <div class="readout-row"><div class="rr-top"><span class="rr-label">Serum Cholesterol (220 mg/dL)</span><span class="rr-val up">+12.1%</span></div><div class="readout-bar"><span class="up" style={{width:'36%'}}></span></div></div>
      <div class="readout-row"><div class="rr-top"><span class="rr-label">Cardio Exercise (5 hr/wk)</span><span class="rr-val down">−8.5%</span></div><div class="readout-bar"><span class="down" style={{width:'26%'}}></span></div></div>
      <div class="readout-row"><div class="rr-top"><span class="rr-label">Age Factor (54 yrs)</span><span class="rr-val up">+4.2%</span></div><div class="readout-bar"><span class="up" style={{width:'13%'}}></span></div></div>
      <div class="readout-row"><div class="rr-top"><span class="rr-label">Zero Smoking Habit</span><span class="rr-val down">−14.3%</span></div><div class="readout-bar"><span class="down" style={{width:'43%'}}></span></div></div>
      <div class="readout-note">ⓘ Real-time models map personal clinical factors against normalized baseline cohorts.</div>
    </div>
  </div>
</section>

<section class="security">
  <div class="wrap">
    <span class="eyebrow" style={{justifyContent:'center'}}>Enterprise Security</span>
    <h2>Strict Clinical Security. Guaranteed.</h2>
    <p class="desc">Your medical metrics are extremely sensitive. We secure all inputs and analytical predictions using bank-grade protection mechanisms.</p>
    <div class="sec-grid">
      <div class="sec-item"><h3><span class="ic">⚿</span> Encrypted Storage</h3><p>All active database payloads undergo end-to-end AES-256 and SSL/TLS transmission encryption.</p></div>
      <div class="sec-item"><h3><span class="ic">⛨</span> HIPAA Aligned</h3><p>System architecture strictly complies with standard HIPAA physical, network, and policy rules.</p></div>
      <div class="sec-item"><h3><span class="ic">▤</span> FHIR Standard</h3><p>All generated logs and analytical files strictly support interoperable FHIR format specs.</p></div>
    </div>
  </div>
</section>

<section class="reviews">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow" style={{justifyContent:'center'}}>Testimonials</span>
      <h2>Premium Patient Feedback</h2>
      <p>Hear from some of our verified health consumers who caught metrics ahead of schedules.</p>
    </div>
    <div class="review-grid">
      <div class="review-card"><div><div class="q">&ldquo;</div><p class="text">Nidaan+ helped identify my diabetes risk early. The report was clear enough to discuss with my doctor.</p></div><div class="review-foot"><div><div class="who">Aditya V.<span class="verified">Verified</span></div><div class="loc">Mumbai</div></div><div class="rating">5.0</div></div></div>
      <div class="review-card"><div><div class="q">&ldquo;</div><p class="text">The explainable AI breakdown showing factor importance helped me realize my salt intake was directly spiking metrics.</p></div><div class="review-foot"><div><div class="who">Raman K.<span class="verified">Verified</span></div><div class="loc">Delhi</div></div><div class="rating">5.0</div></div></div>
      <div class="review-card"><div><div class="q">&ldquo;</div><p class="text">Unbelievably simple OCR report scan. It filled out the complex kidney marker form automatically in seconds.</p></div><div class="review-foot"><div><div class="who">Priya S.<span class="verified">Verified</span></div><div class="loc">Bangalore</div></div><div class="rating">5.0</div></div></div>
      <div class="review-card"><div><div class="q">&ldquo;</div><p class="text">A necessary preliminary check before scheduling a specialist. It helped calm my anxiety with actual data.</p></div><div class="review-foot"><div><div class="who">Sunita G.<span class="verified">Verified</span></div><div class="loc">Chennai</div></div><div class="rating">5.0</div></div></div>
      <div class="review-card"><div><div class="q">&ldquo;</div><p class="text">Clean, Stripe-level experience. No ads or spam, just high-fidelity clinical model reporting.</p></div><div class="review-foot"><div><div class="who">Vikram R.<span class="verified">Verified</span></div><div class="loc">Pune</div></div><div class="rating">5.0</div></div></div>
      <div class="review-card"><div><div class="q">&ldquo;</div><p class="text">The premium subscription was worth every rupee for my parents. We monitor their cardiovascular health monthly.</p></div><div class="review-foot"><div><div class="who">Dr. Anil B.<span class="verified">Verified</span></div><div class="loc">Hyderabad</div></div><div class="rating">5.0</div></div></div>
    </div>
  </div>
</section>

<section class="pricing" id="pricing">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow" style={{justifyContent:'center'}}>Simple, affordable pricing</span>
      <h2>Plans built for everyday patients</h2>
      <p>All pricing cards have equal value. Select the plan tailored to your tracking requirements.</p>
    </div>
    <div class="price-grid">
      {PLANS.map((plan) => (
        <div key={plan.id} class={plan.highlighted ? "price-card pop" : "price-card"}>
          {plan.highlighted && <div class="price-tag">Most Popular</div>}
          <div>
            <h3>{plan.name}</h3>
            <p class="tag-line">{plan.tagline}</p>
            <p class="amount">₹{plan.price}<span class="per">/{plan.period}</span></p>
            <p class="limit">{plan.predictionsLimit}</p>
            <ul>
              {plan.features.map(f => (
                <li key={f}><span class="mk">✓</span>{f}</li>
              ))}
            </ul>
          </div>
          <Link href="/register" class={plan.highlighted ? "btn btn-primary" : "btn btn-outline"}>Choose {plan.name}</Link>
        </div>
      ))}
    </div>
  </div>
</section>

<section class="final-cta">
  <div class="wrap">
    <h2>Your Health,<br/>Decoded by Clinical AI.</h2>
    <p>Join thousands using Nidaan+ to identify risks early, organize lab reports, and manage wellness targets.</p>
    <Link href="/register" class="btn btn-primary">Create Free Account</Link>
  </div>
</section>
'''

jsx = html_content.replace('class="', 'className="')

full_page = f'''import Link from "next/link";
import PublicLayout from "./(public)/layout";
import {{ DISEASES }} from "@/constants/diseases";
import {{ PLANS }} from "@/constants/plans";

export default function HomePage() {{
  return (
    <PublicLayout>
      {jsx}
    </PublicLayout>
  );
}}
'''

with open('frontend/src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(full_page)
