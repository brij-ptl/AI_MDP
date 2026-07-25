import Container from "@/components/ui/Container";
export default function TermsPage() {
  return (
    <Container className="py-20">
      <h1 className="font-display text-3xl font-bold">Terms of Service</h1>
      <div className="mt-8 max-w-3xl space-y-4 text-sm text-muted">
        <p>Vitalis AI is a screening tool and does not provide medical diagnosis. Always consult a licensed physician for clinical decisions.</p>
        <p>By using this platform you agree to our fair-use policy on free-trial predictions and subscription billing terms.</p>
      </div>
    </Container>
  );
}
