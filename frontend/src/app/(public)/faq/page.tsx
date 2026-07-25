import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const FAQS = [
  ["Is Vitalis AI a replacement for a doctor?", "No. It's a screening and early-risk tool. Always confirm results with a licensed physician."],
  ["How many free predictions do I get?", "Every new account gets 2 free predictions across any disease module before a subscription is required."],
  ["What happens to my medical data?", "Your data is encrypted and used only to generate your prediction and report — never sold to third parties."],
  ["Can I cancel my subscription anytime?", "Yes, subscriptions can be cancelled anytime from Settings → Subscription."],
];

export default function FAQPage() {
  return (
    <Container className="py-20">
      <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
      <div className="mx-auto mt-12 max-w-2xl space-y-4">
        {FAQS.map(([q, a]) => (
          <details key={q} className="rounded-xl border border-border bg-surface p-5 open:border-primary/50">
            <summary className="cursor-pointer font-medium text-text">{q}</summary>
            <p className="mt-3 text-sm text-muted">{a}</p>
          </details>
        ))}
      </div>
    </Container>
  );
}
