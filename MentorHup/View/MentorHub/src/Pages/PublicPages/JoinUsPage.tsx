import React from 'react';
import HeroSection from '../../components/JoinUsComponents/HeroSection';
import OpenPositionsSection from '../../components/JoinUsComponents/OpenPositionsSection';
import BenefitsSection from '../../components/JoinUsComponents/BenefitsSection';
import CTASection from '../../components/JoinUsComponents/CTASection';
import  type { JoinUsPageProps, Position } from '../../types/types';

const JoinUsPage: React.FC<JoinUsPageProps> = ({ isDark = false }) => {
  const openPositions: Position[] = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      salary: "$120k - $180k",
      description: "Join our engineering team to build the next generation of interview training platform. Work with React, Node.js, and modern cloud technologies.",
      requirements: ["5+ years of full-stack development", "Experience with React and Node.js", "Strong understanding of system design"]
    },
    {
      id: 2,
      title: "Senior Accountant",
      department: "Finance",
      location: "New York / Remote",
      type: "Full-time",
      salary: "$80k - $110k",
      description: "Lead our financial operations and ensure accurate reporting as we scale our mentor network globally.",
      requirements: ["CPA certification preferred", "5+ years of accounting experience", "Experience with SaaS business models"]
    },
    {
      id: 3,
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      salary: "$90k - $130k",
      description: "Design intuitive user experiences that help job seekers connect with mentors and achieve their career goals.",
      requirements: ["Strong portfolio in UX/UI design", "Experience with Figma and design systems", "Understanding of user research methods"]
    },
    {
      id: 4,
      title: "Marketing Manager",
      department: "Marketing",
      location: "Los Angeles / Remote",
      type: "Full-time",
      salary: "$70k - $100k",
      description: "Drive growth and brand awareness through digital marketing campaigns and strategic partnerships.",
      requirements: ["3+ years in digital marketing", "Experience with B2C platforms", "Strong analytical skills"]
    },
    {
      id: 5,
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Contract",
      salary: "$60 - $80/hour",
      description: "Help us create beautiful, responsive interfaces for our mentor-mentee matching platform.",
      requirements: ["Expert in React and TypeScript", "Experience with modern CSS frameworks", "Strong attention to detail"]
    },
    {
      id: 6,
      title: "Customer Success Manager",
      department: "Operations",
      location: "Chicago / Remote",
      type: "Full-time",
      salary: "$65k - $85k",
      description: "Ensure our mentors and job seekers have exceptional experiences on our platform.",
      requirements: ["Experience in customer success or support", "Excellent communication skills", "Background in HR or career services preferred"]
    }
  ];

  const benefits = [
    "Competitive salary and equity package",
    "Comprehensive health, dental, and vision insurance",
    "Flexible remote work options",
    "Professional development budget",
    "Unlimited PTO policy",
    "Latest tech equipment provided"
  ];

  const containerStyle = isDark 
    ? { backgroundColor: '#06171c', color: 'white' } 
    : { backgroundColor: '#96fbf1', color: '#1f2937' };

  return (
    <div style={containerStyle} className="min-h-screen">
      <HeroSection isDark={isDark} />
      <OpenPositionsSection positions={openPositions} isDark={isDark} />
      <BenefitsSection benefits={benefits} isDark={isDark} />
      <CTASection isDark={isDark} />
    </div>
  );
};

export default JoinUsPage;