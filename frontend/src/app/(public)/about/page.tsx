import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export default function AboutPage() {
  return (
    <Container className="py-20">
      <SectionHeading eyebrow="About us" title="Built by clinicians and AI engineers" />
      <div className="mx-auto mt-12 max-w-3xl space-y-6 text-muted">
        <p>
          Nidaan+ was founded to close the gap between symptom onset and diagnosis. Our multi-disease
          prediction engine combines clinically validated risk factors with modern machine learning to give
          patients an early, explainable signal — long before a scheduled specialist visit.
        </p>
        <p>
          Every intake form on this platform is structured the way an experienced physician would take a
          history: starting broad, then narrowing to the specific markers that matter most for that condition.
        </p>
        <p>
          We are not a replacement for professional medical care. Nidaan+ is a screening and triage layer —
          always confirm results with a licensed physician.
        </p>
      </div>
    </Container>
  );
}
