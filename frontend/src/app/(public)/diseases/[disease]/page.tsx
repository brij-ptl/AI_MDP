import { notFound } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { getDisease, DISEASES } from "@/constants/diseases";
import { DISEASE_QUESTIONS } from "@/constants/diseaseQuestions";

export function generateStaticParams() {
  return DISEASES.map((d) => ({ disease: d.slug }));
}

export default async function DiseaseDetailPage({ params }: { params: Promise<{ disease: string }> }) {
  const { disease: diseaseSlug } = await params;
  const disease = getDisease(diseaseSlug);
  if (!disease) return notFound();
  const fields = DISEASE_QUESTIONS[disease.slug] ?? [];

  return (
    <Container className="py-20">
      <div className="text-5xl">{disease.emoji}</div>
      <h1 className="mt-4 font-display text-3xl font-bold">{disease.name}</h1>
      <p className="mt-2 text-primary">{disease.category}</p>
      <p className="mt-4 max-w-2xl text-muted">{disease.tagline}</p>

      <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
        <h3 className="font-semibold text-text">What we'll ask you</h3>
        <p className="mt-1 text-sm text-muted">
          Modeled on a physician's clinical intake for this condition ({fields.length} data points).
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {fields.map((f) => (
            <li key={f.id} className="text-sm text-muted">• {f.label}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex gap-4">
        <Button href={`/prediction/${disease.slug}`}>Start Free Prediction</Button>
        <Button href="/diseases" variant="outline">Back to all modules</Button>
      </div>
    </Container>
  );
}
