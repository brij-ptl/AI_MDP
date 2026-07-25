"""
One-off generator script that writes app/ml/diseases/<slug>/config.json for all 16 diseases.
Run once: python scripts/generate_disease_configs.py
Safe to re-run (overwrites). Not part of the runtime request path.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "app" / "ml" / "diseases"

def numf(name, label, unit, lo, hi, default, aliases=None):
    return {"name": name, "label": label, "type": "numeric", "unit": unit,
            "min": lo, "max": hi, "default": default, "ocr_aliases": aliases or [label.lower()]}

def catf(name, label, categories, default, aliases=None):
    return {"name": name, "label": label, "type": "categorical", "categories": categories,
            "default": default, "ocr_aliases": aliases or [label.lower()]}

DISEASES = {}

# ---------------------------------------------------------------- 1. HEART
DISEASES["heart"] = {
    "slug": "heart", "name": "Heart Disease", "category": "Cardiovascular", "icon": "heart",
    "short_description": "Risk of coronary heart disease based on clinical and lifestyle indicators.",
    "overview": "Coronary heart disease develops when the arteries supplying blood to the heart become "
                "narrowed or blocked, usually due to a buildup of fatty plaque (atherosclerosis). Left "
                "unmanaged it can lead to angina, heart attack, or heart failure.",
    "risk_factors": ["High blood pressure", "High cholesterol", "Smoking", "Diabetes", "Obesity",
                      "Sedentary lifestyle", "Family history", "Age over 45 (men) / 55 (women)"],
    "common_symptoms": ["Chest pain or tightness", "Shortness of breath", "Fatigue",
                         "Pain radiating to arm/jaw", "Irregular heartbeat"],
    "recommended_tests": ["ECG (Electrocardiogram)", "Lipid Profile", "Echocardiogram",
                           "Cardiac Stress Test", "Coronary Angiography"],
    "recommended_specialist": "Cardiologist",
    "algorithm": "random_forest",
    "data_source": "public_dataset",
    "dataset_url": "https://raw.githubusercontent.com/kb22/Heart-Disease-Prediction/master/dataset.csv",
    "target": "target",
    "positive_value": 1,
    "feature_schema": [
        numf("age", "Age", "years", 18, 100, 45, ["age"]),
        catf("sex", "Sex", ["1", "0"], "1", ["sex", "gender"]),
        numf("cp", "Chest Pain Type (0-3)", "", 0, 3, 0, ["chest pain type", "cp"]),
        numf("trestbps", "Resting Blood Pressure", "mmHg", 80, 220, 120, ["resting bp", "trestbps", "bp"]),
        numf("chol", "Serum Cholesterol", "mg/dl", 100, 600, 200, ["cholesterol", "chol"]),
        numf("fbs", "Fasting Blood Sugar > 120mg/dl (1=yes,0=no)", "", 0, 1, 0, ["fasting blood sugar", "fbs"]),
        numf("restecg", "Resting ECG Result (0-2)", "", 0, 2, 0, ["restecg", "ecg"]),
        numf("thalach", "Max Heart Rate Achieved", "bpm", 60, 220, 150, ["max heart rate", "thalach"]),
        numf("exang", "Exercise Induced Angina (1=yes,0=no)", "", 0, 1, 0, ["exercise angina", "exang"]),
        numf("oldpeak", "ST Depression (exercise vs rest)", "", 0, 6.2, 1.0, ["oldpeak", "st depression"]),
        numf("slope", "Slope of Peak Exercise ST (0-2)", "", 0, 2, 1, ["slope"]),
        numf("ca", "Major Vessels Colored by Fluoroscopy (0-3)", "", 0, 3, 0, ["ca", "vessels"]),
        numf("thal", "Thalassemia (1=normal,2=fixed,3=reversible)", "", 1, 3, 2, ["thal", "thalassemia"]),
    ],
}

# ---------------------------------------------------------------- 2. DIABETES
DISEASES["diabetes"] = {
    "slug": "diabetes", "name": "Diabetes", "category": "Metabolic", "icon": "droplet",
    "short_description": "Type-2 diabetes risk based on glucose metabolism and body measurements.",
    "overview": "Type 2 diabetes occurs when the body becomes resistant to insulin or doesn't produce "
                "enough of it, causing blood glucose levels to rise. Over time this damages blood "
                "vessels, nerves, kidneys and eyes.",
    "risk_factors": ["Obesity", "Sedentary lifestyle", "Family history", "Age over 45",
                      "High blood pressure", "Prior gestational diabetes", "Polycystic ovary syndrome"],
    "common_symptoms": ["Increased thirst", "Frequent urination", "Unexplained weight loss",
                         "Fatigue", "Blurred vision", "Slow-healing sores"],
    "recommended_tests": ["Fasting Blood Glucose", "HbA1c", "Oral Glucose Tolerance Test", "Lipid Profile"],
    "recommended_specialist": "Endocrinologist",
    "algorithm": "random_forest",
    "data_source": "public_dataset",
    "dataset_url": "https://raw.githubusercontent.com/ybifoundation/Dataset/main/Diabetes.csv",
    "target": "diabetes",
    "positive_value": 1,
    "feature_schema": [
        numf("pregnancies", "Number of Pregnancies", "", 0, 17, 1, ["pregnancies"]),
        numf("glucose", "Plasma Glucose Concentration", "mg/dl", 40, 300, 110, ["glucose", "fasting glucose", "fbs"]),
        numf("diastolic", "Diastolic Blood Pressure", "mmHg", 40, 140, 70, ["diastolic", "dbp"]),
        numf("triceps", "Triceps Skin Fold Thickness", "mm", 0, 100, 20, ["triceps", "skin fold"]),
        numf("insulin", "2-Hour Serum Insulin", "mu U/ml", 0, 900, 80, ["insulin"]),
        numf("bmi", "Body Mass Index", "kg/m2", 10, 70, 25, ["bmi", "body mass index"]),
        numf("dpf", "Diabetes Pedigree Function", "", 0.0, 2.5, 0.4, ["diabetes pedigree", "dpf"]),
        numf("age", "Age", "years", 18, 100, 35, ["age"]),
    ],
}

# ---------------------------------------------------------------- 3. BREAST CANCER (sklearn built-in Wisconsin dataset)
_bc_features = [
    "mean radius", "mean texture", "mean perimeter", "mean area", "mean smoothness",
    "mean compactness", "mean concavity", "mean concave points", "mean symmetry", "mean fractal dimension",
]
DISEASES["breast_cancer"] = {
    "slug": "breast_cancer", "name": "Breast Cancer", "category": "Cancer", "icon": "ribbon",
    "short_description": "Malignancy risk from digitized fine needle aspirate (FNA) cell nuclei measurements.",
    "overview": "Breast cancer arises when cells in breast tissue grow uncontrollably. This module "
                "screens using the size, shape and texture characteristics of cell nuclei captured "
                "from a fine needle aspirate (FNA) biopsy image — the same features radiologists and "
                "pathologists inspect under a microscope.",
    "risk_factors": ["Family history", "Age over 50", "BRCA1/BRCA2 gene mutation", "Early menstruation",
                      "Late menopause", "Obesity", "Alcohol use", "Never having children"],
    "common_symptoms": ["Breast lump or thickening", "Change in breast shape", "Nipple discharge",
                         "Skin dimpling", "Nipple retraction"],
    "recommended_tests": ["Mammography", "Breast Ultrasound", "Fine Needle Aspiration (FNA) Biopsy", "MRI"],
    "recommended_specialist": "Oncologist",
    "algorithm": "logistic_regression",
    "data_source": "public_dataset",
    "dataset_url": "sklearn_builtin:breast_cancer",
    "target": "target",
    "positive_value": 0,   # sklearn dataset: 0 = malignant, 1 = benign
    "feature_schema": [
        numf("mean_radius", "Mean Radius", "", 5, 30, 14, ["radius"]),
        numf("mean_texture", "Mean Texture", "", 5, 40, 19, ["texture"]),
        numf("mean_perimeter", "Mean Perimeter", "", 40, 200, 90, ["perimeter"]),
        numf("mean_area", "Mean Area", "", 140, 2600, 650, ["area"]),
        numf("mean_smoothness", "Mean Smoothness", "", 0.03, 0.2, 0.1, ["smoothness"]),
        numf("mean_compactness", "Mean Compactness", "", 0.0, 0.35, 0.1, ["compactness"]),
        numf("mean_concavity", "Mean Concavity", "", 0.0, 0.45, 0.09, ["concavity"]),
        numf("mean_concave_points", "Mean Concave Points", "", 0.0, 0.2, 0.05, ["concave points"]),
        numf("mean_symmetry", "Mean Symmetry", "", 0.1, 0.35, 0.18, ["symmetry"]),
        numf("mean_fractal_dimension", "Mean Fractal Dimension", "", 0.04, 0.1, 0.06, ["fractal dimension"]),
    ],
}

# ---------------------------------------------------------------- Remaining 13: clinically-informed synthetic
def synthetic(slug, name, category, icon, short_description, overview, risk_factors, symptoms,
              tests, specialist, features, weights, base_rate, algorithm="random_forest"):
    DISEASES[slug] = {
        "slug": slug, "name": name, "category": category, "icon": icon,
        "short_description": short_description, "overview": overview,
        "risk_factors": risk_factors, "common_symptoms": symptoms,
        "recommended_tests": tests, "recommended_specialist": specialist,
        "algorithm": algorithm, "data_source": "synthetic_demo", "dataset_url": None,
        "target": "target", "positive_value": 1,
        "feature_schema": features,
        "synthetic_weights": weights, "synthetic_base_rate": base_rate,
    }

synthetic(
    "stroke", "Stroke", "Cardiovascular", "brain",
    "Risk of ischemic or hemorrhagic stroke from vascular and lifestyle factors.",
    "A stroke occurs when blood supply to part of the brain is interrupted or reduced, depriving "
    "brain tissue of oxygen. It is a medical emergency; early risk detection allows preventive "
    "treatment of underlying hypertension, atrial fibrillation, and cholesterol.",
    ["Hypertension", "Heart disease", "Diabetes", "Smoking", "Obesity", "Age over 55", "Atrial fibrillation"],
    ["Sudden numbness/weakness one side", "Confusion", "Trouble speaking", "Vision problems", "Severe headache"],
    ["CT Scan Brain", "MRI Brain", "Carotid Ultrasound", "ECG", "Lipid Profile"],
    "Neurologist",
    [numf("age", "Age", "years", 1, 100, 45), catf("gender", "Gender", ["male", "female"], "male"),
     catf("hypertension", "Hypertension (1=yes,0=no)", ["1", "0"], "0"),
     catf("heart_disease", "Heart Disease (1=yes,0=no)", ["1", "0"], "0"),
     numf("avg_glucose_level", "Average Glucose Level", "mg/dl", 50, 300, 100),
     numf("bmi", "BMI", "kg/m2", 10, 60, 25),
     catf("smoking_status", "Smoking Status", ["never", "formerly", "current"], "never")],
    {"age": 0.03, "hypertension__1": 1.2, "heart_disease__1": 1.1, "avg_glucose_level": 0.01,
     "bmi": 0.02, "smoking_status__current": 0.8, "smoking_status__formerly": 0.3},
    0.06,
)

synthetic(
    "hypertension", "Hypertension", "Cardiovascular", "activity",
    "Risk of high blood pressure from lifestyle, weight and family history.",
    "Hypertension is persistently elevated pressure in the arteries. It usually has no symptoms but "
    "significantly raises the risk of heart attack, stroke and kidney disease if untreated.",
    ["Obesity", "High salt intake", "Sedentary lifestyle", "Alcohol", "Stress", "Family history", "Age"],
    ["Usually asymptomatic", "Headache", "Dizziness", "Nosebleeds (severe cases)"],
    ["Blood Pressure Monitoring", "ECG", "Kidney Function Test", "Lipid Profile"],
    "Cardiologist",
    [numf("age", "Age", "years", 18, 100, 40), numf("bmi", "BMI", "kg/m2", 10, 60, 25),
     numf("salt_intake_g", "Daily Salt Intake", "g/day", 2, 20, 8),
     catf("family_history", "Family History (1=yes,0=no)", ["1", "0"], "0"),
     catf("physical_activity", "Physical Activity", ["sedentary", "moderate", "active"], "moderate"),
     numf("stress_level", "Stress Level (0-10)", "", 0, 10, 5)],
    {"age": 0.025, "bmi": 0.04, "salt_intake_g": 0.06, "family_history__1": 0.9,
     "physical_activity__sedentary": 0.7, "stress_level": 0.08},
    0.25,
)

synthetic(
    "kidney", "Chronic Kidney Disease", "Organ Disease", "kidney",
    "Risk of chronic kidney disease from renal function blood/urine markers.",
    "Chronic kidney disease (CKD) is the gradual loss of kidney function. Kidneys filter waste and "
    "excess fluid from blood; when damaged, waste builds up in the body causing serious complications.",
    ["Diabetes", "Hypertension", "Family history", "Obesity", "Smoking", "Age over 60", "Heart disease"],
    ["Fatigue", "Swelling in legs/ankles", "Foamy urine", "Loss of appetite", "Difficulty concentrating"],
    ["Serum Creatinine", "Blood Urea Nitrogen", "eGFR", "Urinalysis", "Kidney Ultrasound"],
    "Nephrologist",
    [numf("age", "Age", "years", 1, 100, 45), numf("blood_pressure", "Blood Pressure", "mmHg", 60, 200, 120),
     numf("blood_glucose_random", "Random Blood Glucose", "mg/dl", 50, 400, 120),
     numf("blood_urea", "Blood Urea", "mg/dl", 5, 200, 30),
     numf("serum_creatinine", "Serum Creatinine", "mg/dl", 0.3, 15, 1.0),
     numf("hemoglobin", "Hemoglobin", "g/dl", 3, 18, 13),
     catf("hypertension", "Hypertension (1=yes,0=no)", ["1", "0"], "0"),
     catf("diabetes_mellitus", "Diabetes (1=yes,0=no)", ["1", "0"], "0")],
    {"age": 0.02, "blood_pressure": 0.015, "blood_glucose_random": 0.006, "blood_urea": 0.02,
     "serum_creatinine": 0.5, "hemoglobin": -0.15, "hypertension__1": 0.8, "diabetes_mellitus__1": 0.7},
    0.15,
)

synthetic(
    "liver", "Liver Disease", "Organ Disease", "liver",
    "Risk of liver dysfunction from bilirubin and liver enzyme panel.",
    "Liver disease refers to any condition that damages the liver and affects its function, ranging "
    "from hepatitis to cirrhosis. Blood enzyme levels are the earliest indicator of liver stress.",
    ["Alcohol use", "Obesity", "Hepatitis B/C infection", "Diabetes", "Family history", "Certain medications"],
    ["Jaundice", "Abdominal pain/swelling", "Nausea", "Dark urine", "Chronic fatigue"],
    ["Liver Function Test (LFT)", "Ultrasound Abdomen", "Hepatitis Panel", "Liver Biopsy"],
    "Hepatologist / Gastroenterologist",
    [numf("age", "Age", "years", 1, 100, 45), catf("gender", "Gender", ["male", "female"], "male"),
     numf("total_bilirubin", "Total Bilirubin", "mg/dl", 0.1, 20, 1.0),
     numf("direct_bilirubin", "Direct Bilirubin", "mg/dl", 0.0, 10, 0.3),
     numf("alkaline_phosphotase", "Alkaline Phosphotase", "IU/L", 60, 900, 200),
     numf("alamine_aminotransferase", "ALT (SGPT)", "IU/L", 5, 400, 30),
     numf("aspartate_aminotransferase", "AST (SGOT)", "IU/L", 5, 400, 30),
     numf("albumin", "Albumin", "g/dl", 1.5, 6, 4.0)],
    {"total_bilirubin": 0.35, "direct_bilirubin": 0.5, "alkaline_phosphotase": 0.003,
     "alamine_aminotransferase": 0.01, "aspartate_aminotransferase": 0.01, "albumin": -0.5, "age": 0.015},
    0.28,
)

synthetic(
    "fatty_liver", "Fatty Liver Disease", "Organ Disease", "liver",
    "Non-alcoholic fatty liver disease (NAFLD) risk from metabolic markers.",
    "Fatty liver disease is the buildup of excess fat in liver cells, strongly linked to obesity, "
    "insulin resistance and metabolic syndrome. Early stages are often reversible with lifestyle change.",
    ["Obesity", "Type 2 diabetes", "High triglycerides", "Metabolic syndrome", "Sedentary lifestyle", "Alcohol"],
    ["Fatigue", "Mild right upper abdominal discomfort", "Often asymptomatic"],
    ["Liver Ultrasound", "Liver Function Test", "Lipid Profile", "FibroScan"],
    "Hepatologist / Gastroenterologist",
    [numf("age", "Age", "years", 18, 100, 40), numf("bmi", "BMI", "kg/m2", 10, 60, 27),
     numf("triglycerides", "Triglycerides", "mg/dl", 30, 600, 150),
     numf("fasting_glucose", "Fasting Glucose", "mg/dl", 50, 300, 100),
     numf("alt", "ALT (SGPT)", "IU/L", 5, 400, 30),
     catf("alcohol_use", "Alcohol Use", ["never", "occasional", "regular"], "never")],
    {"bmi": 0.06, "triglycerides": 0.006, "fasting_glucose": 0.008, "alt": 0.015,
     "alcohol_use__regular": 0.6, "age": 0.01},
    0.22,
)

synthetic(
    "lung_cancer", "Lung Cancer", "Cancer", "lungs",
    "Lung cancer risk from smoking history and respiratory symptoms.",
    "Lung cancer begins in the cells of the lungs, most commonly caused by long-term exposure to "
    "tobacco smoke. Symptoms often appear only after the disease has progressed, making risk "
    "screening in smokers especially important.",
    ["Smoking", "Secondhand smoke exposure", "Radon exposure", "Asbestos exposure", "Family history", "Age over 50"],
    ["Persistent cough", "Coughing up blood", "Chest pain", "Hoarseness", "Unexplained weight loss", "Shortness of breath"],
    ["Low-Dose CT Scan", "Chest X-Ray", "Sputum Cytology", "Bronchoscopy", "Biopsy"],
    "Pulmonologist / Oncologist",
    [numf("age", "Age", "years", 18, 100, 50), catf("gender", "Gender", ["male", "female"], "male"),
     catf("smoking", "Smoking (1=yes,0=no)", ["1", "0"], "0"),
     numf("smoking_years", "Years Smoking", "years", 0, 60, 0),
     catf("chronic_cough", "Chronic Cough (1=yes,0=no)", ["1", "0"], "0"),
     catf("chest_pain", "Chest Pain (1=yes,0=no)", ["1", "0"], "0"),
     catf("family_history", "Family History (1=yes,0=no)", ["1", "0"], "0")],
    {"age": 0.02, "smoking__1": 1.4, "smoking_years": 0.03, "chronic_cough__1": 0.6,
     "chest_pain__1": 0.5, "family_history__1": 0.5},
    0.10,
)

synthetic(
    "cervical_cancer", "Cervical Cancer", "Cancer", "ribbon",
    "Cervical cancer risk from HPV, screening and lifestyle history.",
    "Cervical cancer develops in the cells of the cervix, most often caused by persistent infection "
    "with high-risk strains of human papillomavirus (HPV). Regular screening (Pap smear) catches "
    "precancerous changes early.",
    ["HPV infection", "Multiple sexual partners", "Smoking", "Weakened immune system", "Long-term oral contraceptive use"],
    ["Abnormal vaginal bleeding", "Pelvic pain", "Pain during intercourse", "Unusual discharge"],
    ["Pap Smear", "HPV DNA Test", "Colposcopy", "Biopsy"],
    "Gynecologic Oncologist",
    [numf("age", "Age", "years", 15, 90, 35), numf("num_sexual_partners", "Number of Sexual Partners", "", 0, 20, 2),
     catf("smoking", "Smoking (1=yes,0=no)", ["1", "0"], "0"),
     catf("hpv_test_result", "HPV Test Positive (1=yes,0=no)", ["1", "0"], "0"),
     catf("std_history", "STD History (1=yes,0=no)", ["1", "0"], "0"),
     numf("first_sexual_intercourse_age", "Age at First Intercourse", "years", 12, 40, 20)],
    {"num_sexual_partners": 0.08, "smoking__1": 0.5, "hpv_test_result__1": 1.8, "std_history__1": 0.6,
     "first_sexual_intercourse_age": -0.05, "age": 0.01},
    0.08,
)

synthetic(
    "prostate_cancer", "Prostate Cancer", "Cancer", "ribbon",
    "Prostate cancer risk from PSA levels and clinical indicators.",
    "Prostate cancer develops in the prostate gland in men and is one of the most common cancers "
    "in older men. Elevated PSA (prostate-specific antigen) is the primary early screening marker.",
    ["Age over 50", "Family history", "African ancestry", "Obesity", "High-fat diet"],
    ["Frequent urination (esp. at night)", "Weak urine stream", "Blood in urine/semen", "Pelvic discomfort"],
    ["PSA Blood Test", "Digital Rectal Exam (DRE)", "Prostate Biopsy", "MRI"],
    "Urologist / Oncologist",
    [numf("age", "Age", "years", 30, 100, 55), numf("psa_level", "PSA Level", "ng/ml", 0.1, 50, 2.0),
     catf("family_history", "Family History (1=yes,0=no)", ["1", "0"], "0"),
     numf("prostate_volume", "Prostate Volume", "cc", 15, 150, 35),
     catf("dre_abnormal", "Abnormal DRE Finding (1=yes,0=no)", ["1", "0"], "0")],
    {"age": 0.025, "psa_level": 0.15, "family_history__1": 0.7, "dre_abnormal__1": 1.2},
    0.10,
)

synthetic(
    "thyroid", "Thyroid Disease", "Endocrine", "thyroid",
    "Hypo/hyperthyroidism risk from TSH, T3, T4 hormone panel.",
    "Thyroid disease affects the small gland in the neck that regulates metabolism via hormones "
    "(TSH, T3, T4). Both underactive (hypothyroidism) and overactive (hyperthyroidism) states cause "
    "wide-ranging metabolic symptoms.",
    ["Family history", "Autoimmune disease", "Female gender", "Iodine deficiency/excess", "Age over 60"],
    ["Fatigue", "Weight change", "Cold/heat intolerance", "Hair thinning", "Neck swelling (goiter)", "Mood changes"],
    ["TSH Test", "Free T3 / Free T4", "Thyroid Ultrasound", "Thyroid Antibody Test"],
    "Endocrinologist",
    [numf("age", "Age", "years", 1, 100, 40), catf("gender", "Gender", ["male", "female"], "female"),
     numf("tsh", "TSH Level", "mIU/L", 0.01, 50, 2.5),
     numf("t3", "T3 Level", "ng/dl", 40, 300, 120),
     numf("t4", "T4 Level", "ug/dl", 1, 20, 8),
     catf("goiter", "Goiter Present (1=yes,0=no)", ["1", "0"], "0"),
     catf("family_history", "Family History (1=yes,0=no)", ["1", "0"], "0")],
    {"tsh": 0.09, "t3": -0.004, "t4": -0.05, "goiter__1": 0.9, "family_history__1": 0.5, "age": 0.01},
    0.18,
)

synthetic(
    "parkinsons", "Parkinson's Disease", "Neurological", "brain",
    "Parkinson's disease risk from vocal/motor tremor indicators.",
    "Parkinson's disease is a progressive nervous system disorder affecting movement, often starting "
    "with barely noticeable tremors. Subtle changes in voice (jitter, shimmer) are a well-studied "
    "early biomarker used alongside motor examination.",
    ["Age over 60", "Family history", "Male gender", "Pesticide exposure", "Head injury history"],
    ["Tremor at rest", "Slowed movement (bradykinesia)", "Muscle rigidity", "Balance problems",
     "Soft/slurred speech", "Reduced facial expression"],
    ["Neurological Examination", "DaTscan (Dopamine Transporter Scan)", "MRI Brain", "Voice Analysis"],
    "Neurologist",
    [numf("age", "Age", "years", 30, 100, 60), numf("voice_jitter_percent", "Voice Jitter (%)", "%", 0, 5, 0.5),
     numf("voice_shimmer_db", "Voice Shimmer (dB)", "dB", 0, 2, 0.2),
     catf("tremor", "Resting Tremor (1=yes,0=no)", ["1", "0"], "0"),
     catf("rigidity", "Muscle Rigidity (1=yes,0=no)", ["1", "0"], "0"),
     catf("family_history", "Family History (1=yes,0=no)", ["1", "0"], "0")],
    {"age": 0.03, "voice_jitter_percent": 0.5, "voice_shimmer_db": 0.9, "tremor__1": 1.3,
     "rigidity__1": 1.0, "family_history__1": 0.6},
    0.09,
)

synthetic(
    "alzheimers", "Alzheimer's Disease", "Neurological", "brain",
    "Alzheimer's / cognitive decline risk from cognitive test scores and history.",
    "Alzheimer's disease is a progressive brain disorder that slowly destroys memory and thinking "
    "skills. Standardized cognitive assessments (like MMSE) combined with age and family history "
    "provide an early risk indication.",
    ["Age over 65", "Family history", "Cardiovascular disease", "Low education level", "Head injury history", "Diabetes"],
    ["Memory loss disrupting daily life", "Difficulty planning/solving problems", "Confusion with time/place",
     "Trouble with words in speaking/writing", "Poor judgment"],
    ["MMSE (Mini-Mental State Exam)", "MRI Brain", "PET Scan", "Cerebrospinal Fluid Analysis"],
    "Neurologist",
    [numf("age", "Age", "years", 40, 100, 65), numf("mmse_score", "MMSE Score (0-30)", "", 0, 30, 27),
     numf("education_years", "Years of Education", "years", 0, 25, 12),
     catf("family_history", "Family History (1=yes,0=no)", ["1", "0"], "0"),
     catf("cardiovascular_disease", "Cardiovascular Disease (1=yes,0=no)", ["1", "0"], "0"),
     numf("memory_complaints_score", "Self-Reported Memory Complaints (0-10)", "", 0, 10, 2)],
    {"age": 0.04, "mmse_score": -0.18, "education_years": -0.04, "family_history__1": 0.6,
     "cardiovascular_disease__1": 0.5, "memory_complaints_score": 0.15},
    0.10,
)

synthetic(
    "anemia", "Anemia", "Blood Disorder", "droplet",
    "Anemia risk from complete blood count (CBC) indicators.",
    "Anemia is a condition where the blood lacks enough healthy red blood cells or hemoglobin to "
    "carry adequate oxygen to body tissues, most commonly caused by iron deficiency, chronic disease, "
    "or blood loss.",
    ["Iron-poor diet", "Heavy menstrual periods", "Pregnancy", "Chronic disease", "GI bleeding", "Vitamin B12/folate deficiency"],
    ["Fatigue", "Pale skin", "Shortness of breath", "Dizziness", "Cold hands/feet", "Rapid heartbeat"],
    ["Complete Blood Count (CBC)", "Serum Ferritin", "Vitamin B12 / Folate Levels", "Peripheral Smear"],
    "Hematologist",
    [numf("age", "Age", "years", 1, 100, 35), catf("gender", "Gender", ["male", "female"], "female"),
     numf("hemoglobin", "Hemoglobin", "g/dl", 3, 18, 12.5),
     numf("mcv", "Mean Corpuscular Volume (MCV)", "fL", 50, 120, 88),
     numf("rbc_count", "RBC Count", "million/uL", 2, 7, 4.5),
     numf("ferritin", "Serum Ferritin", "ng/ml", 2, 300, 60)],
    {"hemoglobin": -0.9, "mcv": -0.03, "rbc_count": -0.4, "ferritin": -0.01, "gender__female": 0.3},
    0.20,
)

synthetic(
    "obesity", "Obesity", "Lifestyle Disease", "activity",
    "Obesity / weight-related metabolic risk from BMI and lifestyle factors.",
    "Obesity is excess body fat accumulation that presents a risk to health, driven by an energy "
    "imbalance between calories consumed and expended, and is a major risk factor for diabetes, "
    "heart disease and joint problems.",
    ["Poor diet", "Physical inactivity", "Genetics", "Sleep deprivation", "Stress/emotional eating", "Certain medications"],
    ["High BMI", "Excess body fat", "Shortness of breath on exertion", "Joint pain", "Fatigue"],
    ["BMI Calculation", "Waist Circumference", "Body Fat Percentage", "Lipid Profile", "Fasting Glucose"],
    "Endocrinologist / Nutritionist",
    [numf("age", "Age", "years", 5, 100, 35), numf("height_cm", "Height", "cm", 100, 220, 165),
     numf("weight_kg", "Weight", "kg", 20, 250, 70),
     numf("waist_circumference_cm", "Waist Circumference", "cm", 50, 180, 85),
     catf("physical_activity", "Physical Activity", ["sedentary", "moderate", "active"], "moderate"),
     numf("daily_calorie_intake", "Daily Calorie Intake", "kcal", 800, 5000, 2200)],
    {"bmi": 0.15, "waist_circumference_cm": 0.03, "physical_activity__sedentary": 0.6,
     "daily_calorie_intake": 0.0004, "age": 0.005},
    0.30,
)

# ---------------------------------------------------------------- write files
OUT_DIR.mkdir(parents=True, exist_ok=True)
for slug, cfg in DISEASES.items():
    d = OUT_DIR / slug
    d.mkdir(parents=True, exist_ok=True)
    with open(d / "config.json", "w") as f:
        json.dump(cfg, f, indent=2)
    print(f"wrote {slug} ({len(cfg['feature_schema'])} features, source={cfg['data_source']})")

print(f"\nTotal diseases configured: {len(DISEASES)}")
