export interface DiseaseMeta {
  slug: string;
  name: string;
  emoji: string;
  category: string;
  tagline: string;
}

export const DISEASES: DiseaseMeta[] = [
  { slug: "heart", name: "Heart Disease", emoji: "❤️", category: "Cardiovascular", tagline: "Coronary risk from vitals & lipid profile" },
  { slug: "diabetes", name: "Diabetes", emoji: "🩸", category: "Metabolic", tagline: "Type-2 risk from glucose & metabolic markers" },
  { slug: "stroke", name: "Stroke Risk", emoji: "🧠", category: "Neurological", tagline: "Cerebrovascular event probability" },
  { slug: "hypertension", name: "Hypertension", emoji: "💓", category: "Cardiovascular", tagline: "Blood pressure & lifestyle risk scoring" },
  { slug: "kidney", name: "Chronic Kidney Disease", emoji: "🩺", category: "Renal", tagline: "eGFR & renal function assessment" },
  { slug: "liver", name: "Liver Disease", emoji: "🧬", category: "Hepatic", tagline: "Hepatic enzyme & bilirubin analysis" },
  { slug: "fatty_liver", name: "Fatty Liver Disease", emoji: "🫀", category: "Hepatic", tagline: "NAFLD risk from metabolic profile" },
  { slug: "breast_cancer", name: "Breast Cancer", emoji: "🎗️", category: "Oncology", tagline: "Tumor characteristic malignancy screening" },
  { slug: "lung_cancer", name: "Lung Cancer Risk", emoji: "🫁", category: "Oncology", tagline: "Pulmonary risk from history & symptoms" },
  { slug: "cervical_cancer", name: "Cervical Cancer", emoji: "🎀", category: "Oncology", tagline: "HPV & screening history risk model" },
  { slug: "prostate_cancer", name: "Prostate Cancer", emoji: "👨", category: "Oncology", tagline: "PSA & urinary symptom risk profile" },
  { slug: "thyroid", name: "Thyroid Disease", emoji: "🦋", category: "Endocrine", tagline: "Hormonal panel based thyroid screening" },
  { slug: "parkinsons", name: "Parkinson's Disease", emoji: "🧠", category: "Neurological", tagline: "Motor & voice biomarker analysis" },
  { slug: "alzheimers", name: "Alzheimer's Risk", emoji: "🧠", category: "Neurological", tagline: "Cognitive & lifestyle risk assessment" },
  { slug: "anemia", name: "Anemia Detection", emoji: "🩸", category: "Hematology", tagline: "CBC based anemia classification" },
  { slug: "obesity", name: "Obesity Risk", emoji: "⚖️", category: "Metabolic", tagline: "Body composition & lifestyle scoring" },
];

export const getDisease = (slug: string) => DISEASES.find((d) => d.slug === slug);
