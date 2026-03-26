import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does JobOwl help me get more job interviews?",
    a: "JobOwl creates a job-specific version of your resume by analyzing the job description and then tailoring what recruiters care about most: your most relevant skills, your strongest matching experience, and clear, role-aligned achievements. It also adds important keywords naturally and keeps formatting clean (including ATS-friendly structure).",
  },
  {
    q: 'What do you mean by "tailoring" a resume?',
    a: "Tailoring means aligning your resume to a specific role—without making anything up. JobOwl can reorder skills, rewrite bullet points to better reflect the job's outcomes, highlight the most relevant projects, and incorporate key phrases from the job description.",
  },
  {
    q: "Does JobOwl work in other languages?",
    a: "Yes. JobOwl detects the language of the job post and tailors accordingly, and it should work well for all commonly spoken languages.",
  },
  {
    q: "Will JobOwl change my experience or add fake claims?",
    a: "No. JobOwl is designed to present your real experience more clearly for the role you're targeting. It improves phrasing, structure, and emphasis—but it shouldn't invent achievements. You stay in control and can edit any generated resume.",
  },
  {
    q: "Do I need to paste a job description every time?",
    a: "For best results, yes—because each role prioritizes different skills and outcomes. Pasting the job description lets JobOwl tailor the resume to that exact posting.",
  },
  {
    q: "What is an ATS, and how does JobOwl help deal with it?",
    a: "An Applicant Tracking System (ATS) is software many companies use to collect and screen applications. JobOwl uses ATS-friendly templates and clean formatting, so your resume is easier to parse.",
  },
  {
    q: "Will my resume sound robotic?",
    a: "No. JobOwl aims for natural, recruiter-friendly language. It keeps your content readable while improving clarity and relevance.",
  },
  {
    q: "How long does it take to generate a tailored resume?",
    a: "Typically under a minute. Upload your resume, provide the job description, and JobOwl generates a tailored version quickly.",
  },
  {
    q: "Can I use JobOwl for different roles and industries?",
    a: "Yes. JobOwl works across industries (tech, marketing, finance, operations, healthcare, and more). Because it tailors to the job description, it adapts to role-specific terminology.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently asked questions</h2>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4">
              <AccordionTrigger className="text-left font-semibold text-sm py-4">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
