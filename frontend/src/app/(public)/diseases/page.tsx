import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { DISEASES } from "@/constants/diseases";

export default function DiseasesPage() {
  return (
    <Container className="py-20">
      <SectionHeading eyebrow="Disease modules" title="Every module a specialist could ask for" />
      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DISEASES.map((d) => (
          <Link key={d.slug} href={`/diseases/${d.slug}`} className="rounded-2xl border border-border bg-surface p-6 hover:border-primary/50 hover:shadow-glow">
            <div className="text-3xl">{d.emoji}</div>
            <h3 className="mt-3 font-semibold text-text">{d.name}</h3>
            <p className="mt-1 text-xs uppercase tracking-wide text-primary">{d.category}</p>
            <p className="mt-2 text-sm text-muted">{d.tagline}</p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
