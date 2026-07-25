/**
 * Clinical intake question sets — modeled on the history & examination
 * questions a 30-year experienced physician would ask before ordering
 * a risk assessment for each condition. Used to render the dynamic
 * prediction form for every disease module.
 */

export type FieldType = "number" | "select" | "radio" | "boolean";

export interface ClinicalField {
  id: string;
  label: string;
  type: FieldType;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: string | number }[];
  helper?: string;
}

export const DISEASE_QUESTIONS: Record<string, ClinicalField[]> = {
  heart: [
    { id: "age", label: "Age", type: "number", unit: "years", min: 1, max: 120 },
    { id: "sex", label: "Biological sex", type: "radio", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }] },
    { id: "chest_pain", label: "Type of chest pain", type: "select", options: [
      { label: "Typical angina", value: "typical" }, { label: "Atypical angina", value: "atypical" },
      { label: "Non-anginal pain", value: "non_anginal" }, { label: "No chest pain", value: "none" }] },
    { id: "resting_bp", label: "Resting blood pressure", type: "number", unit: "mmHg", min: 70, max: 250, helper: "Systolic reading at rest" },
    { id: "cholesterol", label: "Serum cholesterol", type: "number", unit: "mg/dL", min: 100, max: 600 },
    { id: "fasting_bs", label: "Fasting blood sugar > 120 mg/dL?", type: "boolean" },
    { id: "resting_ecg", label: "Resting ECG result", type: "select", options: [
      { label: "Normal", value: "normal" }, { label: "ST-T wave abnormality", value: "st_t" }, { label: "Left ventricular hypertrophy", value: "lvh" }] },
    { id: "max_hr", label: "Maximum heart rate achieved", type: "number", unit: "bpm", min: 60, max: 220 },
    { id: "exercise_angina", label: "Chest pain triggered by exercise?", type: "boolean" },
    { id: "st_depression", label: "ST depression induced by exercise", type: "number", step: 0.1, min: 0, max: 10 },
    { id: "family_history", label: "Family history of heart disease?", type: "boolean" },
    { id: "smoking", label: "Do you currently smoke?", type: "boolean" },
  ],

  diabetes: [
    { id: "age", label: "Age", type: "number", unit: "years", min: 1, max: 120 },
    { id: "pregnancies", label: "Number of pregnancies (if applicable)", type: "number", min: 0, max: 20 },
    { id: "glucose", label: "Plasma glucose concentration (OGTT)", type: "number", unit: "mg/dL", min: 40, max: 400 },
    { id: "blood_pressure", label: "Diastolic blood pressure", type: "number", unit: "mmHg", min: 40, max: 160 },
    { id: "skin_thickness", label: "Triceps skinfold thickness", type: "number", unit: "mm", min: 0, max: 100 },
    { id: "insulin", label: "2-hour serum insulin", type: "number", unit: "mu U/mL", min: 0, max: 900 },
    { id: "bmi", label: "Body Mass Index (BMI)", type: "number", step: 0.1, min: 10, max: 70 },
    { id: "family_history", label: "Family history of diabetes?", type: "boolean" },
    { id: "physical_activity", label: "Weekly physical activity level", type: "select", options: [
      { label: "Sedentary", value: "sedentary" }, { label: "Light (1-2x/week)", value: "light" },
      { label: "Moderate (3-4x/week)", value: "moderate" }, { label: "Active (5+/week)", value: "active" }] },
    { id: "excessive_thirst", label: "Excessive thirst or frequent urination?", type: "boolean" },
  ],

  stroke: [
    { id: "age", label: "Age", type: "number", unit: "years", min: 1, max: 120 },
    { id: "hypertension", label: "Diagnosed with hypertension?", type: "boolean" },
    { id: "heart_disease", label: "History of heart disease?", type: "boolean" },
    { id: "avg_glucose", label: "Average glucose level", type: "number", unit: "mg/dL", min: 40, max: 400 },
    { id: "bmi", label: "Body Mass Index (BMI)", type: "number", step: 0.1, min: 10, max: 70 },
    { id: "smoking_status", label: "Smoking status", type: "select", options: [
      { label: "Never smoked", value: "never" }, { label: "Formerly smoked", value: "former" }, { label: "Currently smokes", value: "current" }] },
    { id: "atrial_fibrillation", label: "Diagnosed with atrial fibrillation?", type: "boolean" },
    { id: "prior_tia", label: "Previous TIA / mini-stroke episode?", type: "boolean" },
    { id: "physical_activity", label: "Regular physical activity?", type: "boolean" },
    { id: "work_type", label: "Occupation stress level", type: "select", options: [
      { label: "Low stress", value: "low" }, { label: "Moderate stress", value: "moderate" }, { label: "High stress", value: "high" }] },
  ],

  hypertension: [
    { id: "age", label: "Age", type: "number", unit: "years", min: 1, max: 120 },
    { id: "systolic_bp", label: "Systolic blood pressure", type: "number", unit: "mmHg", min: 70, max: 260 },
    { id: "diastolic_bp", label: "Diastolic blood pressure", type: "number", unit: "mmHg", min: 40, max: 160 },
    { id: "salt_intake", label: "Daily salt intake", type: "select", options: [
      { label: "Low", value: "low" }, { label: "Moderate", value: "moderate" }, { label: "High", value: "high" }] },
    { id: "bmi", label: "Body Mass Index (BMI)", type: "number", step: 0.1, min: 10, max: 70 },
    { id: "alcohol", label: "Regular alcohol consumption?", type: "boolean" },
    { id: "smoking", label: "Do you currently smoke?", type: "boolean" },
    { id: "stress_level", label: "Perceived daily stress", type: "select", options: [
      { label: "Low", value: "low" }, { label: "Moderate", value: "moderate" }, { label: "High", value: "high" }] },
    { id: "family_history", label: "Family history of hypertension?", type: "boolean" },
    { id: "physical_activity", label: "Minutes of exercise per week", type: "number", unit: "min", min: 0, max: 1000 },
  ],

  kidney: [
    { id: "age", label: "Age", type: "number", unit: "years", min: 1, max: 120 },
    { id: "blood_pressure", label: "Blood pressure", type: "number", unit: "mmHg", min: 60, max: 220 },
    { id: "specific_gravity", label: "Urine specific gravity", type: "number", step: 0.001, min: 1.0, max: 1.05 },
    { id: "albumin", label: "Urine albumin level (0-5)", type: "number", min: 0, max: 5 },
    { id: "blood_glucose", label: "Random blood glucose", type: "number", unit: "mg/dL", min: 40, max: 400 },
    { id: "blood_urea", label: "Blood urea", type: "number", unit: "mg/dL", min: 5, max: 250 },
    { id: "serum_creatinine", label: "Serum creatinine", type: "number", step: 0.1, unit: "mg/dL", min: 0.1, max: 20 },
    { id: "hemoglobin", label: "Hemoglobin level", type: "number", step: 0.1, unit: "g/dL", min: 3, max: 20 },
    { id: "diabetes_history", label: "Diagnosed with diabetes?", type: "boolean" },
    { id: "hypertension_history", label: "Diagnosed with hypertension?", type: "boolean" },
    { id: "swelling", label: "Swelling in legs/ankles (edema)?", type: "boolean" },
  ],

  liver: [
    { id: "age", label: "Age", type: "number", unit: "years", min: 1, max: 120 },
    { id: "sex", label: "Biological sex", type: "radio", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }] },
    { id: "total_bilirubin", label: "Total bilirubin", type: "number", step: 0.1, unit: "mg/dL", min: 0.1, max: 30 },
    { id: "direct_bilirubin", label: "Direct bilirubin", type: "number", step: 0.1, unit: "mg/dL", min: 0, max: 20 },
    { id: "alkaline_phosphotase", label: "Alkaline phosphatase (ALP)", type: "number", unit: "IU/L", min: 20, max: 2000 },
    { id: "alamine_aminotransferase", label: "ALT (SGPT)", type: "number", unit: "IU/L", min: 1, max: 2000 },
    { id: "aspartate_aminotransferase", label: "AST (SGOT)", type: "number", unit: "IU/L", min: 1, max: 2000 },
    { id: "total_proteins", label: "Total proteins", type: "number", step: 0.1, unit: "g/dL", min: 1, max: 12 },
    { id: "albumin", label: "Albumin", type: "number", step: 0.1, unit: "g/dL", min: 1, max: 6 },
    { id: "alcohol_use", label: "Regular alcohol consumption?", type: "boolean" },
  ],

  fatty_liver: [
    { id: "age", label: "Age", type: "number", unit: "years", min: 1, max: 120 },
    { id: "bmi", label: "Body Mass Index (BMI)", type: "number", step: 0.1, min: 10, max: 70 },
    { id: "waist_circumference", label: "Waist circumference", type: "number", unit: "cm", min: 40, max: 200 },
    { id: "fasting_glucose", label: "Fasting blood glucose", type: "number", unit: "mg/dL", min: 40, max: 400 },
    { id: "triglycerides", label: "Triglycerides", type: "number", unit: "mg/dL", min: 30, max: 1000 },
    { id: "hdl", label: "HDL cholesterol", type: "number", unit: "mg/dL", min: 10, max: 150 },
    { id: "alt", label: "ALT (SGPT)", type: "number", unit: "IU/L", min: 1, max: 2000 },
    { id: "alcohol_use", label: "Regular alcohol consumption?", type: "boolean" },
    { id: "diabetes_history", label: "Diagnosed with diabetes / insulin resistance?", type: "boolean" },
    { id: "physical_activity", label: "Regular physical activity?", type: "boolean" },
  ],

  breast_cancer: [
    { id: "age", label: "Age", type: "number", unit: "years", min: 1, max: 120 },
    { id: "radius_mean", label: "Mean lump radius (from imaging)", type: "number", step: 0.1, min: 1, max: 50 },
    { id: "texture_mean", label: "Mean texture score", type: "number", step: 0.1, min: 1, max: 50 },
    { id: "perimeter_mean", label: "Mean perimeter", type: "number", step: 0.1, min: 10, max: 250 },
    { id: "area_mean", label: "Mean area", type: "number", min: 50, max: 3000 },
    { id: "smoothness_mean", label: "Mean smoothness score", type: "number", step: 0.001, min: 0, max: 0.3 },
    { id: "family_history", label: "Family history of breast cancer?", type: "boolean" },
    { id: "menopause_status", label: "Menopause status", type: "select", options: [
      { label: "Pre-menopausal", value: "pre" }, { label: "Post-menopausal", value: "post" }] },
    { id: "lump_noticed", label: "Any lump or thickening noticed?", type: "boolean" },
  ],

  lung_cancer: [
    { id: "age", label: "Age", type: "number", unit: "years", min: 1, max: 120 },
    { id: "smoking_years", label: "Years of smoking (0 if never)", type: "number", min: 0, max: 80 },
    { id: "cigarettes_per_day", label: "Cigarettes per day (average)", type: "number", min: 0, max: 100 },
    { id: "passive_smoker", label: "Regular exposure to second-hand smoke?", type: "boolean" },
    { id: "chronic_cough", label: "Chronic cough for more than 3 weeks?", type: "boolean" },
    { id: "shortness_of_breath", label: "Shortness of breath on exertion?", type: "boolean" },
    { id: "chest_pain", label: "Persistent chest pain?", type: "boolean" },
    { id: "coughing_blood", label: "Coughing up blood?", type: "boolean" },
    { id: "occupational_exposure", label: "Occupational exposure to asbestos/chemicals?", type: "boolean" },
    { id: "family_history", label: "Family history of lung cancer?", type: "boolean" },
  ],

  cervical_cancer: [
    { id: "age", label: "Age", type: "number", unit: "years", min: 10, max: 100 },
    { id: "age_first_intercourse", label: "Age at first sexual activity", type: "number", min: 10, max: 60 },
    { id: "num_partners", label: "Number of sexual partners (lifetime)", type: "number", min: 0, max: 50 },
    { id: "pregnancies", label: "Number of pregnancies", type: "number", min: 0, max: 20 },
    { id: "smoking", label: "Do you currently smoke?", type: "boolean" },
    { id: "hormonal_contraceptives", label: "Long-term hormonal contraceptive use?", type: "boolean" },
    { id: "stds_history", label: "History of sexually transmitted infections?", type: "boolean" },
    { id: "hpv_test", label: "Prior HPV positive test result?", type: "boolean" },
    { id: "last_pap_smear", label: "Years since last Pap smear", type: "number", min: 0, max: 40 },
  ],

  prostate_cancer: [
    { id: "age", label: "Age", type: "number", unit: "years", min: 30, max: 110 },
    { id: "psa_level", label: "PSA (Prostate-Specific Antigen) level", type: "number", step: 0.1, unit: "ng/mL", min: 0, max: 100 },
    { id: "family_history", label: "Family history of prostate cancer?", type: "boolean" },
    { id: "urinary_frequency", label: "Increased urinary frequency at night?", type: "boolean" },
    { id: "weak_stream", label: "Weak or interrupted urine stream?", type: "boolean" },
    { id: "difficulty_urinating", label: "Difficulty starting urination?", type: "boolean" },
    { id: "blood_in_urine", label: "Blood in urine or semen?", type: "boolean" },
    { id: "pelvic_discomfort", label: "Pelvic or lower back discomfort?", type: "boolean" },
    { id: "digital_exam_abnormal", label: "Abnormal digital rectal exam finding?", type: "boolean" },
  ],

  thyroid: [
    { id: "age", label: "Age", type: "number", unit: "years", min: 1, max: 120 },
    { id: "sex", label: "Biological sex", type: "radio", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }] },
    { id: "tsh", label: "TSH level", type: "number", step: 0.01, unit: "mIU/L", min: 0, max: 50 },
    { id: "t3", label: "T3 level", type: "number", step: 0.1, unit: "ng/dL", min: 0, max: 10 },
    { id: "t4", label: "T4 (Thyroxine) level", type: "number", step: 0.1, unit: "µg/dL", min: 0, max: 30 },
    { id: "goiter", label: "Visible swelling in neck (goiter)?", type: "boolean" },
    { id: "weight_change", label: "Unexplained weight gain or loss?", type: "boolean" },
    { id: "fatigue", label: "Persistent fatigue?", type: "boolean" },
    { id: "family_history", label: "Family history of thyroid disorders?", type: "boolean" },
  ],

  parkinsons: [
    { id: "age", label: "Age", type: "number", unit: "years", min: 20, max: 110 },
    { id: "tremor", label: "Resting tremor in hands?", type: "boolean" },
    { id: "muscle_rigidity", label: "Muscle stiffness or rigidity?", type: "boolean" },
    { id: "bradykinesia", label: "Noticeable slowness of movement?", type: "boolean" },
    { id: "voice_change", label: "Change in voice (soft/monotone)?", type: "boolean" },
    { id: "handwriting_change", label: "Handwriting became smaller (micrographia)?", type: "boolean" },
    { id: "balance_issues", label: "Balance problems or frequent falls?", type: "boolean" },
    { id: "mdvp_jitter", label: "Voice jitter measurement (if available)", type: "number", step: 0.0001, min: 0, max: 1, helper: "From clinical voice-recording test, leave default if unknown" },
    { id: "family_history", label: "Family history of Parkinson's disease?", type: "boolean" },
  ],

  alzheimers: [
    { id: "age", label: "Age", type: "number", unit: "years", min: 40, max: 110 },
    { id: "education_years", label: "Years of formal education", type: "number", min: 0, max: 25 },
    { id: "memory_complaints", label: "Frequent memory complaints?", type: "boolean" },
    { id: "mmse_score", label: "Mini-Mental State Exam (MMSE) score, if known", type: "number", min: 0, max: 30 },
    { id: "family_history", label: "Family history of dementia/Alzheimer's?", type: "boolean" },
    { id: "hypertension_history", label: "Diagnosed with hypertension?", type: "boolean" },
    { id: "diabetes_history", label: "Diagnosed with diabetes?", type: "boolean" },
    { id: "physical_activity", label: "Regular physical activity?", type: "boolean" },
    { id: "social_engagement", label: "Regular social / cognitive engagement?", type: "boolean" },
  ],

  anemia: [
    { id: "age", label: "Age", type: "number", unit: "years", min: 1, max: 120 },
    { id: "sex", label: "Biological sex", type: "radio", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }] },
    { id: "hemoglobin", label: "Hemoglobin level", type: "number", step: 0.1, unit: "g/dL", min: 3, max: 20 },
    { id: "mcv", label: "Mean corpuscular volume (MCV)", type: "number", step: 0.1, unit: "fL", min: 50, max: 130 },
    { id: "rbc_count", label: "Red blood cell count", type: "number", step: 0.01, unit: "million/µL", min: 1, max: 8 },
    { id: "fatigue", label: "Persistent fatigue or weakness?", type: "boolean" },
    { id: "pale_skin", label: "Noticeable pale skin or nails?", type: "boolean" },
    { id: "dietary_iron", label: "Adequate dietary iron intake?", type: "boolean" },
    { id: "heavy_menstruation", label: "Heavy menstrual bleeding (if applicable)?", type: "boolean" },
  ],

  obesity: [
    { id: "age", label: "Age", type: "number", unit: "years", min: 1, max: 120 },
    { id: "height", label: "Height", type: "number", unit: "cm", min: 100, max: 230 },
    { id: "weight", label: "Weight", type: "number", unit: "kg", min: 20, max: 300 },
    { id: "waist_circumference", label: "Waist circumference", type: "number", unit: "cm", min: 40, max: 200 },
    { id: "physical_activity", label: "Days of exercise per week", type: "number", min: 0, max: 7 },
    { id: "diet_quality", label: "Typical diet pattern", type: "select", options: [
      { label: "High in processed/fast food", value: "poor" }, { label: "Balanced/mixed", value: "moderate" }, { label: "Whole-food, home-cooked", value: "healthy" }] },
    { id: "sleep_hours", label: "Average sleep per night", type: "number", unit: "hrs", min: 2, max: 14 },
    { id: "family_history", label: "Family history of obesity?", type: "boolean" },
    { id: "screen_time", label: "Sedentary screen time per day", type: "number", unit: "hrs", min: 0, max: 20 },
  ],
};
