
import { SoftSkill } from "@/types/softSkills";

export const softSkills: SoftSkill[] = [
  { name: "Communication", description: "Ability to express ideas clearly and listen effectively", icon: "💬" },
  { name: "Leadership", description: "Capability to guide, motivate, and inspire others", icon: "👑" },
  { name: "Problem Solving", description: "Skill in analyzing issues and finding creative solutions", icon: "🧩" },
  { name: "Teamwork", description: "Ability to collaborate effectively with others", icon: "🤝" },
  { name: "Adaptability", description: "Flexibility in adjusting to new situations and changes", icon: "🔄" },
  { name: "Time Management", description: "Efficiency in organizing and prioritizing tasks", icon: "⏰" },
  { name: "Creativity", description: "Ability to think outside the box and generate innovative ideas", icon: "💡" },
  { name: "Critical Thinking", description: "Skill in analyzing information objectively and making reasoned judgments", icon: "🔍" },
  { name: "Emotional Intelligence", description: "Understanding and managing emotions in self and others", icon: "❤️" },
  { name: "Attention to Detail", description: "Thoroughness and accuracy in completing tasks", icon: "🔎" }
];

export interface SoftSkillQuestion {
  key: string;
  question: string;
  description?: string;
}

export const softSkillsQuestions: SoftSkillQuestion[] = [
  {
    key: "communication",
    question: "How would you rate your communication skills?",
    description: "Your ability to express ideas clearly and listen effectively to others"
  },
  {
    key: "active_listening",
    question: "How well do you practice active listening?",
    description: "Your ability to fully concentrate and understand when others are speaking"
  },
  {
    key: "public_speaking",
    question: "How comfortable are you with public speaking?",
    description: "Your confidence in presenting ideas to groups or audiences"
  },
  {
    key: "leadership",
    question: "How would you rate your leadership abilities?",
    description: "Your capability to guide, motivate, and inspire others"
  },
  {
    key: "team_collaboration",
    question: "How effectively do you collaborate in teams?",
    description: "Your ability to work well with others toward common goals"
  },
  {
    key: "conflict_resolution",
    question: "How skilled are you at resolving conflicts?",
    description: "Your ability to mediate disagreements and find solutions"
  },
  {
    key: "problem_solving",
    question: "How would you rate your problem-solving skills?",
    description: "Your ability to analyze issues and find creative solutions"
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
    key: "stress_management",
    question: "How effectively do you handle stress?",
    description: "Your ability to remain calm and productive under pressure"
  },
  {
    key: "empathy",
    question: "How empathetic would you consider yourself?",
    description: "Your ability to understand and share the feelings of others"
  },
  {
    key: "networking",
    question: "How comfortable are you with networking?",
    description: "Your ability to build and maintain professional relationships"
  },
  {
    key: "customer_service",
    question: "How would you rate your customer service skills?",
    description: "Your ability to meet customer needs and provide excellent service"
  }
];
