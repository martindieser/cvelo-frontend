import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Golda Aiwekhoe",
    date: "9 Nov 2025",
    text: "Got me 2 interviews in a week, you should seriously try it",
    avatar: "https://jobowl.co/golda.png",
  },
  {
    name: "Logan Grant",
    date: "8 Oct 2025",
    text: "Just started using this a few days ago and have already landed three interviews! Very valuable tool to have in the job hunt.",
    avatar: "https://jobowl.co/logan.jpg",
  },
  {
    name: "Juliana Shurtliff",
    date: "8 Oct 2025",
    text: "Actually started getting interviews more often. Very good tool.",
    avatar: "https://jobowl.co/juliana.jpg",
  },
  {
    name: "Nancy Hooper",
    date: "26 Aug 2025",
    text: "I actually wasn't sure this would work, but my interview requests have increased since using Jobowl :-)",
    avatar: "https://jobowl.co/nancy.jpg",
  },
  {
    name: "Mellony Burleson",
    date: "10 Oct 2025",
    text: "I'm 55 years old, with 22 years of experience in propane. It is hard starting over and jobOwl has really helped me with my resumes. This app has really helped me with wording and has saved me a lot of time.",
    avatar: "https://jobowl.co/mello.png",
  },
  {
    name: "Keishia Thacker",
    date: "27 Oct 2025",
    text: "I absolutely love Job Owl!! It has made applying for jobs so much easier and faster! It actually works and does everything it says it does!",
    avatar: "https://jobowl.co/keish.png",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What job seekers say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-card border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.date}</div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-sm text-foreground">{t.text}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="#" className="text-primary font-semibold underline text-sm">See all reviews</a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
