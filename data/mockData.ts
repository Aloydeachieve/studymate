export interface Material {
  id: string;
  title: string;
  type: "pdf" | "docx" | "txt";
  subject: string;
  date: string;
  pageCount: number;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  title: string;
  description: string;
  timeLimit: number;
  questions: Question[];
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export const mockMaterials: Material[] = [
  {
    id: "1",
    title: "Introduction to Machine Learning.pdf",
    type: "pdf",
    subject: "Computer Science",
    date: "2 hours ago",
    pageCount: 15,
  },
  {
    id: "2",
    title: "World War II - European Front.docx",
    type: "docx",
    subject: "History",
    date: "Yesterday",
    pageCount: 8,
  },
  {
    id: "3",
    title: "Organic Chemistry 101.pdf",
    type: "pdf",
    subject: "Chemistry",
    date: "3 days ago",
    pageCount: 22,
  },
  {
    id: "4",
    title: "Marketing Strategy Fundamentals.txt",
    type: "txt",
    subject: "Business",
    date: "1 week ago",
    pageCount: 4,
  },
];

const mockQuizzes: Record<string, Quiz> = {
  "1": {
    title: "Machine Learning Basics Quiz",
    description: "Test your understanding of ML concepts based on your upload.",
    timeLimit: 300,
    questions: [
      {
        id: 1,
        question: "What is the primary goal of supervised learning?",
        options: [
          "To discover hidden patterns in unlabeled data",
          "To learn a mapping from inputs to outputs using labeled data",
          "To group similar data points together",
          "To reduce the dimensionality of data",
        ],
        correctAnswer: 1,
        explanation:
          "Supervised learning uses labeled pairs (input, output) to learn a function that maps inputs to outputs.",
      },
      {
        id: 2,
        question:
          "Which of these is a common problem in training neural networks?",
        options: [
          "Underfitting only",
          "Overfitting",
          "Perfect prediction",
          "Linearity",
        ],
        correctAnswer: 1,
        explanation:
          "Overfitting is a common issue where the model learns the training data too well, failing to generalize to new data.",
      },
      {
        id: 3,
        question: "What is a 'feature' in the context of machine learning?",
        options: [
          "An error in the code",
          "An individual measurable property or characteristic of a phenomenon",
          "The output of the model",
          "The hardware used for training",
        ],
        correctAnswer: 1,
        explanation:
          "A feature is an input variable used in making predictions.",
      },
      {
        id: 4,
        question: "Which algorithm is used for classification?",
        options: [
          "Linear Regression",
          "Logistic Regression",
          "K-Means Clustering",
          "PCA",
        ],
        correctAnswer: 1,
        explanation:
          "Despite its name, Logistic Regression is a classification algorithm used to predict binary outcomes.",
      },
      {
        id: 5,
        question: "What does NLP stand for?",
        options: [
          "Neural Linear Processing",
          "Natural Language Processing",
          "Network Level Protocol",
          "None of the above",
        ],
        correctAnswer: 1,
        explanation:
          "NLP stands for Natural Language Processing, a field of AI concerned with the interaction between computers and human language.",
      },
    ],
  },
  "2": {
    title: "World War II History Quiz",
    description: "Assess your knowledge of the European Front.",
    timeLimit: 300,
    questions: [
      {
        id: 1,
        question: "When did World War II begin in Europe?",
        options: ["1938", "1939", "1940", "1941"],
        correctAnswer: 1,
        explanation:
          "WWII began on September 1, 1939, with the German invasion of Poland.",
      },
      {
        id: 2,
        question: "Which operation was the Allied invasion of Normandy?",
        options: [
          "Operation Barbarossa",
          "Operation Overlord",
          "Operation Market Garden",
          "Operation Torch",
        ],
        correctAnswer: 1,
        explanation:
          "Operation Overlord was the codename for the Battle of Normandy.",
      },
      {
        id: 3,
        question: "Who was the Prime Minister of the UK during most of WWII?",
        options: [
          "Neville Chamberlain",
          "Clement Attlee",
          "Winston Churchill",
          "Anthony Eden",
        ],
        correctAnswer: 2,
        explanation:
          "Winston Churchill served as Prime Minister from 1940 to 1945.",
      },
      {
        id: 4,
        question:
          "Which battle represents the turning point on the Eastern Front?",
        options: [
          "Battle of Berlin",
          "Battle of Stalingrad",
          "Battle of Moscow",
          "Battle of Kursk",
        ],
        correctAnswer: 1,
        explanation:
          "The Battle of Stalingrad (1942-1943) is widely considered the turning point of the war on the Eastern Front.",
      },
      {
        id: 5,
        question: "What was the 'Blitz'?",
        options: [
          "A German tank tactic",
          "The German bombing campaign against Britain",
          "The Allied counter-offensive",
          "A type of aircraft",
        ],
        correctAnswer: 1,
        explanation:
          "The Blitz was the sustained strategic bombing campaign conducted by Nazi Germany against the UK.",
      },
    ],
  },
  "3": {
    title: "Organic Chemistry Fundamentals",
    description: "Quiz on basic organic chemistry concepts.",
    timeLimit: 300,
    questions: [
      {
        id: 1,
        question: "What is the primary element in organic compounds?",
        options: ["Oxygen", "Nitrogen", "Carbon", "Hydrogen"],
        correctAnswer: 2,
        explanation:
          "Organic chemistry is the study of the structure, properties, and reactions of carbon-containing compounds.",
      },
      {
        id: 2,
        question: "Which functional group characterizes alcohols?",
        options: ["-COOH", "-OH", "-NH2", "-CHO"],
        correctAnswer: 1,
        explanation:
          "Alcohols are characterized by the presence of a hydroxyl (-OH) group.",
      },
      {
        id: 3,
        question: "What holds the two strands of DNA together?",
        options: [
          "Ionic bonds",
          "Covalent bonds",
          "Hydrogen bonds",
          "Metallic bonds",
        ],
        correctAnswer: 2,
        explanation:
          "The two strands of DNA are held together by hydrogen bonds between complementary base pairs.",
      },
      {
        id: 4,
        question: "What is an isomer?",
        options: [
          "Atoms with different number of neutrons",
          "Molecules with the same molecular formula but different structures",
          "Charged atoms",
          "None of the above",
        ],
        correctAnswer: 1,
        explanation:
          "Isomers are molecules that share the same molecular formula but have different structural arrangements of atoms.",
      },
      {
        id: 5,
        question: "Which of these is a saturated hydrocarbon?",
        options: ["Ethene", "Ethyne", "Ethane", "Benzene"],
        correctAnswer: 2,
        explanation:
          "Ethane matches the general formula CnH(2n+2) and contains only single bonds, making it saturated.",
      },
    ],
  },
  "4": {
    title: "Marketing Strategy Quiz",
    description: "Test your knowledge on marketing fundamentals.",
    timeLimit: 300,
    questions: [
      {
        id: 1,
        question: "What are the 4 Ps of marketing?",
        options: [
          "Product, Price, Place, Promotion",
          "People, Process, Physical Evidence, Product",
          "Planning, Production, Pricing, Promotion",
          "None of the above",
        ],
        correctAnswer: 0,
        explanation:
          "The 4 Ps are the foundational model of marketing: Product, Price, Place, and Promotion.",
      },
      {
        id: 2,
        question: "What is a target market?",
        options: [
          "All potential customers",
          "A specific group of consumers a business aims to serve",
          "The stock market",
          "Competitors in the industry",
        ],
        correctAnswer: 1,
        explanation:
          "A target market is a specific group of people that a business has decided to aim its marketing efforts and merchandise towards.",
      },
      {
        id: 3,
        question: "What does SWOT analysis stand for?",
        options: [
          "Strengths, Weaknesses, Opportunities, Threats",
          "Sales, Work, Organization, Team",
          "Strategy, Work, Objectives, Tactics",
          "Support, Work, Order, Time",
        ],
        correctAnswer: 0,
        explanation:
          "SWOT analysis determines Strengths, Weaknesses, Opportunities, and Threats for a business.",
      },
      {
        id: 4,
        question: "Which is an example of inbound marketing?",
        options: [
          "TV Commercials",
          "Cold Calling",
          "Content Marketing / Blogging",
          "Billboards",
        ],
        correctAnswer: 2,
        explanation:
          "Content marketing attracts customers by creating valuable content, which is a key aspect of inbound marketing.",
      },
      {
        id: 5,
        question: "What is Brand Equity?",
        options: [
          "The financial value of a brand",
          "The number of employees",
          "The location of the headquarters",
          "The stock price",
        ],
        correctAnswer: 0,
        explanation:
          "Brand equity refers to a value premium that a company generates from a product with a recognizable name when compared to a generic equivalent.",
      },
    ],
  },
};

const mockFlashcards: Record<string, Flashcard[]> = {
  "1": [
    {
      id: 1,
      front: "Supervised Learning",
      back: "A type of ML where the model is trained on labeled data.",
      category: "ML Basics",
      difficulty: "Easy",
    },
    {
      id: 2,
      front: "Unsupervised Learning",
      back: "A type of ML where the model finds patterns in unlabeled data.",
      category: "ML Basics",
      difficulty: "Medium",
    },
    {
      id: 3,
      front: "Reinforcement Learning",
      back: "Learning by interacting with an environment and receiving rewards or penalties.",
      category: "ML Basics",
      difficulty: "Hard",
    },
    {
      id: 4,
      front: "Neural Network",
      back: "A series of algorithms that endeavor to recognize underlying relationships in a set of data through a process that mimics the way the human brain operates.",
      category: "Deep Learning",
      difficulty: "Medium",
    },
    {
      id: 5,
      front: "Overfitting",
      back: "A modeling error that occurs when a function is too closely fit to a limited set of data points.",
      category: "Model Evaluation",
      difficulty: "Medium",
    },
  ],
  "2": [
    {
      id: 1,
      front: "Blitzkrieg",
      back: "A military campaign intended to bring about a swift victory.",
      category: "Tactics",
      difficulty: "Medium",
    },
    {
      id: 2,
      front: "D-Day",
      back: "June 6, 1944, the day of the Allied invasion of Normandy.",
      category: "Events",
      difficulty: "Easy",
    },
    {
      id: 3,
      front: "Axis Powers",
      back: "Germany, Italy, and Japan.",
      category: "Alliances",
      difficulty: "Easy",
    },
    {
      id: 4,
      front: "Allied Powers",
      back: "Great Britain, France, Soviet Union, United States, and China.",
      category: "Alliances",
      difficulty: "Easy",
    },
    {
      id: 5,
      front: "The Holocaust",
      back: "The genocide of European Jews during World War II.",
      category: "Events",
      difficulty: "Hard",
    },
  ],
  "3": [
    {
      id: 1,
      front: "Covalent Bond",
      back: "A chemical bond that involves the sharing of electron pairs between atoms.",
      category: "Bonding",
      difficulty: "Easy",
    },
    {
      id: 2,
      front: "Hydrocarbon",
      back: "An organic compound consisting entirely of hydrogen and carbon.",
      category: "Compounds",
      difficulty: "Easy",
    },
    {
      id: 3,
      front: "Polymerization",
      back: "A process of reacting monomer molecules together in a chemical reaction to form polymer chains or three-dimensional networks.",
      category: "Reactions",
      difficulty: "Medium",
    },
    {
      id: 4,
      front: "Esterification",
      back: "The reaction between an alcohol and a carboxylic acid to form an ester and water.",
      category: "Reactions",
      difficulty: "Hard",
    },
    {
      id: 5,
      front: "Benzene Ring",
      back: "A hexagonal ring of six carbon atoms with alternating single and double bonds.",
      category: "Structure",
      difficulty: "Medium",
    },
  ],
  "4": [
    {
      id: 1,
      front: "B2B",
      back: "Business-to-Business: exchange of products, services or information between businesses.",
      category: "Types",
      difficulty: "Easy",
    },
    {
      id: 2,
      front: "B2C",
      back: "Business-to-Consumer: the process of selling products and services directly to consumers.",
      category: "Types",
      difficulty: "Easy",
    },
    {
      id: 3,
      front: "SEO",
      back: "Search Engine Optimization: the process of strictly improving the quality and quantity of website traffic.",
      category: "Digital Marketing",
      difficulty: "Medium",
    },
    {
      id: 4,
      front: "KPI",
      back: "Key Performance Indicator: a measurable value that demonstrates how effectively a company is achieving key business objectives.",
      category: "Metrics",
      difficulty: "Medium",
    },
    {
      id: 5,
      front: "ROI",
      back: "Return on Investment: a ratio between net profit and cost of investment.",
      category: "Metrics",
      difficulty: "Easy",
    },
  ],
};

export const generateQuizForMaterial = async (
  materialId: string,
  quantity: number = 5
): Promise<Quiz> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const baseQuiz = mockQuizzes[materialId] || mockQuizzes["1"];
      const baseQuestions = baseQuiz.questions;

      // If we need more questions than available, repeat them
      let questions = [...baseQuestions];
      while (questions.length < quantity) {
        questions = [...questions, ...baseQuestions];
      }

      // Slice to exact quantity
      questions = questions.slice(0, quantity).map((q, i) => ({
        ...q,
        id: i + 1, // Ensure unique IDs
      }));

      resolve({
        ...baseQuiz,
        questions,
      });
    }, 1500);
  });
};

export const generateFlashcardsForMaterial = async (
  materialId: string,
  quantity: number = 5
): Promise<Flashcard[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const baseFlashcards = mockFlashcards[materialId] || mockFlashcards["1"];

      // If we need more cards than available, repeat them
      let cards = [...baseFlashcards];
      while (cards.length < quantity) {
        cards = [...cards, ...baseFlashcards];
      }

      // Slice to exact quantity
      cards = cards.slice(0, quantity).map((c, i) => ({
        ...c,
        id: i + 1, // Ensure unique IDs
      }));

      resolve(cards);
    }, 1500);
  });
};
