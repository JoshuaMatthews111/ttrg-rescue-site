export interface Dog {
  id: string;
  name: string;
  age: string;
  breed: string;
  gender: string;
  weight: string;
  price: number;
  funded: number;
  story: string;
  fullStory: string;
  image: string;
  gallery: string[];
  urgent: boolean;
  stage: "rescue" | "rehabilitate" | "train" | "recover" | "rehome";
  stageColor: string;
  medicalNeeds: string;
  trainingNeeds: string;
  behaviorNotes: string;
  specialNeeds: string;
  location: string;
}

export const dogs: Dog[] = [
  {
    id: "bailey",
    name: "Bailey",
    age: "2 yrs old",
    breed: "Mixed Breed",
    gender: "Female",
    weight: "35 lbs",
    price: 35,
    funded: 35,
    story: "Bailey was found scared and underweight, hiding under a porch during a thunderstorm. She's slowly learning to trust again.",
    fullStory: "Bailey was discovered by a concerned neighbor, huddled under a porch during a severe thunderstorm. She was severely underweight, dehydrated, and terrified of human contact. When our rescue team arrived, it took over two hours just to coax her out. In the weeks since her rescue, Bailey has made remarkable progress. She now takes treats from her handler's hand and has started wagging her tail during feeding time. She still flinches at loud noises and needs patience with new people, but every day she takes one more step toward healing. With continued rehabilitation, training, and love, Bailey will blossom into the loving companion she was always meant to be.",
    image: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&q=80",
      "https://images.unsplash.com/photo-1596854273338-cbf078ec7071?w=800&q=80",
      "https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=800&q=80",
    ],
    urgent: true,
    stage: "rehabilitate",
    stageColor: "bg-amber-500",
    medicalNeeds: "Needs weight gain program, flea treatment completed, dental cleaning scheduled",
    trainingNeeds: "Basic trust building, leash introduction, socialization with calm dogs",
    behaviorNotes: "Fearful of loud noises, hand-shy, improving daily with consistent positive reinforcement",
    specialNeeds: "High-calorie diet for weight recovery, quiet environment preferred",
    location: "Houston, TX",
  },
  {
    id: "tucker",
    name: "Tucker",
    age: "3 yrs old",
    breed: "Labrador Mix",
    gender: "Male",
    weight: "55 lbs",
    price: 40,
    funded: 60,
    story: "Tucker was surrendered when his family lost their home. He's gentle but heartbroken, waiting for someone to love him again.",
    fullStory: "Tucker's world fell apart when his family lost their home and had to surrender him to an overcrowded shelter. For three weeks, he refused to eat and would press his face against the kennel door, waiting for his family to return. When our team took him in, Tucker was emotionally devastated but physically healthy. He's an incredibly gentle soul who loves belly rubs and will lean his entire body weight against you for comfort. He's making great progress in our rehabilitation program, learning that new people can be trusted and that love can come from unexpected places. Tucker needs a patient, loving home that will give him the stability he craves.",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
      "https://images.unsplash.com/photo-1477884213360-7e9d7dcc8f9b?w=800&q=80",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",
    ],
    urgent: false,
    stage: "train",
    stageColor: "bg-emerald-500",
    medicalNeeds: "Up to date on vaccinations, neutered, healthy",
    trainingNeeds: "Leash manners, basic obedience refresher, confidence building",
    behaviorNotes: "Separation anxiety improving, gentle with children, good with other dogs",
    specialNeeds: "Needs a home with a consistent daily routine",
    location: "Houston, TX",
  },
  {
    id: "daisy",
    name: "Daisy",
    age: "1 yr old",
    breed: "Pit Bull Mix",
    gender: "Female",
    weight: "42 lbs",
    price: 30,
    funded: 45,
    story: "Daisy was found chained in a backyard with no food or water. Despite everything, she still wags her tail at every person she meets.",
    fullStory: "Daisy was rescued from a neglect situation where she had been chained to a tree in a backyard with no shelter, food, or clean water. Despite the cruelty she endured, Daisy's spirit remains unbroken. She greets every person with a wagging tail and soft eyes full of hope. Her resilience is nothing short of miraculous. Since arriving at our facility, Daisy has gained 8 pounds, her coat is growing back healthy and shiny, and she's learning basic commands with enthusiasm. She's playful, smart, and incredibly eager to please. Daisy dreams of a home where she'll never be chained again—where she can run, play, and sleep on a warm bed.",
    image: "https://images.unsplash.com/photo-1629740067905-bd3f515aa739?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1629740067905-bd3f515aa739?w=800&q=80",
      "https://images.unsplash.com/photo-1583337130417-13571fc377ad?w=800&q=80",
      "https://images.unsplash.com/photo-1601758174114-e711c8c4b03f?w=800&q=80",
    ],
    urgent: false,
    stage: "recover",
    stageColor: "bg-blue-500",
    medicalNeeds: "Weight gain program, skin treatment for irritation from chain, spay scheduled",
    trainingNeeds: "Basic obedience, crate training, socialization",
    behaviorNotes: "Extremely friendly, food-motivated, pulls on leash (improving)",
    specialNeeds: "Needs gradual introduction to indoor living",
    location: "Houston, TX",
  },
  {
    id: "shadow",
    name: "Shadow",
    age: "5 yrs old",
    breed: "Labrador Retriever",
    gender: "Male",
    weight: "65 lbs",
    price: 45,
    funded: 30,
    story: "Shadow was found wandering a highway, confused and limping. He needs surgery and rehabilitation before he can find his forever home.",
    fullStory: "Shadow was spotted by a truck driver wandering along a busy highway at night, limping badly on his front right leg. When animal control brought him in, X-rays revealed an old fracture that had healed incorrectly, causing chronic pain. Shadow is a senior boy with the gentlest eyes you've ever seen. Despite his pain, he never growled or snapped during his exam—he just looked up at the vet with quiet trust. He needs corrective surgery, physical rehabilitation, and a peaceful home where he can finally rest. Shadow has so much love left to give. He just needs someone to give him the chance.",
    image: "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80",
    ],
    urgent: true,
    stage: "rescue",
    stageColor: "bg-red-500",
    medicalNeeds: "Corrective leg surgery needed, pain management, physical therapy",
    trainingNeeds: "Minimal—well-mannered, knows basic commands",
    behaviorNotes: "Calm, gentle, great with people, tolerant of handling",
    specialNeeds: "Low-impact exercise only, orthopedic bed recommended, surgery funding needed",
    location: "Houston, TX",
  },
  {
    id: "prince",
    name: "Prince",
    age: "1 yr old",
    breed: "Doberman Mix",
    gender: "Male",
    weight: "48 lbs",
    price: 35,
    funded: 20,
    story: "Prince had severe behavioral challenges—jumping, pulling, running away. He's in serious need of training to keep him and others safe.",
    fullStory: "Prince is a 1 year old Doberman mix who came to us with significant behavioral challenges. He had a history of jumping on people, pulling hard on the leash, and running away from his previous owners. While these behaviors stem from a lack of early training and socialization—not aggression—they made him unsafe in a home environment. Prince is incredibly intelligent and eager to learn, which makes him an excellent candidate for our rehabilitation training program. With professional guidance, structured routines, and positive reinforcement, Prince is already showing improvement. He needs a sponsor to fund his continued training and an experienced adopter who can maintain his progress.",
    image: "/ttrg/dogs/prince.jpg",
    gallery: [
      "/ttrg/dogs/prince.jpg",
      "/ttrg/testimonial-photo.jpg",
    ],
    urgent: true,
    stage: "train",
    stageColor: "bg-emerald-500",
    medicalNeeds: "Neutered, vaccinations current, healthy",
    trainingNeeds: "Impulse control, leash training, recall training, boundary setting",
    behaviorNotes: "High energy, intelligent, responds well to structure, needs experienced handler",
    specialNeeds: "Needs daily exercise and mental stimulation, fenced yard preferred",
    location: "Houston, TX",
  },
  {
    id: "luna",
    name: "Luna",
    age: "3 yrs old",
    breed: "Staffordshire Mix",
    gender: "Female",
    weight: "38 lbs",
    price: 40,
    funded: 15,
    story: "Luna was found alone in an abandoned lot, scared and trembling. She's timid but slowly opening up with gentle, patient care.",
    fullStory: "Luna was found curled up alone in an abandoned lot, trembling and barely responsive. She had been fending for herself for weeks, surviving on scraps and rainwater. When rescuers approached, she didn't run—she just looked up with wide, frightened eyes, too exhausted to move. Luna is naturally shy and cautious around new people, but with patience and quiet reassurance, she's slowly beginning to trust. She now takes treats gently from her handler's hand and has started exploring the yard during supervised playtime. Luna needs a calm, stable home where she can decompress and learn at her own pace. With love and time, she'll become the loyal, gentle companion she's meant to be.",
    image: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=800&q=80",
      "https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=800&q=80",
    ],
    urgent: false,
    stage: "rehabilitate",
    stageColor: "bg-amber-500",
    medicalNeeds: "Spayed, vaccinations current, dental cleaning needed",
    trainingNeeds: "Leash training, socialization with new dogs, basic commands",
    behaviorNotes: "Shy and timid, warming up slowly, responds well to calm voices",
    specialNeeds: "Needs quiet environment, patient adopter, gradual introductions",
    location: "Houston, TX",
  },
];

export function getDogById(id: string): Dog | undefined {
  return dogs.find((d) => d.id === id);
}

export const donationTiers = [
  { amount: 25, label: "Food Support", desc: "Provides nutritious meals for one week" },
  { amount: 50, label: "Basic Care", desc: "Covers medicine, flea treatment, and basic vet needs" },
  { amount: 100, label: "Vet & Nutrition", desc: "Specialized food, supplements, and veterinary support" },
  { amount: 250, label: "Training & Rehab", desc: "Funds professional training or rehabilitation sessions" },
];
