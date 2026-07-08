// Project 3 Capstone: Tech Stack Recommender Database
// Mappings of job roles to their representative skills (documents containing terms)

const JOB_PROFILES = [
    {
        role: "Data Scientist",
        skills: ["Python", "SQL", "Machine Learning", "Data Analysis", "Statistics", "Git"],
        description: "Extracts insights from large datasets, trains machine learning models, and translates predictive analysis into business strategies."
    },
    {
        role: "DevOps Engineer",
        skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux", "Git", "Automation", "Python"],
        description: "Bridges the gap between developers and IT staff to speed up software delivery, automating builds, tests, and cloud infrastructure deployment."
    },
    {
        role: "Backend Developer",
        skills: ["Java", "Python", "SQL", "APIs", "Data Structures", "Git", "Linux"],
        description: "Creates and maintains the server-side logic, databases, and APIs that power application frontends behind the scenes."
    },
    {
        role: "Frontend Developer",
        skills: ["HTML", "CSS", "Javascript", "React", "Git", "APIs", "Web Design"],
        description: "Designs and builds the user interfaces and visual experiences that users interact with directly in web browsers."
    },
    {
        role: "Data Engineer",
        skills: ["Python", "SQL", "Data Analysis", "Spark", "Cloud", "Java", "Git"],
        description: "Architects and maintains the underlying pipelines and databases that transport, transform, and store raw organizational data."
    },
    {
        role: "Cloud Architect",
        skills: ["Cloud", "AWS", "Kubernetes", "Docker", "Linux", "APIs", "Security"],
        description: "Designs the overall structure of cloud applications and hosting networks, planning deployment environments and data flow systems."
    },
    {
        role: "Fullstack Developer",
        skills: ["Javascript", "HTML", "CSS", "APIs", "SQL", "Python", "Git", "React"],
        description: "Handles both client-side and server-side components, implementing database integrations, API endpoints, and user interfaces."
    }
];

// Vocabulary List: Extracted from all unique skills above
const SKILLS_VOCABULARY = [
    "Python", "SQL", "Machine Learning", "Data Analysis", "Statistics", "Git",
    "AWS", "Docker", "Kubernetes", "CI/CD", "Linux", "Automation",
    "Java", "APIs", "Data Structures", "HTML", "CSS", "Javascript",
    "React", "Web Design", "Spark", "Cloud", "Security"
];
