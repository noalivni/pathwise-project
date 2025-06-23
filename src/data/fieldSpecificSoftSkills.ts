
import { SoftSkillQuestion } from "@/data/softSkillsData";

export const softSkillsByField: { [key: string]: SoftSkillQuestion[] } = {
  "UX/UI Design": [
    {
      key: "communication",
      question: "How would you rate your communication skills?",
      description: "Your ability to express design ideas clearly and gather user feedback"
    },
    {
      key: "creativity",
      question: "How creative would you consider yourself?",
      description: "Your ability to think outside the box and generate innovative design solutions"
    },
    {
      key: "empathy",
      question: "How empathetic would you consider yourself?",
      description: "Your ability to understand and design for user needs and emotions"
    },
    {
      key: "critical_thinking",
      question: "How strong are your critical thinking abilities?",
      description: "Your skill in analyzing user problems and making design decisions"
    },
    {
      key: "team_collaboration",
      question: "How effectively do you collaborate in teams?",
      description: "Your ability to work with developers, product managers, and stakeholders"
    },
    {
      key: "adaptability",
      question: "How adaptable are you to change?",
      description: "Your flexibility in responding to design feedback and iterations"
    },
    {
      key: "attention_to_detail",
      question: "How detail-oriented are you?",
      description: "Your thoroughness in creating pixel-perfect designs and user flows"
    },
    {
      key: "time_management",
      question: "How well do you manage your time?",
      description: "Your efficiency in meeting design deadlines and project milestones"
    }
  ],
  "Data Analytics": [
    {
      key: "critical_thinking",
      question: "How strong are your critical thinking abilities?",
      description: "Your skill in analyzing data objectively and drawing insights"
    },
    {
      key: "problem_solving",
      question: "How would you rate your problem-solving skills?",
      description: "Your ability to identify patterns and solve business problems with data"
    },
    {
      key: "attention_to_detail",
      question: "How detail-oriented are you?",
      description: "Your accuracy in data analysis and quality assurance"
    },
    {
      key: "communication",
      question: "How would you rate your communication skills?",
      description: "Your ability to present data insights to non-technical stakeholders"
    },
    {
      key: "curiosity",
      question: "How curious and inquisitive are you?",
      description: "Your drive to ask questions and explore data for deeper insights"
    },
    {
      key: "time_management",
      question: "How well do you manage your time?",
      description: "Your efficiency in completing data analysis projects on schedule"
    },
    {
      key: "adaptability",
      question: "How adaptable are you to change?",
      description: "Your flexibility in working with different data sources and tools"
    },
    {
      key: "team_collaboration",
      question: "How effectively do you collaborate in teams?",
      description: "Your ability to work with business teams and technical colleagues"
    }
  ],
  "Marketing": [
    {
      key: "creativity",
      question: "How creative would you consider yourself?",
      description: "Your ability to develop innovative marketing campaigns and content"
    },
    {
      key: "communication",
      question: "How would you rate your communication skills?",
      description: "Your ability to craft compelling messages and engage audiences"
    },
    {
      key: "adaptability",
      question: "How adaptable are you to change?",
      description: "Your flexibility in responding to market trends and consumer behavior"
    },
    {
      key: "analytical_thinking",
      question: "How strong are your analytical abilities?",
      description: "Your skill in interpreting marketing metrics and campaign performance"
    },
    {
      key: "empathy",
      question: "How empathetic would you consider yourself?",
      description: "Your ability to understand customer needs and pain points"
    },
    {
      key: "networking",
      question: "How comfortable are you with networking?",
      description: "Your ability to build relationships with customers and partners"
    },
    {
      key: "time_management",
      question: "How well do you manage your time?",
      description: "Your efficiency in managing multiple campaigns and deadlines"
    },
    {
      key: "persuasion",
      question: "How persuasive are you?",
      description: "Your ability to influence customer decisions and drive conversions"
    }
  ],
  "Software Development": [
    {
      key: "problem_solving",
      question: "How would you rate your problem-solving skills?",
      description: "Your ability to debug code and architect technical solutions"
    },
    {
      key: "critical_thinking",
      question: "How strong are your critical thinking abilities?",
      description: "Your skill in analyzing requirements and designing efficient systems"
    },
    {
      key: "attention_to_detail",
      question: "How detail-oriented are you?",
      description: "Your precision in writing clean, bug-free code"
    },
    {
      key: "team_collaboration",
      question: "How effectively do you collaborate in teams?",
      description: "Your ability to work in agile teams and conduct code reviews"
    },
    {
      key: "adaptability",
      question: "How adaptable are you to change?",
      description: "Your flexibility in learning new technologies and frameworks"
    },
    {
      key: "communication",
      question: "How would you rate your communication skills?",
      description: "Your ability to explain technical concepts to non-technical stakeholders"
    },
    {
      key: "patience",
      question: "How patient are you when facing challenges?",
      description: "Your persistence in solving complex technical problems"
    },
    {
      key: "continuous_learning",
      question: "How committed are you to continuous learning?",
      description: "Your dedication to staying updated with technology trends"
    }
  ],
  "Product Management": [
    {
      key: "leadership",
      question: "How would you rate your leadership abilities?",
      description: "Your capability to guide product teams and drive vision"
    },
    {
      key: "communication",
      question: "How would you rate your communication skills?",
      description: "Your ability to align stakeholders and present product strategies"
    },
    {
      key: "analytical_thinking",
      question: "How strong are your analytical abilities?",
      description: "Your skill in analyzing market data and user metrics"
    },
    {
      key: "empathy",
      question: "How empathetic would you consider yourself?",
      description: "Your ability to understand user needs and pain points"
    },
    {
      key: "decision_making",
      question: "How confident are you in making decisions?",
      description: "Your ability to make product decisions with incomplete information"
    },
    {
      key: "prioritization",
      question: "How well do you prioritize tasks and features?",
      description: "Your skill in managing product backlogs and roadmaps"
    },
    {
      key: "adaptability",
      question: "How adaptable are you to change?",
      description: "Your flexibility in pivoting product strategies based on feedback"
    },
    {
      key: "negotiation",
      question: "How skilled are you at negotiation?",
      description: "Your ability to balance competing stakeholder interests"
    }
  ]
};

export const defaultSoftSkills: SoftSkillQuestion[] = [
  {
    key: "communication",
    question: "How would you rate your communication skills?",
    description: "Your ability to express ideas clearly and listen effectively to others"
  },
  {
    key: "problem_solving",
    question: "How would you rate your problem-solving skills?",
    description: "Your ability to analyze issues and find creative solutions"
  },
  {
    key: "team_collaboration",
    question: "How effectively do you collaborate in teams?",
    description: "Your ability to work well with others toward common goals"
  },
  {
    key: "adaptability",
    question: "How adaptable are you to change?",
    description: "Your flexibility in adjusting to new situations and changes"
  },
  {
    key: "time_management",
    question: "How well do you manage your time?",
    description: "Your efficiency in organizing and prioritizing tasks"
  },
  {
    key: "critical_thinking",
    question: "How strong are your critical thinking abilities?",
    description: "Your skill in analyzing information objectively and making reasoned judgments"
  },
  {
    key: "creativity",
    question: "How creative would you consider yourself?",
    description: "Your ability to think outside the box and generate innovative ideas"
  },
  {
    key: "leadership",
    question: "How would you rate your leadership abilities?",
    description: "Your capability to guide, motivate, and inspire others"
  }
];
