import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  return (
    <Container className="py-20">
      <SectionHeading eyebrow="Contact" title="We're here to help" />
      <form className="mx-auto mt-12 max-w-lg space-y-5">
        <input className="w-full rounded-xl border border-border bg-surface px-4 py-3 outline-none focus:border-primary" placeholder="Full name" />
        <input className="w-full rounded-xl border border-border bg-surface px-4 py-3 outline-none focus:border-primary" placeholder="Email address" type="email" />
        <textarea className="w-full rounded-xl border border-border bg-surface px-4 py-3 outline-none focus:border-primary" rows={5} placeholder="How can we help?" />
        <Button className="w-full">Send Message</Button>
      </form>
    </Container>
  );
}
