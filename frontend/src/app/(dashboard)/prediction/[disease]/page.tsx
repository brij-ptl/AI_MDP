import { notFound } from "next/navigation";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import DiseaseForm from "@/components/prediction/DiseaseForm";
import { getDisease } from "@/constants/diseases";
import { DISEASE_QUESTIONS } from "@/constants/diseaseQuestions";

export default async function PredictionFormPage({ params }: { params: Promise<{ disease: string }> }) {
  const { disease: diseaseSlug } = await params;
  const disease = getDisease(diseaseSlug);
  if (!disease) return notFound();
  const fields = DISEASE_QUESTIONS[disease.slug] ?? [];

  return (
    <>
      <DashboardTopbar title={`${disease.emoji} ${disease.name}`} />
      <div className="p-6 lg:p-10">
        <div className="mx-auto max-w-3xl">
          <p className="mb-6 text-sm text-muted">{disease.tagline}</p>
          <DiseaseForm disease={disease} fields={fields} />
        </div>
      </div>
    </>
  );
}
