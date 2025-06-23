
import { SoftSkillQuestion } from "./softSkillsData";

export const softSkillsByField: { [key: string]: SoftSkillQuestion[] } = {
  "UX/UI Design": [
    { key: "creativity", question: "How creative would you consider yourself?", description: "Your ability to think outside the box and generate innovative design ideas" },
    { key: "empathy", question: "How empathetic would you consider yourself?", description: "Your ability to understand and design for user needs and emotions" },
    { key: "communication", question: "How would you rate your communication skills?", description: "Your ability to present design concepts and collaborate with stakeholders" },
    { key: "critical_thinking", question: "How strong are your critical thinking abilities?", description: "Your skill in analyzing user problems and design solutions" },
    { key: "adaptability", question: "How adaptable are you to change?", description: "Your flexibility in iterating designs based on feedback" },
    { key: "team_collaboration", question: "How effectively do you collaborate in teams?", description: "Your ability to work with developers, product managers, and other designers" },
    { key: "problem_solving", question: "How would you rate your problem-solving skills?", description: "Your ability to identify and solve user experience challenges" }
  ],
  "Data Analytics": [
    { key: "critical_thinking", question: "How strong are your critical thinking abilities?", description: "Your skill in analyzing data objectively and drawing insights" },
    { key: "problem_solving", question: "How would you rate your problem-solving skills?", description: "Your ability to identify patterns and solve business problems with data" },
    { key: "communication", question: "How would you rate your communication skills?", description: "Your ability to explain complex data insights to non-technical stakeholders" },
    { key: "attention_to_detail", question: "How detail-oriented are you?", description: "Your thoroughness in data validation and analysis accuracy" },
    { key: "adaptability", question: "How adaptable are you to change?", description: "Your flexibility in working with different data sources and tools" },
    { key: "time_management", question: "How well do you manage your time?", description: "Your efficiency in handling multiple data projects and deadlines" },
    { key: "curiosity", question: "How curious are you about exploring data?", description: "Your drive to dig deeper into data to uncover insights" }
  ],
  "Marketing": [
    { key: "creativity", question: "How creative would you consider yourself?", description: "Your ability to develop innovative marketing campaigns and content" },
    { key: "communication", question: "How would you rate your communication skills?", description: "Your ability to craft compelling messages and engage audiences" },
    { key: "empathy", question: "How empathetic would you consider yourself?", description: "Your ability to understand customer needs and motivations" },
    { key: "adaptability", question: "How adaptable are you to change?", description: "Your flexibility in adjusting strategies based on market trends" },
    { key: "networking", question: "How comfortable are you with networking?", description: "Your ability to build relationships and partnerships" },
    { key: "customer_service", question: "How would you rate your customer service skills?", description: "Your ability to engage with customers and build brand loyalty" },
    { key: "analytical_thinking", question: "How analytical are you in your approach?", description: "Your ability to measure and optimize marketing performance" }
  ],
  "Software Development": [
    { key: "problem_solving", question: "How would you rate your problem-solving skills?", description: "Your ability to debug code and solve technical challenges" },
    { key: "critical_thinking", question: "How strong are your critical thinking abilities?", description: "Your skill in architecting solutions and making technical decisions" },
    { key: "attention_to_detail", question: "How detail-oriented are you?", description: "Your thoroughness in writing clean, maintainable code" },
    { key: "team_collaboration", question: "How effectively do you collaborate in teams?", description: "Your ability to work in agile teams and code reviews" },
    { key: "adaptability", question: "How adaptable are you to change?", description: "Your flexibility in learning new technologies and frameworks" },
    { key: "communication", question: "How would you rate your communication skills?", description: "Your ability to explain technical concepts to non-technical stakeholders" },
    { key: "continuous_learning", question: "How committed are you to continuous learning?", description: "Your drive to stay updated with evolving technologies" }
  ],
  "Product Management": [
    { key: "leadership", question: "How would you rate your leadership abilities?", description: "Your capability to guide cross-functional teams toward product goals" },
    { key: "communication", question: "How would you rate your communication skills?", description: "Your ability to align stakeholders and communicate product vision" },
    { key: "empathy", question: "How empathetic would you consider yourself?", description: "Your ability to understand user needs and market demands" },
    { key: "critical_thinking", question: "How strong are your critical thinking abilities?", description: "Your skill in making data-driven product decisions" },
    { key: "adaptability", question: "How adaptable are you to change?", description: "Your flexibility in pivoting product strategy based on market feedback" },
    { key: "time_management", question: "How well do you manage your time?", description: "Your efficiency in managing product roadmaps and priorities" },
    { key: "conflict_resolution", question: "How skilled are you at resolving conflicts?", description: "Your ability to mediate between different stakeholder interests" }
  ],
  "Finance": [
    { key: "attention_to_detail", question: "How detail-oriented are you?", description: "Your thoroughness in financial analysis and reporting accuracy" },
    { key: "critical_thinking", question: "How strong are your critical thinking abilities?", description: "Your skill in analyzing financial data and market trends" },
    { key: "communication", question: "How would you rate your communication skills?", description: "Your ability to explain financial concepts to non-finance stakeholders" },
    { key: "stress_management", question: "How effectively do you handle stress?", description: "Your ability to remain calm during market volatility and tight deadlines" },
    { key: "ethical_judgment", question: "How strong is your ethical judgment?", description: "Your commitment to financial integrity and regulatory compliance" },
    { key: "time_management", question: "How well do you manage your time?", description: "Your efficiency in meeting financial reporting deadlines" },
    { key: "analytical_thinking", question: "How analytical are you in your approach?", description: "Your ability to interpret complex financial data and models" }
  ]
};

// Default soft skills for General field
export const defaultSoftSkills: SoftSkillQuestion[] = [
  { key: "communication", question: "How would you rate your communication skills?", description: "Your ability to express ideas clearly and listen effectively to others" },
  { key: "leadership", question: "How would you rate your leadership abilities?", description: "Your capability to guide, motivate, and inspire others" },
  { key: "problem_solving", question: "How would you rate your problem-solving skills?", description: "Your ability to analyze issues and find creative solutions" },
  { key: "team_collaboration", question: "How effectively do you collaborate in teams?", description: "Your ability to work well with others toward common goals" },
  { key: "adaptability", question: "How adaptable are you to change?", description: "Your flexibility in adjusting to new situations and changes" },
  { key: "time_management", question: "How well do you manage your time?", description: "Your efficiency in organizing and prioritizing tasks" },
  { key: "creativity", question: "How creative would you consider yourself?", description: "Your ability to think outside the box and generate innovative ideas" },
  { key: "critical_thinking", question: "How strong are your critical thinking abilities?", description: "Your skill in analyzing information objectively and making reasoned judgments" }
];
