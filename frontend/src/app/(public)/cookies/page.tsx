import Container from "@/components/ui/Container";
export default function CookiePolicyPage() {
  return (
    <Container className="py-20">
      <h1 className="font-display text-3xl font-bold">Cookie Policy</h1>
      <div className="mt-8 max-w-3xl space-y-4 text-sm text-muted">
        <p>We use a session cookie to keep you signed in, and an anonymous visitor-id cookie to track free-trial prediction usage per device.</p>
        <p>You can decline non-essential cookies from the banner shown on your first visit — essential session cookies remain required to use the platform.</p>
      </div>
    </Container>
  );
}
