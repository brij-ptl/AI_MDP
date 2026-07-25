import Container from "@/components/ui/Container";
export default function PrivacyPolicyPage() {
  return (
    <Container className="py-20">
      <h1 className="font-display text-3xl font-bold">Privacy Policy</h1>
      <div className="mt-8 max-w-3xl space-y-4 text-sm text-muted">
        <p>We collect the health data you submit solely to generate predictions and reports. Data is encrypted in transit and at rest, and never sold to third parties.</p>
        <p>You may request deletion of your data at any time from Settings → Privacy.</p>
      </div>
    </Container>
  );
}
