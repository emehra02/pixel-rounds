/* Pixel Rounds — case bank.
 * Each case: answer, system, aliases (optional), 6 clues ordered vague -> giveaway, pearl.
 * Adding or reordering cases reshuffles the daily schedule, so add new cases at launch
 * boundaries (see README). */
(function () {
  'use strict';
  const PR = (window.PR = window.PR || {});

  PR.SYSTEMS = ['Cardio', 'Pulm', 'Renal', 'GI', 'Heme/Onc', 'Neuro', 'Endo', 'Repro', 'MSK', 'Immuno', 'ID', 'Psych/Pharm', 'Biochem'];

  PR.CASES = [
    {
      answer: 'Myasthenia gravis', system: 'Neuro', aliases: ['MG'],
      clues: [
        '34-year-old woman with fatigue that gets worse as the day goes on.',
        'Double vision and droopy eyelids after reading for a while.',
        'Jaw gets tired toward the end of meals.',
        'An ice pack on the eyelid briefly improves the ptosis.',
        'CT chest shows an anterior mediastinal mass.',
        'Antibodies against postsynaptic acetylcholine receptors.'
      ],
      pearl: 'Autoantibodies block postsynaptic nicotinic ACh receptors, so weakness worsens with use. Look for thymoma or thymic hyperplasia. Treat with pyridostigmine, immunosuppression, and thymectomy.'
    },
    {
      answer: 'Lambert-Eaton myasthenic syndrome', system: 'Neuro', aliases: ['Lambert-Eaton', 'LEMS'],
      clues: [
        '62-year-old man with trouble climbing stairs and getting out of chairs.',
        '50 pack-year smoking history.',
        'Dry mouth and constipation.',
        'Reflexes are diminished.',
        'Strength briefly improves with repeated effort.',
        'Antibodies against presynaptic voltage-gated calcium channels.'
      ],
      pearl: 'Antibodies against presynaptic voltage-gated Ca²⁺ channels reduce ACh release. Strength improves briefly with repeated use, and autonomic symptoms are common. Strongly associated with small cell lung cancer.'
    },
    {
      answer: 'Kawasaki disease', system: 'Cardio',
      clues: [
        '3-year-old boy with a fever for 6 days that is not responding to antibiotics.',
        'Bilateral conjunctival injection without discharge.',
        'Red, cracked lips and a strawberry tongue.',
        'Swollen hands and feet; fingertips later peel.',
        'A single enlarged cervical lymph node.',
        'Untreated, it can cause coronary artery aneurysms.'
      ],
      pearl: 'Medium-vessel vasculitis of young children. Remember CRASH and burn: Conjunctivitis, Rash, Adenopathy, Strawberry tongue, Hands/feet changes, plus fever for 5+ days. Give IVIG and aspirin to protect the coronaries.'
    },
    {
      answer: 'Pheochromocytoma', system: 'Endo', aliases: ['Pheo'],
      clues: [
        '40-year-old woman with episodic headaches.',
        'Palpitations and drenching sweats during the episodes.',
        'BP is 210/120 during an attack and normal between them.',
        'Her father had medullary thyroid cancer.',
        'Elevated plasma free metanephrines.',
        'Needs alpha blockade before beta blockade and surgery.'
      ],
      pearl: 'Catecholamine-secreting tumor of adrenal medulla chromaffin cells. Associated with MEN2, VHL, and NF1. Start an α-blocker (phenoxybenzamine) before any β-blocker to avoid unopposed α-stimulation.'
    },
    {
      answer: 'Cystic fibrosis', system: 'Pulm', aliases: ['CF'],
      clues: [
        '2-year-old with poor weight gain despite a big appetite.',
        'Third pneumonia this year.',
        'Bulky, greasy, foul-smelling stools.',
        'Parents say her skin tastes salty when they kiss her.',
        'Had meconium ileus as a newborn.',
        'Elevated sweat chloride; mutation on chromosome 7.'
      ],
      pearl: 'Autosomal recessive CFTR defect (most often ΔF508) causes a misfolded chloride channel and thick secretions. Sweat chloride ≥60 mmol/L is diagnostic. Males are often infertile from absent vas deferens.'
    },
    {
      answer: 'Wilson disease', system: 'GI', aliases: ['Hepatolenticular degeneration'],
      clues: [
        '19-year-old man with a new tremor and clumsiness.',
        'Roommates notice mood swings; his grades are slipping.',
        'Elevated liver enzymes.',
        'Golden-brown rings at the edge of the cornea.',
        'Low serum ceruloplasmin.',
        'Autosomal recessive ATP7B mutation.'
      ],
      pearl: 'ATP7B mutation (chromosome 13) blocks copper excretion into bile and loading onto ceruloplasmin. Copper builds up in the liver, basal ganglia, and cornea (Kayser-Fleischer rings). Treat with penicillamine or trientine, or zinc.'
    },
    {
      answer: 'Goodpasture syndrome', system: 'Renal', aliases: ['Anti-GBM disease'],
      clues: [
        '25-year-old man coughing up blood.',
        'Cola-colored urine.',
        'Creatinine has tripled in two weeks.',
        'RBC casts on urinalysis.',
        'Linear IgG deposits on immunofluorescence.',
        'Antibodies against the α3 chain of type IV collagen.'
      ],
      pearl: 'Type II hypersensitivity against type IV collagen in glomerular and alveolar basement membranes. Linear IgG on immunofluorescence. Treat with plasmapheresis plus steroids and cyclophosphamide.'
    },
    {
      answer: 'Poststreptococcal glomerulonephritis', system: 'Renal', aliases: ['PSGN'],
      clues: [
        '8-year-old with puffy eyes in the morning.',
        'Dark, cola-colored urine.',
        'Blood pressure is elevated.',
        'Had a sore throat about two weeks ago.',
        'Low C3 complement.',
        'Subepithelial immune complex humps on electron microscopy.'
      ],
      pearl: 'Immune complex (type III) nephritic syndrome 2–4 weeks after group A strep pharyngitis, or longer after a skin infection. Low C3 and subepithelial humps. Most children recover fully.'
    },
    {
      answer: 'Minimal change disease', system: 'Renal', aliases: ['MCD', 'Lipoid nephrosis'],
      clues: [
        '4-year-old with swelling around the eyes and ankles.',
        'Parents notice foamy urine.',
        'Massive proteinuria, low albumin, high cholesterol.',
        'Blood pressure and kidney function are normal.',
        'Light microscopy of the biopsy looks normal.',
        'Podocyte foot process effacement; responds to steroids.'
      ],
      pearl: 'Most common nephrotic syndrome in children. Light microscopy looks normal, and EM shows podocyte foot process effacement. Selective albuminuria and an excellent response to corticosteroids.'
    },
    {
      answer: 'Celiac disease', system: 'GI', aliases: ['Gluten-sensitive enteropathy', 'Celiac sprue'],
      clues: [
        '28-year-old woman with chronic bloating and loose stools.',
        'Iron deficiency anemia that does not improve with oral iron.',
        'Itchy blisters on her elbows and knees.',
        'Positive anti-tissue transglutaminase IgA.',
        'Villous atrophy and crypt hyperplasia on duodenal biopsy.',
        'Associated with HLA-DQ2 and DQ8.'
      ],
      pearl: 'Autoimmune reaction to gliadin in gluten. Damage is worst in the distal duodenum and proximal jejunum. Dermatitis herpetiformis is the skin clue, and long-term risk includes enteropathy-associated T-cell lymphoma.'
    },
    {
      answer: 'Achalasia', system: 'GI',
      clues: [
        '45-year-old man with trouble swallowing.',
        'Difficulty with both solids and liquids from the start.',
        'Regurgitates undigested food and coughs at night.',
        'Barium swallow shows a bird\'s beak.',
        'Manometry: LES fails to relax and peristalsis is absent.',
        'Loss of inhibitory neurons in the myenteric plexus.'
      ],
      pearl: 'Loss of inhibitory NO/VIP neurons in the myenteric (Auerbach) plexus leaves the LES unable to relax. Chagas disease is a secondary cause. Slightly raises the risk of esophageal squamous cell carcinoma.'
    },
    {
      answer: 'Hereditary spherocytosis', system: 'Heme/Onc',
      clues: [
        '10-year-old with yellow eyes that come and go.',
        'Spleen tip is palpable.',
        'Gallstones at a young age.',
        'Elevated MCHC; direct Coombs test is negative.',
        'Positive EMA binding test with increased osmotic fragility.',
        'Defect in spectrin, ankyrin, or band 3.'
      ],
      pearl: 'Membrane protein defects make RBCs lose membrane and become spheres, which the spleen destroys. High MCHC and RDW, Coombs negative. Splenectomy corrects the anemia.'
    },
    {
      answer: 'G6PD deficiency', system: 'Heme/Onc', aliases: ['Glucose-6-phosphate dehydrogenase deficiency'],
      clues: [
        '24-year-old man with sudden fatigue and dark urine.',
        'Started trimethoprim-sulfamethoxazole two days ago.',
        'Indirect hyperbilirubinemia, high LDH, low haptoglobin.',
        'Heinz bodies on supravital stain.',
        'Bite cells on the peripheral smear.',
        'X-linked enzyme deficiency that lowers NADPH.'
      ],
      pearl: 'Without NADPH, RBCs cannot regenerate reduced glutathione under oxidant stress. Triggers include sulfa drugs, primaquine, dapsone, fava beans, and infection. Splenic macrophages remove Heinz bodies and leave bite cells.'
    },
    {
      answer: 'Multiple myeloma', system: 'Heme/Onc',
      clues: [
        '68-year-old man with low back pain.',
        'Fatigue and a normocytic anemia.',
        'Calcium and creatinine are both elevated.',
        'Punched-out lytic lesions on skull X-ray.',
        'Rouleaux on the smear and an M-spike on SPEP.',
        'Clonal plasma cells fill the bone marrow.'
      ],
      pearl: 'Clonal plasma cell neoplasm. Remember CRAB: hyperCalcemia, Renal injury, Anemia, Bone lytic lesions. Bence Jones light chains appear in the urine, and IL-6 drives growth.'
    },
    {
      answer: 'Chronic myeloid leukemia', system: 'Heme/Onc', aliases: ['CML', 'Chronic myelogenous leukemia'],
      clues: [
        '55-year-old man with fatigue and feeling full after small meals.',
        'Massive splenomegaly.',
        'WBC 120,000 with neutrophils at every stage of maturation.',
        'Basophilia on the smear.',
        'Low leukocyte alkaline phosphatase score.',
        'Philadelphia chromosome, t(9;22).'
      ],
      pearl: 't(9;22) creates the BCR-ABL fusion, a constitutively active tyrosine kinase. A low LAP score separates it from a leukemoid reaction. Imatinib targets BCR-ABL.'
    },
    {
      answer: 'Graves disease', system: 'Endo',
      clues: [
        '30-year-old woman losing weight despite eating more.',
        'Heat intolerance and a fine tremor.',
        'Diffuse, nontender goiter with a bruit.',
        'Bulging eyes and thickened skin on her shins.',
        'Low TSH, high free T4, diffuse uptake on scan.',
        'Antibodies that stimulate the TSH receptor.'
      ],
      pearl: 'TSH receptor-stimulating antibodies (type II hypersensitivity) drive diffuse hyperplasia. Ophthalmopathy and pretibial myxedema come from fibroblast activation and glycosaminoglycan buildup. Treat with methimazole, radioactive iodine, or surgery.'
    },
    {
      answer: 'Addison disease', system: 'Endo', aliases: ['Primary adrenal insufficiency'],
      clues: [
        '38-year-old woman with fatigue and weight loss.',
        'Craves salty foods.',
        'Darkened palmar creases and gums.',
        'Sodium is low and potassium is high.',
        'Low cortisol with high ACTH.',
        'Autoimmune destruction of the adrenal cortex.'
      ],
      pearl: 'Primary adrenal insufficiency, usually autoimmune in developed countries (TB in some regions). Losing aldosterone causes hyperkalemia and hyponatremia, and high ACTH/POMC causes hyperpigmentation. Secondary insufficiency spares both.'
    },
    {
      answer: 'Turner syndrome', system: 'Repro', aliases: ['45,X', 'Monosomy X'],
      clues: [
        '15-year-old girl who has never had a period.',
        'Short stature.',
        'Webbed neck and broad chest.',
        'Swollen hands and feet as a newborn.',
        'Bicuspid aortic valve and coarctation of the aorta.',
        'Karyotype shows a single X chromosome.'
      ],
      pearl: '45,X karyotype. Streak ovaries cause primary amenorrhea with high FSH. Also look for horseshoe kidney and cystic hygroma.'
    },
    {
      answer: 'Polycystic ovary syndrome', system: 'Repro', aliases: ['PCOS'],
      clues: [
        '24-year-old woman with irregular periods.',
        'Acne and excess facial hair.',
        'Dark, velvety skin on the back of her neck.',
        'Elevated LH-to-FSH ratio.',
        'Ultrasound shows many small peripheral ovarian follicles.',
        'Unopposed estrogen raises her endometrial cancer risk.'
      ],
      pearl: 'High LH drives ovarian androgen production, with insulin resistance as a key player. Weight loss and combined OCPs are first line. Letrozole or clomiphene for fertility.'
    },
    {
      answer: 'Duchenne muscular dystrophy', system: 'MSK', aliases: ['DMD'],
      clues: [
        '4-year-old boy who falls a lot.',
        'Waddling gait.',
        'Pushes off his thighs with his hands to stand up.',
        'Enlarged calves.',
        'CK is markedly elevated.',
        'X-linked frameshift deletion in the dystrophin gene.'
      ],
      pearl: 'Frameshift deletion in dystrophin, the largest human gene. Muscle is replaced by fat and fibrous tissue (pseudohypertrophy). Death often comes from dilated cardiomyopathy or respiratory failure; Becker is the milder in-frame form.'
    },
    {
      answer: 'Osteogenesis imperfecta', system: 'MSK', aliases: ['Brittle bone disease', 'OI'],
      clues: [
        '6-year-old with several fractures from minor falls.',
        'Child protective services was called after the last one.',
        'Blue-tinted sclerae.',
        'Discolored, translucent teeth.',
        'Father has hearing loss and the same eye color.',
        'Defective type I collagen (COL1A1/COL1A2).'
      ],
      pearl: 'Usually autosomal dominant mutations that impair type I collagen. Remember bones, eyes (blue sclerae), ears (hearing loss), and teeth. Easily mistaken for child abuse.'
    },
    {
      answer: 'Ankylosing spondylitis', system: 'MSK',
      clues: [
        '25-year-old man with low back pain and morning stiffness.',
        'Pain improves with exercise, not rest.',
        'Reduced chest expansion.',
        'Had a painful red eye last year.',
        'Bamboo spine on X-ray.',
        'HLA-B27 positive.'
      ],
      pearl: 'Seronegative spondyloarthropathy. Sacroiliitis and enthesitis lead to vertebral fusion. Watch for anterior uveitis and aortic regurgitation.'
    },
    {
      answer: 'Gout', system: 'MSK',
      clues: [
        '60-year-old man woken up by severe big toe pain.',
        'Recently started hydrochlorothiazide.',
        'The joint is red, swollen, and too tender to touch.',
        'Joint aspirate shows needle-shaped crystals.',
        'Crystals are negatively birefringent.',
        'Monosodium urate deposition.'
      ],
      pearl: 'Thiazides, alcohol, and purine-rich food raise urate. Acute flares: NSAIDs, colchicine, or steroids. Long-term: allopurinol or febuxostat. Pseudogout crystals are rhomboid and positively birefringent.'
    },
    {
      answer: 'Syphilis', system: 'ID', aliases: ['Secondary syphilis', 'Treponema pallidum'],
      clues: [
        '26-year-old man with a diffuse rash.',
        'Rash involves his palms and soles.',
        'A painless genital ulcer healed six weeks ago.',
        'Flat, moist, wart-like lesions in the groin.',
        'Positive RPR confirmed by FTA-ABS.',
        'Spirochete; treat with penicillin G.'
      ],
      pearl: 'Primary syphilis is a painless chancre. Secondary brings a diffuse rash including palms and soles, plus condylomata lata. Penicillin G is the drug of choice.'
    },
    {
      answer: 'Infectious mononucleosis', system: 'ID', aliases: ['Mono', 'EBV infection', 'Epstein-Barr virus'],
      clues: [
        '17-year-old with fatigue and a sore throat.',
        'Fever and posterior cervical lymphadenopathy.',
        'Spleen is enlarged.',
        'Got a rash after taking amoxicillin.',
        'Atypical lymphocytes on the smear.',
        'Positive heterophile antibody test.'
      ],
      pearl: 'EBV infects B cells through CD21; the atypical lymphocytes are reactive CD8+ T cells. The amoxicillin rash is classic. No contact sports while the spleen is enlarged.'
    },
    {
      answer: 'Clostridioides difficile infection', system: 'ID', aliases: ['C diff', 'C. difficile', 'Pseudomembranous colitis'],
      clues: [
        '72-year-old hospitalized woman with new watery diarrhea.',
        'Took clindamycin for cellulitis last week.',
        'Fever and WBC of 18,000.',
        'Gram-positive, spore-forming anaerobic rod.',
        'Yellow-white plaques on colonoscopy.',
        'Toxins A and B; treat with oral vancomycin.'
      ],
      pearl: 'Toxins A and B damage the colonic mucosa and form pseudomembranes. Clindamycin, fluoroquinolones, and cephalosporins are common culprits. First line is oral vancomycin or fidaxomicin.'
    },
    {
      answer: 'Parkinson disease', system: 'Neuro', aliases: ["Parkinson's disease"],
      clues: [
        '67-year-old man who has slowed down over the past year.',
        'Tremor in his hand at rest that improves when he reaches for something.',
        'Shuffling gait with reduced arm swing.',
        'Cogwheel rigidity.',
        'Lewy bodies containing α-synuclein.',
        'Loss of dopaminergic neurons in the substantia nigra.'
      ],
      pearl: 'Degeneration of the substantia nigra pars compacta reduces dopamine in the nigrostriatal pathway. Remember TRAP: Tremor at rest, Rigidity, Akinesia, Postural instability.'
    },
    {
      answer: 'Multiple sclerosis', system: 'Neuro', aliases: ['MS'],
      clues: [
        '28-year-old woman with blurry vision in one eye.',
        'Pain when she moves that eye.',
        'Months later, numbness in her legs.',
        'Symptoms worsen in a hot shower.',
        'Periventricular white matter plaques on MRI.',
        'Oligoclonal IgG bands in the CSF.'
      ],
      pearl: 'Autoimmune CNS demyelination separated in time and space. Optic neuritis, internuclear ophthalmoplegia, and Lhermitte sign are classic. High-dose steroids for flares; disease-modifying therapy to prevent relapses.'
    },
    {
      answer: 'Phenylketonuria', system: 'Biochem', aliases: ['PKU'],
      clues: [
        'Infant with developmental delay.',
        'A musty body odor.',
        'Fair skin and eczema.',
        'New seizures.',
        'Tyrosine has become an essential amino acid.',
        'Deficient phenylalanine hydroxylase.'
      ],
      pearl: 'Autosomal recessive loss of phenylalanine hydroxylase (or its cofactor BH4). Excess phenylalanine causes intellectual disability. Avoid phenylalanine, including aspartame, and supplement tyrosine.'
    },
    {
      answer: 'Neuroleptic malignant syndrome', system: 'Psych/Pharm', aliases: ['NMS'],
      clues: [
        '30-year-old man on an inpatient psychiatry unit with a fever of 40°C.',
        'Confused and hard to wake.',
        'Stiff all over, like a lead pipe.',
        'Blood pressure and heart rate swing wildly.',
        'CK is markedly elevated.',
        'Started haloperidol three days ago.'
      ],
      pearl: 'Reaction to dopamine antagonists. Remember FEVER: Fever, Encephalopathy, Vitals unstable, Elevated CK, Rigidity. Stop the drug and treat with dantrolene or bromocriptine plus supportive care.'
    },
    {
      answer: 'Aortic stenosis', system: 'Cardio',
      clues: [
        '75-year-old man with chest pain when he exerts himself.',
        'Passed out while climbing stairs.',
        'Short of breath on exertion.',
        'Weak and delayed carotid pulse.',
        'Crescendo-decrescendo systolic murmur at the right upper sternal border.',
        'Murmur radiates to the carotids.'
      ],
      pearl: 'Usually age-related calcification, or a bicuspid valve in younger patients. The classic triad is syncope, angina, and dyspnea. Symptomatic patients need valve replacement.'
    },
    {
      answer: 'Hypertrophic cardiomyopathy', system: 'Cardio', aliases: ['HCM', 'HOCM'],
      clues: [
        '17-year-old basketball player collapses during a game.',
        'An uncle died suddenly at age 30.',
        'Systolic murmur at the left sternal border.',
        'Murmur gets louder with Valsalva and standing.',
        'Asymmetric septal hypertrophy on echo.',
        'Autosomal dominant β-myosin heavy chain mutation.'
      ],
      pearl: 'Sarcomere mutations cause myofiber disarray. Anything that lowers preload (Valsalva, standing) worsens outflow obstruction and the murmur. A leading cause of sudden cardiac death in young athletes.'
    },
    {
      answer: 'Sarcoidosis', system: 'Pulm',
      clues: [
        '35-year-old woman with a dry cough.',
        'Short of breath on exertion.',
        'Tender red nodules on her shins.',
        'Bilateral hilar lymphadenopathy on chest X-ray.',
        'Hypercalcemia and elevated ACE.',
        'Noncaseating granulomas on biopsy.'
      ],
      pearl: 'Exaggerated CD4+ Th1 response forms noncaseating granulomas. Granuloma macrophages make 1α-hydroxylase, which raises vitamin D and calcium. Also watch for uveitis.'
    },
    {
      answer: 'DiGeorge syndrome', system: 'Immuno', aliases: ['22q11.2 deletion syndrome', 'Thymic aplasia'],
      clues: [
        'Newborn with seizures in the first days of life.',
        'Low serum calcium.',
        'Cleft palate and low-set ears.',
        'No thymic shadow on chest X-ray.',
        'Has truncus arteriosus.',
        'Microdeletion at 22q11.2.'
      ],
      pearl: 'Failure of the 3rd and 4th pharyngeal pouches. Remember CATCH-22: Cardiac defects, Abnormal facies, Thymic aplasia, Cleft palate, Hypocalcemia. T-cell deficiency leads to viral and fungal infections.'
    },
    {
      answer: 'SIADH', system: 'Endo', aliases: ['Syndrome of inappropriate antidiuretic hormone'],
      clues: [
        '65-year-old man brought in for new confusion.',
        '40 pack-year smoking history.',
        'Serum sodium is 121.',
        'Euvolemic on exam with no edema.',
        'Urine osmolality is high despite low serum osmolality.',
        'Central lung mass; sodium improves with fluid restriction.'
      ],
      pearl: 'Excess ADH causes euvolemic hyponatremia with inappropriately concentrated urine. Causes include small cell lung cancer, CNS disease, and drugs. Correct sodium slowly to avoid osmotic demyelination.'
    },
    // ===== Batch 2 (Oct 2026) =====
    {
      answer: 'Infective endocarditis', system: 'Cardio', aliases: ['Endocarditis', 'IE'],
      clues: [
        '32-year-old man with fevers and night sweats for two weeks.',
        'Track marks on both forearms.',
        'New holosystolic murmur at the left lower sternal border.',
        'Painless red macules on his palms and soles.',
        'Splinter hemorrhages under several fingernails.',
        'Blood cultures grow Staphylococcus aureus; vegetation on the tricuspid valve.'
      ],
      pearl: 'IV drug use favors right-sided (tricuspid) disease, most often from S. aureus. Janeway lesions are painless; Osler nodes are painful. Diagnose with blood cultures and echo using the Duke criteria.'
    },
    {
      answer: 'Acute rheumatic fever', system: 'Cardio', aliases: ['Rheumatic fever', 'ARF'],
      clues: [
        '9-year-old girl with fever and painful joints.',
        'The pain moves from her knees to her elbows over a week.',
        'Had an untreated sore throat three weeks ago.',
        'Jerky, involuntary movements of her hands.',
        'Elevated ASO titer.',
        'New mitral regurgitation murmur.'
      ],
      pearl: 'Antibodies to streptococcal M protein cross-react with self antigens (type II hypersensitivity). Major criteria spell JONES: Joints, carditis, Nodules, Erythema marginatum, Sydenham chorea. Long term, it scars the mitral valve and causes stenosis.'
    },
    {
      answer: 'Tetralogy of Fallot', system: 'Cardio', aliases: ['TOF', 'Tet'],
      clues: [
        '2-year-old who squats down after running around.',
        'Turns blue when he cries hard.',
        'Harsh systolic ejection murmur at the left upper sternal border.',
        'Boot-shaped heart on chest X-ray.',
        'Right ventricular hypertrophy and an overriding aorta.',
        'Anterosuperior displacement of the infundibular septum.'
      ],
      pearl: 'Remember PROVe: Pulmonary infundibular stenosis, RVH, Overriding aorta, VSD. Squatting raises systemic vascular resistance and pushes more blood through the lungs. Associated with 22q11 deletion.'
    },
    {
      answer: 'Coarctation of the aorta', system: 'Cardio', aliases: ['Aortic coarctation', 'Coarctation'],
      clues: [
        '16-year-old with frequent headaches.',
        'Blood pressure is 160/95 in both arms.',
        'Leg cramps when he runs.',
        'Weak, delayed femoral pulses.',
        'Notching of the lower rib borders on chest X-ray.',
        'Associated with bicuspid aortic valve and Turner syndrome.'
      ],
      pearl: 'Narrowing usually sits near the ligamentum arteriosum. Enlarged intercostal collaterals notch the ribs. The arm-leg blood pressure difference is the key exam finding.'
    },
    {
      answer: 'Giant cell arteritis', system: 'Cardio', aliases: ['Temporal arteritis', 'GCA'],
      clues: [
        '72-year-old woman with a new headache.',
        'Her scalp hurts when she brushes her hair.',
        'Jaw pain when chewing.',
        'Morning stiffness in her shoulders and hips.',
        'ESR is 95.',
        'Start steroids now to protect her vision, then biopsy.'
      ],
      pearl: 'Granulomatous large-vessel vasculitis of carotid branches, especially the temporal artery. Linked to polymyalgia rheumatica. Inflammation is segmental, so a negative biopsy does not rule it out.'
    },
    {
      answer: 'Pulmonary embolism', system: 'Pulm', aliases: ['PE'],
      clues: [
        '45-year-old woman with sudden shortness of breath.',
        'Sharp chest pain that is worse with a deep breath.',
        'Flew home from Tokyo yesterday.',
        'Heart rate 118; oxygen saturation 89%.',
        'Her left calf is swollen and tender.',
        'Filling defect in a pulmonary artery on CT angiography.'
      ],
      pearl: 'Most emboli come from deep veins of the legs. Virchow triad: stasis, endothelial injury, hypercoagulability. Expect V/Q mismatch with increased dead space and respiratory alkalosis from hyperventilation.'
    },
    {
      answer: 'Primary ciliary dyskinesia', system: 'Pulm', aliases: ['Kartagener syndrome', 'PCD'],
      clues: [
        '30-year-old man being evaluated for infertility.',
        'Lifelong chronic sinusitis.',
        'Recurrent bronchitis since childhood.',
        'His heart sounds are loudest on the right side of his chest.',
        'Semen analysis shows immotile sperm.',
        'Defective dynein arms in his cilia.'
      ],
      pearl: 'Autosomal recessive dynein defect impairs ciliary beating. With situs inversus it is called Kartagener syndrome. Expect bronchiectasis and low nasal nitric oxide.'
    },
    {
      answer: 'Alpha-1 antitrypsin deficiency', system: 'Pulm', aliases: ['A1AT deficiency', 'AATD'],
      clues: [
        '38-year-old man with worsening shortness of breath.',
        'He has never smoked.',
        'Emphysema concentrated in the lower lobes.',
        'Elevated liver enzymes.',
        'PAS-positive globules in hepatocytes on liver biopsy.',
        'PiZZ genotype.'
      ],
      pearl: 'Without enough α1-antitrypsin, neutrophil elastase destroys alveolar walls, causing panacinar emphysema. Misfolded protein builds up in the hepatocyte ER and causes cirrhosis. Smoking speeds lung damage dramatically.'
    },
    {
      answer: 'Tension pneumothorax', system: 'Pulm',
      clues: [
        '22-year-old man brought in after a motorcycle crash.',
        'Severe shortness of breath and chest pain.',
        'Absent breath sounds on the right.',
        'Trachea is deviated to the left.',
        'BP 78/40 with distended neck veins.',
        'Needs immediate needle decompression.'
      ],
      pearl: 'Air enters the pleural space and cannot escape, collapsing the lung and shifting the mediastinum. Reduced venous return causes hypotension. Diagnose clinically and decompress before imaging.'
    },
    {
      answer: 'Neonatal respiratory distress syndrome', system: 'Pulm', aliases: ['Hyaline membrane disease', 'NRDS'],
      clues: [
        'Baby boy born at 29 weeks.',
        'Grunting and nasal flaring within hours of birth.',
        'Retractions between the ribs.',
        'His mother has poorly controlled gestational diabetes.',
        'Ground-glass lungs with air bronchograms on chest X-ray.',
        'Lack of surfactant.'
      ],
      pearl: 'Low surfactant raises alveolar surface tension and causes collapse. Risk factors: prematurity, maternal diabetes (fetal insulin suppresses surfactant), and C-section. A lecithin:sphingomyelin ratio under 1.5 predicts it; antenatal steroids help prevent it.'
    },
    {
      answer: 'IgA nephropathy', system: 'Renal', aliases: ['Berger disease'],
      clues: [
        '22-year-old man with red urine.',
        'It started two days after a cold.',
        'Says this has happened twice before.',
        'Blood pressure and complement levels are normal.',
        'Mesangial proliferation on kidney biopsy.',
        'Mesangial IgA deposits on immunofluorescence.'
      ],
      pearl: 'Most common glomerulonephritis worldwide. Hematuria appears within days of a mucosal infection, unlike the 2–4 week lag in PSGN. Related to IgA vasculitis (Henoch-Schönlein purpura).'
    },
    {
      answer: 'Alport syndrome', system: 'Renal', aliases: ['Hereditary nephritis'],
      clues: [
        '12-year-old boy with blood in his urine.',
        'Has trouble hearing his teacher.',
        'Eye exam shows a cone-shaped lens.',
        'His maternal uncle needed a kidney transplant.',
        'Basket-weave splitting of the glomerular basement membrane on EM.',
        'Mutation in type IV collagen.'
      ],
      pearl: 'Usually an X-linked type IV collagen defect (α3, α4, or α5 chains). Remember: can\'t see, can\'t pee, can\'t hear high C. Progresses to kidney failure.'
    },
    {
      answer: 'Granulomatosis with polyangiitis', system: 'Renal', aliases: ['GPA', 'Wegener granulomatosis'],
      clues: [
        '45-year-old man with a constantly bloody, crusty nose.',
        'Sinusitis that will not respond to antibiotics.',
        'Coughing up blood.',
        'The bridge of his nose has collapsed.',
        'Cavitary lung nodules and RBC casts in the urine.',
        'PR3-ANCA (c-ANCA) positive.'
      ],
      pearl: 'Necrotizing small-vessel vasculitis with granulomas that hits the upper airway, lungs, and kidneys. c-ANCA targets proteinase 3. Treat with steroids plus rituximab or cyclophosphamide.'
    },
    {
      answer: 'Renal cell carcinoma', system: 'Renal', aliases: ['RCC'],
      clues: [
        '62-year-old man who smokes.',
        'Blood in his urine.',
        'Dull pain in his left flank.',
        'A new left-sided varicocele.',
        'Hematocrit is elevated.',
        'Polygonal clear cells; loss of the VHL gene on chromosome 3.'
      ],
      pearl: 'Classic triad is hematuria, flank pain, and a mass, though few patients have all three. Paraneoplastic EPO, PTHrP, renin, or ACTH. Likes to invade the renal vein, which on the left can cause a varicocele.'
    },
    {
      answer: 'Autosomal dominant polycystic kidney disease', system: 'Renal', aliases: ['ADPKD', 'Polycystic kidney disease'],
      clues: [
        '40-year-old man with flank pain.',
        'High blood pressure.',
        'His father is on dialysis.',
        'Both kidneys feel enlarged and lumpy on exam.',
        'Many cysts in both kidneys and the liver on ultrasound.',
        'PKD1 mutation on chromosome 16.'
      ],
      pearl: 'PKD1 (chromosome 16) or PKD2 (chromosome 4). Associated with berry aneurysms, mitral valve prolapse, and liver cysts. Hypertension comes from renin release by compressed kidney tissue.'
    },
    {
      answer: 'Crohn disease', system: 'GI', aliases: ["Crohn's disease"],
      clues: [
        '24-year-old woman with crampy right lower quadrant pain.',
        'Chronic diarrhea and weight loss.',
        'Painful sores in her mouth.',
        'Perianal fistula.',
        'Skip lesions and cobblestone mucosa on colonoscopy.',
        'Transmural inflammation with noncaseating granulomas.'
      ],
      pearl: 'Can involve anywhere from mouth to anus, most often the terminal ileum. Transmural disease causes fistulas and strictures (string sign). Smoking worsens Crohn disease, unlike ulcerative colitis.'
    },
    {
      answer: 'Hirschsprung disease', system: 'GI', aliases: ['Congenital aganglionic megacolon'],
      clues: [
        'Newborn who has not passed meconium at 48 hours.',
        'Distended abdomen.',
        'Bilious vomiting.',
        'A rectal exam releases a burst of stool and gas.',
        'He has Down syndrome.',
        'Rectal biopsy shows no ganglion cells.'
      ],
      pearl: 'Failed neural crest migration leaves the distal colon without Meissner and Auerbach plexuses. Associated with RET mutations and Down syndrome. Treat by resecting the aganglionic segment.'
    },
    {
      answer: 'Pyloric stenosis', system: 'GI', aliases: ['Hypertrophic pyloric stenosis'],
      clues: [
        '4-week-old firstborn boy.',
        'Vomits after every feed.',
        'The vomit is forceful and not bilious.',
        'Hungry again right after vomiting.',
        'Olive-shaped mass in the epigastrium.',
        'Hypochloremic, hypokalemic metabolic alkalosis.'
      ],
      pearl: 'Pyloric muscle hypertrophy, typically at 2–6 weeks. Linked to macrolide exposure in early infancy. Correct the electrolytes first, then pyloromyotomy.'
    },
    {
      answer: 'Hemochromatosis', system: 'GI', aliases: ['Hereditary hemochromatosis'],
      clues: [
        '50-year-old man with fatigue and joint pain.',
        'Erectile dysfunction.',
        'His skin has a bronze tint.',
        'New diabetes.',
        'Transferrin saturation 85% with a very high ferritin.',
        'HFE gene mutation (C282Y).'
      ],
      pearl: 'Autosomal recessive HFE mutation increases intestinal iron absorption. Think "bronze diabetes" plus cirrhosis and cardiomyopathy. Treat with repeated phlebotomy; women present later because menstruation removes iron.'
    },
    {
      answer: 'Primary biliary cholangitis', system: 'GI', aliases: ['PBC', 'Primary biliary cirrhosis'],
      clues: [
        '48-year-old woman with fatigue.',
        'Itching that is worst at night.',
        'Yellow plaques on her eyelids.',
        'Alkaline phosphatase is markedly elevated.',
        'She also has Sjögren syndrome.',
        'Antimitochondrial antibodies.'
      ],
      pearl: 'Autoimmune destruction of small intrahepatic bile ducts with lymphocytes and granulomas. Associated with other autoimmune diseases. First-line therapy is ursodeoxycholic acid.'
    },
    {
      answer: 'Sickle cell disease', system: 'Heme/Onc', aliases: ['Sickle cell anemia', 'HbSS'],
      clues: [
        '7-year-old boy with severe pain in his back and legs.',
        'It started after a long soccer game in the heat.',
        'Had painful, swollen hands as a toddler.',
        'Howell-Jolly bodies on the smear.',
        'Crescent-shaped red cells.',
        'Valine replaces glutamate at position 6 of β-globin.'
      ],
      pearl: 'HbS polymerizes when deoxygenated, causing vaso-occlusion and hemolysis. Autosplenectomy raises risk from encapsulated organisms and Salmonella osteomyelitis. Hydroxyurea raises protective fetal hemoglobin.'
    },
    {
      answer: 'Paroxysmal nocturnal hemoglobinuria', system: 'Heme/Onc', aliases: ['PNH'],
      clues: [
        '35-year-old with fatigue.',
        'Dark urine first thing in the morning.',
        'Pancytopenia on labs.',
        'Clot in a hepatic vein.',
        'Coombs-negative intravascular hemolysis.',
        'Flow cytometry shows cells missing CD55 and CD59.'
      ],
      pearl: 'An acquired PIGA mutation prevents GPI anchors, so complement inhibitors CD55 and CD59 are missing and complement lyses red cells. Thrombosis is the main cause of death. Eculizumab blocks C5.'
    },
    {
      answer: 'Hodgkin lymphoma', system: 'Heme/Onc', aliases: ['Hodgkin disease'],
      clues: [
        '22-year-old woman with a painless lump in her neck.',
        'Night sweats and weight loss.',
        'The lump aches when she drinks alcohol.',
        'Mediastinal mass on chest X-ray.',
        'Had mono as a teenager.',
        'Owl-eye cells that are CD15+ and CD30+.'
      ],
      pearl: 'Reed-Sternberg cells are the malignant B cells. Bimodal age peaks; nodular sclerosis is the most common subtype. Contiguous nodal spread makes staging predictable.'
    },
    {
      answer: 'Thrombotic thrombocytopenic purpura', system: 'Heme/Onc', aliases: ['TTP'],
      clues: [
        '30-year-old woman with headache and confusion.',
        'Fever.',
        'Petechiae on her legs.',
        'Low platelets and a rising creatinine.',
        'Schistocytes on the smear; PT and PTT are normal.',
        'Autoantibodies against ADAMTS13.'
      ],
      pearl: 'Without ADAMTS13, huge vWF multimers build platelet microthrombi. Classic pentad: fever, hemolytic anemia, low platelets, renal and neurologic symptoms. Treat urgently with plasma exchange and avoid platelet transfusion.'
    },
    {
      answer: 'Hemophilia A', system: 'Heme/Onc', aliases: ['Factor VIII deficiency'],
      clues: [
        '3-year-old boy with a swollen, painful knee after a minor fall.',
        'Bled heavily after his circumcision.',
        'His maternal uncle had the same problem.',
        'Prolonged PTT with a normal PT.',
        'Normal platelet count.',
        'Low factor VIII activity.'
      ],
      pearl: 'X-linked recessive. Bleeding into joints and deep tissues points to a clotting factor problem rather than platelets. Hemophilia B is factor IX; desmopressin helps mild hemophilia A.'
    },
    {
      answer: 'Pernicious anemia', system: 'Heme/Onc', aliases: ['B12 deficiency', 'Vitamin B12 deficiency'],
      clues: [
        '60-year-old woman with fatigue and pale skin.',
        'Tingling in her feet.',
        'Decreased vibration and position sense.',
        'MCV is 118.',
        'Hypersegmented neutrophils and high methylmalonic acid.',
        'Antibodies against intrinsic factor.'
      ],
      pearl: 'Autoimmune destruction of parietal cells blocks B12 absorption. B12 deficiency damages the dorsal columns and lateral corticospinal tracts. High methylmalonic acid separates it from folate deficiency; gastric cancer risk is increased.'
    },
    {
      answer: 'Guillain-Barré syndrome', system: 'Neuro', aliases: ['GBS', 'Acute inflammatory demyelinating polyneuropathy', 'AIDP'],
      clues: [
        '34-year-old man with tingling in his feet.',
        'Weakness climbing up from his legs over a few days.',
        'Had diarrhea two weeks ago.',
        'Reflexes are absent.',
        'Weakness on both sides of his face.',
        'CSF has high protein with a normal cell count.'
      ],
      pearl: 'Autoimmune attack on Schwann cells after infection, classically Campylobacter jejuni. Monitor breathing closely. Treat with IVIG or plasmapheresis, not steroids.'
    },
    {
      answer: 'Amyotrophic lateral sclerosis', system: 'Neuro', aliases: ['ALS', 'Lou Gehrig disease'],
      clues: [
        '55-year-old man dropping things with his right hand.',
        'Muscle twitches in his arms.',
        'Wasting of his hand muscles.',
        'Brisk reflexes and upgoing toes.',
        'Trouble swallowing; sensation is normal.',
        'Some familial cases involve SOD1.'
      ],
      pearl: 'Degeneration of both upper and lower motor neurons with no sensory loss. Eye movements and bladder control are usually spared. Riluzole modestly extends survival.'
    },
    {
      answer: 'Huntington disease', system: 'Neuro', aliases: ["Huntington's disease"],
      clues: [
        '42-year-old man who has become irritable and depressed.',
        'Trouble planning and remembering.',
        'Dance-like, writhing movements.',
        'His father had the same symptoms, starting later in life.',
        'Atrophy of the caudate nuclei on MRI.',
        'CAG repeat expansion on chromosome 4.'
      ],
      pearl: 'Autosomal dominant with anticipation, especially when inherited from the father. Loss of GABAergic neurons in the caudate. Tetrabenazine, a dopamine depleter, helps the chorea.'
    },
    {
      answer: 'Wernicke encephalopathy', system: 'Neuro', aliases: ['Wernicke'],
      clues: [
        '50-year-old man brought in confused.',
        'Long history of heavy drinking.',
        'Unsteady, wide-based gait.',
        'Nystagmus and trouble moving his eyes to the side.',
        'He got worse after IV dextrose.',
        'Thiamine (B1) deficiency.'
      ],
      pearl: 'Classic triad: confusion, ophthalmoplegia, ataxia. Damages the mammillary bodies. Give thiamine before glucose; untreated, it can progress to Korsakoff syndrome with memory loss and confabulation.'
    },
    {
      answer: 'Subarachnoid hemorrhage', system: 'Neuro', aliases: ['SAH'],
      clues: [
        '45-year-old woman with a sudden headache.',
        'She calls it the worst headache of her life.',
        'Stiff neck and vomiting.',
        'She has polycystic kidney disease.',
        'Blood in the basal cisterns on CT.',
        'Ruptured berry aneurysm.'
      ],
      pearl: 'Usually a ruptured saccular aneurysm, most often at the anterior communicating artery. Risk factors include ADPKD, Ehlers-Danlos, and hypertension. Nimodipine reduces harm from vasospasm, which peaks days later.'
    },
    {
      answer: 'Cushing syndrome', system: 'Endo', aliases: ["Cushing's syndrome", 'Hypercortisolism'],
      clues: [
        '35-year-old woman with weight gain.',
        'Fat collects around her belly, upper back, and face.',
        'Wide purple stretch marks on her abdomen.',
        'Easy bruising and weak thighs.',
        'New high blood sugar and blood pressure.',
        'High 24-hour urine cortisol that does not suppress with low-dose dexamethasone.'
      ],
      pearl: 'Most common cause is steroid medication; next is an ACTH-secreting pituitary adenoma (Cushing disease). High-dose dexamethasone suppresses pituitary sources but not ectopic ACTH. ACTH level separates adrenal from ACTH-driven causes.'
    },
    {
      answer: 'Primary hyperaldosteronism', system: 'Endo', aliases: ['Conn syndrome', 'Hyperaldosteronism'],
      clues: [
        '45-year-old man whose blood pressure won\'t come down on three drugs.',
        'Muscle weakness and cramps.',
        'Potassium is 2.9.',
        'Mild metabolic alkalosis.',
        'High aldosterone with low renin.',
        'Adrenal adenoma on CT.'
      ],
      pearl: 'Called Conn syndrome when an adenoma is the cause; bilateral hyperplasia is also common. No edema thanks to aldosterone escape. Treat with spironolactone or eplerenone, or surgery for an adenoma.'
    },
    {
      answer: 'Hashimoto thyroiditis', system: 'Endo', aliases: ["Hashimoto's thyroiditis", 'Chronic lymphocytic thyroiditis'],
      clues: [
        '45-year-old woman with fatigue.',
        'Always cold.',
        'Weight gain and constipation.',
        'Painless, firm, enlarged thyroid.',
        'High TSH with low free T4.',
        'Anti-thyroid peroxidase antibodies.'
      ],
      pearl: 'Most common cause of hypothyroidism where iodine is sufficient. Lymphocytic infiltrate with germinal centers and Hürthle cells. Raises the risk of primary thyroid lymphoma.'
    },
    {
      answer: 'Diabetic ketoacidosis', system: 'Endo', aliases: ['DKA'],
      clues: [
        '14-year-old girl with abdominal pain and vomiting.',
        'Thirsty and urinating constantly; she has lost weight.',
        'Deep, rapid breathing.',
        'Fruity smell on her breath.',
        'Glucose 540 with an anion gap of 26.',
        'High serum β-hydroxybutyrate.'
      ],
      pearl: 'Insulin deficiency drives lipolysis and ketone production. Total body potassium is low even when the serum level looks normal or high. Treat with IV fluids, insulin, and potassium.'
    },
    {
      answer: 'Central diabetes insipidus', system: 'Endo', aliases: ['Central DI'],
      clues: [
        '30-year-old man recovering from a head injury.',
        'Urinating huge volumes.',
        'Craves ice water.',
        'Serum sodium 149 with very dilute urine.',
        'Urine stays dilute after water deprivation.',
        'Urine concentrates after desmopressin.'
      ],
      pearl: 'Lack of ADH from the hypothalamus or posterior pituitary. Nephrogenic DI looks the same but does not respond to desmopressin (think lithium). Treat with desmopressin.'
    },
    {
      answer: 'Klinefelter syndrome', system: 'Repro', aliases: ['47,XXY', 'XXY'],
      clues: [
        '25-year-old man being evaluated for infertility.',
        'Tall with long arms and legs.',
        'Breast tissue enlargement.',
        'Small, firm testes.',
        'High FSH and LH with low testosterone.',
        'An extra X chromosome.'
      ],
      pearl: 'Hyalinized seminiferous tubules lower inhibin and raise FSH; Leydig cell dysfunction lowers testosterone and raises LH. A Barr body is present. Increased risk of male breast cancer.'
    },
    {
      answer: 'Kallmann syndrome', system: 'Repro',
      clues: [
        '17-year-old boy with no signs of puberty.',
        'No facial or body hair.',
        'He cannot smell his food.',
        'Small testes.',
        'Low LH, FSH, and testosterone.',
        'GnRH neurons failed to migrate during development.'
      ],
      pearl: 'Hypogonadotropic hypogonadism with anosmia. GnRH and olfactory neurons fail to migrate from the olfactory placode. Treat with pulsatile GnRH or sex hormone replacement.'
    },
    {
      answer: 'Androgen insensitivity syndrome', system: 'Repro', aliases: ['AIS', 'Testicular feminization'],
      clues: [
        '16-year-old girl who has never had a period.',
        'Normal breast development.',
        'Little to no pubic or armpit hair.',
        'Short, blind-ending vagina; no uterus on ultrasound.',
        'Gonads found in the inguinal canals.',
        '46,XY karyotype with high testosterone.'
      ],
      pearl: 'Defective androgen receptor. Sertoli cell AMH removes Müllerian structures, while missing androgen action prevents male external genitalia. Gonads are removed after puberty because of cancer risk.'
    },
    {
      answer: 'Ectopic pregnancy', system: 'Repro', aliases: ['Tubal pregnancy'],
      clues: [
        '28-year-old woman with lower abdominal pain.',
        'Her last period was 7 weeks ago.',
        'Light vaginal spotting.',
        'History of pelvic inflammatory disease.',
        'Positive hCG that is rising more slowly than expected.',
        'No intrauterine pregnancy on transvaginal ultrasound.'
      ],
      pearl: 'Most implant in the ampulla of the fallopian tube. Risk factors include prior PID, tubal surgery, and a prior ectopic. Rupture causes hemorrhage; stable patients may get methotrexate.'
    },
    {
      answer: 'Preeclampsia', system: 'Repro', aliases: ['Pre-eclampsia'],
      clues: [
        '32-year-old woman at 34 weeks of pregnancy.',
        'Headache that won\'t go away.',
        'Swelling in her face and hands.',
        'Blood pressure 165/110.',
        'Protein on urine dipstick.',
        'Abnormal remodeling of placental spiral arteries.'
      ],
      pearl: 'New hypertension after 20 weeks with proteinuria or end-organ damage. Poor spiral artery remodeling leads to placental ischemia and endothelial dysfunction. Magnesium sulfate prevents seizures (eclampsia); delivery is the cure.'
    },
    {
      answer: 'Rheumatoid arthritis', system: 'MSK', aliases: ['RA'],
      clues: [
        '45-year-old woman with pain in both hands.',
        'Morning stiffness lasting over an hour.',
        'Swollen MCP and PIP joints; DIP joints are spared.',
        'Firm nodules on her forearms.',
        'Bone erosions near the joints on X-ray.',
        'Anti-CCP antibodies.'
      ],
      pearl: 'Autoimmune synovitis forms a pannus that erodes cartilage and bone. Associated with HLA-DR4. Methotrexate is the first-line DMARD.'
    },
    {
      answer: 'Marfan syndrome', system: 'MSK',
      clues: [
        '19-year-old college basketball player.',
        'Tall with very long fingers.',
        'His eye lens dislocated upward.',
        'His sternum is sunken in.',
        'Dilated aortic root on echo.',
        'Mutation in fibrillin-1.'
      ],
      pearl: 'Autosomal dominant FBN1 mutation on chromosome 15. Aortic dissection is the main cause of death. The lens dislocates upward, versus downward in homocystinuria.'
    },
    {
      answer: 'Reactive arthritis', system: 'MSK', aliases: ['Reiter syndrome'],
      clues: [
        '25-year-old man with a painful, swollen knee.',
        'Burning with urination.',
        'Red, irritated eyes.',
        'Treated for chlamydia a month ago.',
        'Pain where his Achilles tendon attaches.',
        'HLA-B27 positive.'
      ],
      pearl: 'Seronegative spondyloarthropathy after GI (Shigella, Salmonella, Yersinia, Campylobacter) or GU (Chlamydia) infection. Classic triad: arthritis, urethritis, conjunctivitis. Usually resolves within a year.'
    },
    {
      answer: 'Paget disease of bone', system: 'MSK', aliases: ['Osteitis deformans', 'Paget disease'],
      clues: [
        '68-year-old man with aching bones.',
        'His hats no longer fit.',
        'Losing his hearing.',
        'Alkaline phosphatase is very high on its own.',
        'Calcium and phosphate are normal.',
        'Mosaic pattern of lamellar bone on biopsy.'
      ],
      pearl: 'Disordered osteoclast and osteoblast activity in lytic, mixed, and sclerotic phases. Complications include high-output heart failure and osteosarcoma. Treat with bisphosphonates.'
    },
    {
      answer: 'Dermatomyositis', system: 'MSK',
      clues: [
        '50-year-old woman who struggles to climb stairs.',
        'Can\'t lift her arms to brush her hair.',
        'Purple discoloration of her upper eyelids.',
        'Red, scaly bumps over her knuckles.',
        'Elevated CK and anti-Mi-2 antibodies.',
        'Workup should look for a hidden cancer.'
      ],
      pearl: 'Symmetric proximal weakness with a heliotrope rash and Gottron papules. Perimysial inflammation with perifascicular atrophy. Associated with occult malignancy, often ovarian.'
    },
    {
      answer: 'Bruton agammaglobulinemia', system: 'Immuno', aliases: ['X-linked agammaglobulinemia', 'XLA'],
      clues: [
        '9-month-old boy with his third ear infection.',
        'Pneumonia twice this year.',
        'Infections began around 6 months of age.',
        'Tiny tonsils and no palpable lymph nodes.',
        'All immunoglobulin classes are low; almost no B cells.',
        'X-linked tyrosine kinase mutation.'
      ],
      pearl: 'BTK defect blocks B-cell maturation, so infections start as maternal IgG fades. Recurrent bacterial infections and enteroviruses. Avoid live vaccines; give IVIG.'
    },
    {
      answer: 'Severe combined immunodeficiency', system: 'Immuno', aliases: ['SCID'],
      clues: [
        '4-month-old with thrush that keeps coming back.',
        'Chronic diarrhea and failure to thrive.',
        'Recurrent viral infections and Pneumocystis pneumonia.',
        'No thymic shadow on chest X-ray.',
        'Very low T cells.',
        'Most often an IL-2 receptor γ chain defect or adenosine deaminase deficiency.'
      ],
      pearl: 'Defective T- and B-cell immunity. X-linked IL-2Rγ defect is most common; ADA deficiency is autosomal recessive. Avoid live vaccines; stem cell transplant is curative.'
    },
    {
      answer: 'Wiskott-Aldrich syndrome', system: 'Immuno', aliases: ['WAS'],
      clues: [
        '1-year-old boy with eczema.',
        'Bloody diarrhea.',
        'Easy bruising and petechiae.',
        'Recurrent ear infections.',
        'Low platelet count with small platelets.',
        'X-linked WAS gene mutation.'
      ],
      pearl: 'Triad: thrombocytopenia, eczema, recurrent infections. Low IgM with high IgE and IgA. Increased risk of autoimmunity and lymphoma; stem cell transplant is curative.'
    },
    {
      answer: 'Chronic granulomatous disease', system: 'Immuno', aliases: ['CGD'],
      clues: [
        '3-year-old boy with recurrent skin abscesses.',
        'Pneumonia caused by Aspergillus.',
        'Liver abscess growing Staphylococcus aureus.',
        'Every infection is a catalase-positive organism.',
        'Abnormal dihydrorhodamine test.',
        'Defective NADPH oxidase.'
      ],
      pearl: 'Neutrophils cannot make superoxide for the respiratory burst. Catalase-positive organisms (S. aureus, Aspergillus, Burkholderia, Serratia, Nocardia) destroy their own H₂O₂. Most often X-linked.'
    },
    {
      answer: 'Systemic lupus erythematosus', system: 'Immuno', aliases: ['SLE', 'Lupus'],
      clues: [
        '26-year-old woman with fatigue and joint pain.',
        'Rash across her cheeks after time in the sun.',
        'Painless mouth ulcers.',
        'Chest pain when she breathes in.',
        'Protein in the urine with low C3 and C4.',
        'Anti-dsDNA and anti-Smith antibodies.'
      ],
      pearl: 'Immune complex (type III) disease. ANA is sensitive; anti-dsDNA and anti-Smith are specific, and anti-dsDNA tracks with nephritis. Leading causes of death are kidney disease, infection, and cardiovascular disease.'
    },
    {
      answer: 'Tuberculosis', system: 'ID', aliases: ['TB'],
      clues: [
        '40-year-old man who recently moved from the Philippines.',
        'Cough for two months.',
        'Night sweats and weight loss.',
        'Coughed up blood yesterday.',
        'Cavitary lesion in the right upper lobe.',
        'Acid-fast bacilli in the sputum.'
      ],
      pearl: 'Mycobacterium tuberculosis survives in macrophages by blocking phagolysosome fusion; cord factor drives granulomas. Primary infection forms a Ghon complex, and reactivation favors the apices. Standard therapy is RIPE.'
    },
    {
      answer: 'Lyme disease', system: 'ID', aliases: ['Borreliosis'],
      clues: [
        '35-year-old woman with fatigue and muscle aches.',
        'Went hiking in Connecticut last month.',
        'Expanding red rash with a clear center on her thigh.',
        'Now one side of her face droops.',
        'Episode of heart block.',
        'Borrelia burgdorferi spread by Ixodes ticks.'
      ],
      pearl: 'Early localized: erythema migrans. Early disseminated: facial palsy, AV block, migratory pain. Late: large-joint arthritis. Doxycycline is first line for most cases.'
    },
    {
      answer: 'Rocky Mountain spotted fever', system: 'ID', aliases: ['RMSF'],
      clues: [
        '10-year-old with high fever and headache.',
        'Went camping in North Carolina last week.',
        'A rash began on his wrists and ankles.',
        'The rash then spread toward his trunk.',
        'Rash involves his palms and soles.',
        'Rickettsia rickettsii; treat with doxycycline.'
      ],
      pearl: 'Tick-borne rickettsia infects endothelial cells and causes vasculitis. The rash spreads from the extremities inward. Doxycycline is used even in young children because the disease can be fatal.'
    },
    {
      answer: 'Legionnaires disease', system: 'ID', aliases: ["Legionnaires' disease", 'Legionella pneumonia', 'Legionella'],
      clues: [
        '65-year-old man with high fever and cough.',
        'Just returned from a cruise.',
        'Watery diarrhea.',
        'Confused.',
        'Sodium is 128.',
        'Gram-negative rod that grows on charcoal yeast extract.'
      ],
      pearl: 'Legionella pneumophila spreads through aerosolized water, not person to person. It stains poorly on Gram stain, so use the urine antigen test. Treat with a macrolide or fluoroquinolone.'
    },
    {
      answer: 'Botulism', system: 'ID', aliases: ['Infant botulism'],
      clues: [
        '4-month-old who seems unusually floppy.',
        'Constipated for a week.',
        'Weak cry and a poor suck.',
        'Drooping eyelids.',
        'Parents dip his pacifier in honey.',
        'A toxin that blocks acetylcholine release.'
      ],
      pearl: 'Clostridium botulinum toxin cleaves SNARE proteins, preventing ACh release and causing descending flaccid paralysis. Infants ingest spores, often from honey; adults ingest preformed toxin. Infants get botulism immune globulin.'
    },
    {
      answer: 'Serotonin syndrome', system: 'Psych/Pharm',
      clues: [
        '28-year-old woman with agitation and confusion.',
        'Temperature is 39.5°C.',
        'Diarrhea and heavy sweating.',
        'Brisk reflexes and rhythmic jerking of her ankles.',
        'Takes sertraline and was just prescribed tramadol.',
        'Treat with cyproheptadine.'
      ],
      pearl: 'Too much serotonin from combining serotonergic drugs (SSRIs, MAOIs, tramadol, linezolid, triptans). Clonus and hyperreflexia set it apart from the lead-pipe rigidity of NMS. Onset is fast, usually within 24 hours.'
    },
    {
      answer: 'Lithium toxicity', system: 'Psych/Pharm', aliases: ['Lithium overdose'],
      clues: [
        '40-year-old woman with vomiting and diarrhea.',
        'Coarse tremor in her hands.',
        'Unsteady on her feet.',
        'Confused and slurring her words.',
        'Recently started hydrochlorothiazide.',
        'Her mood stabilizer level is 3.2 mEq/L.'
      ],
      pearl: 'Narrow therapeutic index. Thiazides, ACE inhibitors, and NSAIDs raise lithium levels. Chronic use can cause nephrogenic DI and hypothyroidism; severe toxicity needs hemodialysis.'
    },
    {
      answer: 'Anticholinergic toxicity', system: 'Psych/Pharm', aliases: ['Anticholinergic syndrome'],
      clues: [
        '19-year-old brought in agitated and hallucinating.',
        'Temperature is 39°C.',
        'Skin is hot, flushed, and dry.',
        'Pupils are widely dilated.',
        'Urinary retention and quiet bowel sounds.',
        'Took a large amount of diphenhydramine.'
      ],
      pearl: 'Hot as a hare, dry as a bone, red as a beet, blind as a bat, mad as a hatter. Causes include antihistamines, TCAs, atropine, and jimsonweed. Physostigmine crosses the blood-brain barrier and reverses it.'
    },
    {
      answer: 'Malignant hyperthermia', system: 'Psych/Pharm',
      clues: [
        '25-year-old man in the middle of knee surgery.',
        'End-tidal CO₂ suddenly rises.',
        'His jaw muscles go rigid.',
        'Temperature climbs to 41°C.',
        'Received succinylcholine and sevoflurane.',
        'Mutation in the ryanodine receptor (RYR1).'
      ],
      pearl: 'Uncontrolled calcium release from the sarcoplasmic reticulum after inhaled anesthetics or succinylcholine. Autosomal dominant. Treat with dantrolene.'
    },
    {
      answer: 'Acetaminophen toxicity', system: 'Psych/Pharm', aliases: ['Acetaminophen overdose', 'Tylenol overdose'],
      clues: [
        '17-year-old brought in 8 hours after a large ingestion.',
        'Mild nausea; otherwise feels fine.',
        'Two days later, right upper quadrant pain.',
        'AST and ALT above 5,000.',
        'Centrilobular necrosis on liver biopsy.',
        'Antidote is N-acetylcysteine.'
      ],
      pearl: 'Excess drug is shunted to CYP450, producing NAPQI, which depletes glutathione. Zone 3 hepatocytes are hit first. N-acetylcysteine restores glutathione and works best within 8 hours.'
    },
    {
      answer: 'Maple syrup urine disease', system: 'Biochem', aliases: ['MSUD'],
      clues: [
        '5-day-old who is feeding poorly.',
        'Vomiting and lethargy.',
        'Alternates between stiff and floppy.',
        'Seizures.',
        'Urine smells sweet, like burnt sugar.',
        'Defect in branched-chain α-ketoacid dehydrogenase.'
      ],
      pearl: 'Autosomal recessive block in breaking down isoleucine, leucine, and valine ("I Love Vermont maple syrup"). Treat with dietary restriction and thiamine supplementation.'
    },
    {
      answer: 'Classic galactosemia', system: 'Biochem', aliases: ['Galactosemia'],
      clues: [
        '1-week-old who is feeding poorly.',
        'Vomiting and jaundice after breastfeeding.',
        'Enlarged liver.',
        'Cataracts on eye exam.',
        'E. coli in the blood cultures.',
        'Galactose-1-phosphate uridyltransferase deficiency.'
      ],
      pearl: 'Toxic galactose-1-phosphate builds up in the liver, kidney, and brain, and galactitol in the lens causes cataracts. Classic association with E. coli sepsis. Remove galactose and lactose from the diet.'
    },
    {
      answer: 'Von Gierke disease', system: 'Biochem', aliases: ['Glycogen storage disease type I', 'GSD I'],
      clues: [
        '4-month-old with a protruding belly.',
        'Round, doll-like face.',
        'Shaky and sweaty between feeds.',
        'Massive hepatomegaly.',
        'Lactic acidosis, high triglycerides, high uric acid.',
        'Glucose-6-phosphatase deficiency.'
      ],
      pearl: 'Type I glycogen storage disease. Glycogen cannot be turned into free glucose, causing severe fasting hypoglycemia. Treat with frequent meals and cornstarch; avoid fructose and galactose.'
    },
    {
      answer: 'Tay-Sachs disease', system: 'Biochem', aliases: ['GM2 gangliosidosis'],
      clues: [
        '6-month-old who is losing milestones.',
        'Exaggerated startle to sounds.',
        'Parents are of Ashkenazi Jewish descent.',
        'Liver and spleen are normal size.',
        'Cherry-red spot on the macula.',
        'Hexosaminidase A deficiency.'
      ],
      pearl: 'Autosomal recessive lysosomal storage disease with GM2 ganglioside buildup and onion-skin lysosomes. Niemann-Pick also has a cherry-red spot but adds hepatosplenomegaly.'
    },
    {
      answer: 'Lesch-Nyhan syndrome', system: 'Biochem', aliases: ['HGPRT deficiency'],
      clues: [
        '1-year-old boy with developmental delay.',
        'Orange, sand-like crystals in his diapers.',
        'Writhing movements and dystonia.',
        'Bites his lips and fingers.',
        'High serum uric acid.',
        'X-linked HGPRT deficiency.'
      ],
      pearl: 'Defective purine salvage drives de novo purine synthesis and uric acid production. Features include gout, self-injury, intellectual disability, and dystonia. Allopurinol or febuxostat lowers uric acid but does not fix the neurologic signs.'
    }
  ];

  // Plausible wrong answers, grouped by system. Same-system guesses show yellow.
  PR.DECOYS = {
    'Cardio': ['Cardiac tamponade', 'Atrial septal defect', 'Ventricular septal defect', 'Patent ductus arteriosus', 'Transposition of the great arteries', 'Polyarteritis nodosa', 'Takayasu arteritis', 'Giant cell arteritis', 'Aortic regurgitation', 'Mitral stenosis', 'Mitral valve prolapse', 'Infective endocarditis', 'Dilated cardiomyopathy', 'Acute rheumatic fever', 'Coarctation of the aorta', 'Constrictive pericarditis'],
    'Pulm': ['Asbestosis', 'Silicosis', 'Spontaneous pneumothorax', 'Acute respiratory distress syndrome', 'Asthma', 'COPD', 'Pulmonary embolism', 'Idiopathic pulmonary fibrosis', 'Primary ciliary dyskinesia', 'Small cell lung cancer', 'Alpha-1 antitrypsin deficiency', 'Hypersensitivity pneumonitis'],
    'Renal': ['Diabetic nephropathy', 'Renal artery stenosis', 'Lupus nephritis', 'Rapidly progressive glomerulonephritis', 'IgA nephropathy', 'Membranous nephropathy', 'Alport syndrome', 'Focal segmental glomerulosclerosis', 'Granulomatosis with polyangiitis', 'Acute tubular necrosis', 'Membranoproliferative glomerulonephritis', 'Renal cell carcinoma'],
    'GI': ['Acute pancreatitis', 'Pancreatic adenocarcinoma', 'Gilbert syndrome', 'Dubin-Johnson syndrome', 'Meckel diverticulum', 'Intussusception', 'Peptic ulcer disease', 'Hemochromatosis', 'Crohn disease', 'Ulcerative colitis', 'Zenker diverticulum', 'Diffuse esophageal spasm', 'Primary biliary cholangitis', 'Hirschsprung disease', 'Whipple disease', 'Primary sclerosing cholangitis', 'Plummer-Vinson syndrome'],
    'Heme/Onc': ['Iron deficiency anemia', 'Burkitt lymphoma', 'Hemolytic uremic syndrome', 'Immune thrombocytopenia', 'von Willebrand disease', 'Disseminated intravascular coagulation', 'Folate deficiency', 'Hemophilia B', 'Sickle cell disease', 'Beta thalassemia', 'Paroxysmal nocturnal hemoglobinuria', 'Warm autoimmune hemolytic anemia', 'Waldenström macroglobulinemia', 'Chronic lymphocytic leukemia', 'Polycythemia vera', 'Essential thrombocythemia', 'Acute myeloid leukemia', 'Hodgkin lymphoma', 'Pyruvate kinase deficiency'],
    'Neuro': ['Epidural hematoma', 'Subdural hematoma', 'Brown-Séquard syndrome', 'Syringomyelia', 'Neurofibromatosis type 1', 'Tuberous sclerosis', 'Alzheimer disease', 'Normal pressure hydrocephalus', 'Friedreich ataxia', 'Korsakoff syndrome', 'Guillain-Barré syndrome', 'Amyotrophic lateral sclerosis', 'Huntington disease', 'Dementia with Lewy bodies', 'Essential tremor', 'Neuromyelitis optica', 'Progressive supranuclear palsy', 'Botulism', 'Wernicke encephalopathy'],
    'Endo': ['Nephrogenic diabetes insipidus', 'Thyroid storm', 'Primary hyperparathyroidism', 'Prolactinoma', 'Acromegaly', 'MEN 1', 'Hyperosmolar hyperglycemic state', 'Hashimoto thyroiditis', 'Toxic multinodular goiter', 'Subacute granulomatous thyroiditis', 'Cushing syndrome', 'Primary hyperaldosteronism', 'Carcinoid syndrome', 'Central diabetes insipidus', 'Secondary adrenal insufficiency', 'Congenital adrenal hyperplasia', 'Medullary thyroid carcinoma'],
    'Repro': ['Complete hydatidiform mole', 'Placental abruption', 'Placenta previa', 'HELLP syndrome', 'Ovarian torsion', '5-alpha-reductase deficiency', 'Klinefelter syndrome', 'Kallmann syndrome', 'Androgen insensitivity syndrome', 'Endometriosis', 'Noonan syndrome', 'Premature ovarian failure', 'Sheehan syndrome'],
    'MSK': ['Systemic sclerosis', 'Sjögren syndrome', 'Polymyalgia rheumatica', 'Osteoarthritis', 'Septic arthritis', 'Osteosarcoma', 'Becker muscular dystrophy', 'Rheumatoid arthritis', 'Pseudogout', 'Reactive arthritis', 'Psoriatic arthritis', 'Marfan syndrome', 'Ehlers-Danlos syndrome', 'Polymyositis', 'Dermatomyositis', 'Osteopetrosis', 'Achondroplasia'],
    'Immuno': ['Hereditary angioedema', 'Common variable immunodeficiency', 'Ataxia-telangiectasia', 'Antiphospholipid syndrome', 'Drug-induced lupus', 'Bruton agammaglobulinemia', 'Severe combined immunodeficiency', 'Wiskott-Aldrich syndrome', 'Chronic granulomatous disease', 'Hyper-IgE syndrome', 'Selective IgA deficiency', 'Leukocyte adhesion deficiency', 'Chédiak-Higashi syndrome'],
    'ID': ['Malaria', 'Bacterial meningitis', 'Pneumocystis pneumonia', 'Histoplasmosis', 'Cholera', 'Typhoid fever', 'Toxoplasmosis', 'Leptospirosis', 'Lyme disease', 'Cytomegalovirus infection', 'Acute HIV infection', 'Streptococcal pharyngitis', 'Toxic shock syndrome', 'Shigellosis', 'Giardiasis', 'Rocky Mountain spotted fever', 'Tuberculosis'],
    'Psych/Pharm': ['Delirium tremens', 'Opioid overdose', 'Salicylate toxicity', 'Tricyclic antidepressant overdose', 'Organophosphate poisoning', 'Carbon monoxide poisoning', 'Serotonin syndrome', 'Malignant hyperthermia', 'Anticholinergic toxicity', 'Lithium toxicity', 'Tardive dyskinesia', 'Acute dystonia'],
    'Biochem': ['Gaucher disease', 'Niemann-Pick disease', 'Fabry disease', 'Hurler syndrome', 'Hunter syndrome', 'McArdle disease', 'Hereditary fructose intolerance', 'Maple syrup urine disease', 'Alkaptonuria', 'Homocystinuria', 'Classic galactosemia', 'Von Gierke disease', 'Pompe disease', 'Tay-Sachs disease', 'Ornithine transcarbamylase deficiency']
  };

  // ---------- Diagnosis bank + matching ----------
  const norm = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/'s\b/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  PR.norm = norm;

  const bank = [];
  const seen = new Set();
  PR.CASES.forEach((c) => {
    bank.push({ name: c.answer, system: c.system, keys: [c.answer].concat(c.aliases || []).map(norm) });
    seen.add(norm(c.answer));
  });
  Object.keys(PR.DECOYS).forEach((sys) => {
    PR.DECOYS[sys].forEach((name) => {
      if (seen.has(norm(name))) return;
      seen.add(norm(name));
      bank.push({ name, system: sys, keys: [norm(name)] });
    });
  });
  bank.sort((a, b) => a.name.localeCompare(b.name));
  PR.BANK = bank;

  PR.findEntry = function (text) {
    const q = norm(text);
    if (!q) return null;
    return bank.find((e) => e.keys.includes(q)) || null;
  };

  PR.suggest = function (text, exclude) {
    const q = norm(text);
    if (!q) return [];
    const single = q.length === 1; // one letter: list every diagnosis starting with it
    const out = [];
    bank.forEach((e) => {
      if (exclude && exclude.includes(e.name)) return;
      let best = 99;
      e.keys.forEach((k, i) => {
        let s = 99;
        if (k.startsWith(q)) s = 0;
        else if (single) s = 99;
        else if (k.split(' ').some((w) => w.startsWith(q))) s = 1;
        else if (k.includes(q)) s = 2;
        if (s < 99 && i > 0) s += 0.5; // alias match ranks just below a name match
        best = Math.min(best, s);
      });
      if (best < 99) out.push({ e, s: best });
    });
    out.sort((a, b) => a.s - b.s || a.e.name.localeCompare(b.e.name));
    return out.map((x) => x.e);
  };

  // ---------- Daily schedule ----------
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  PR.rng = mulberry32;

  // Every full pass through the bank uses a fresh shuffle, so no case repeats within a cycle.
  PR.caseIndexForDay = function (day) {
    const n = PR.CASES.length;
    const cycle = Math.floor(day / n);
    const pos = ((day % n) + n) % n;
    const order = Array.from({ length: n }, (_, i) => i);
    const rnd = mulberry32(9137 + cycle * 7919);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order[pos];
  };
})();
