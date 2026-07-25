import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const POSTS = [
  { slug: "early-signs-of-heart-disease", title: "5 Early Signs of Heart Disease Doctors Look For", excerpt: "Understanding subtle cardiovascular warning signs before symptoms escalate." },
  { slug: "understanding-your-lipid-profile", title: "Understanding Your Lipid Profile", excerpt: "What HDL, LDL and triglycerides actually tell your doctor." },
  { slug: "ai-in-preventive-care", title: "How AI Is Reshaping Preventive Care", excerpt: "A look at how predictive models are catching disease earlier." },
];

export default function BlogPage() {
  return (
    <Container className="py-20">
      <SectionHeading eyebrow="Blog" title="Health insights, explained simply" />
      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        {POSTS.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="rounded-2xl border border-border bg-surface p-6 hover:border-primary/50">
            <h3 className="font-semibold text-text">{p.title}</h3>
            <p className="mt-2 text-sm text-muted">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
