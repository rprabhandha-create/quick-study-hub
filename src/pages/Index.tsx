import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flashcard } from "@/components/Flashcard";
import { SubjectCard } from "@/components/SubjectCard";
import { BookOpen, Calculator, Atom, Globe, ChevronLeft, ChevronRight } from "lucide-react";

const subjects = [
  { id: "math", title: "Mathematics", icon: Calculator, color: "primary" as const, count: 24 },
  { id: "science", title: "Science", icon: Atom, color: "secondary" as const, count: 18 },
  { id: "history", title: "History", icon: Globe, color: "accent" as const, count: 15 },
];

const flashcardsData = {
  math: [
    { question: "What is the Pythagorean theorem?", answer: "a² + b² = c² - In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides.", category: "Mathematics" },
    { question: "What is the quadratic formula?", answer: "x = (-b ± √(b² - 4ac)) / 2a - Used to solve quadratic equations of the form ax² + bx + c = 0", category: "Mathematics" },
    { question: "What is a derivative?", answer: "The rate of change of a function at a point. It represents the slope of the tangent line to the curve.", category: "Mathematics" },
  ],
  science: [
    { question: "What are the three states of matter?", answer: "Solid, Liquid, and Gas. Matter can transition between these states through heating or cooling.", category: "Science" },
    { question: "What is photosynthesis?", answer: "The process by which plants convert sunlight, water, and CO₂ into glucose and oxygen.", category: "Science" },
    { question: "What is Newton's First Law?", answer: "An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.", category: "Science" },
  ],
  history: [
    { question: "When did World War II end?", answer: "1945 - The war ended with Germany's surrender in May and Japan's surrender in September after atomic bombs.", category: "History" },
    { question: "What was the Renaissance?", answer: "A period of cultural rebirth in Europe (14th-17th century) marked by advances in art, science, and philosophy.", category: "History" },
    { question: "Who wrote the Declaration of Independence?", answer: "Thomas Jefferson drafted the Declaration of Independence in 1776, declaring American independence from Britain.", category: "History" },
  ],
};

const Index = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const currentFlashcards = selectedSubject ? flashcardsData[selectedSubject as keyof typeof flashcardsData] : [];

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % currentFlashcards.length);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + currentFlashcards.length) % currentFlashcards.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="w-12 h-12 text-primary" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            QuickRevise
          </h1>
        </div>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Master your subjects with interactive flashcards. Study smarter, not harder.
        </p>
        {!selectedSubject && (
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            onClick={() => setSelectedSubject("math")}
          >
            Start Revising Now
          </Button>
        )}
      </header>

      {/* Subject Selection or Flashcard View */}
      <main className="container mx-auto px-4 pb-16">
        {!selectedSubject ? (
          <div className="max-w-4xl mx-auto animate-slide-up">
            <h2 className="text-3xl font-bold text-center mb-8">Choose Your Subject</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  title={subject.title}
                  icon={subject.icon}
                  count={subject.count}
                  color={subject.color}
                  onClick={() => setSelectedSubject(subject.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedSubject(null);
                  setCurrentCardIndex(0);
                }}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Subjects
              </Button>
              <span className="text-sm text-muted-foreground">
                Card {currentCardIndex + 1} of {currentFlashcards.length}
              </span>
            </div>

            <Flashcard
              question={currentFlashcards[currentCardIndex].question}
              answer={currentFlashcards[currentCardIndex].answer}
              category={currentFlashcards[currentCardIndex].category}
            />

            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={prevCard}
                disabled={currentFlashcards.length <= 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary"
                onClick={nextCard}
                disabled={currentFlashcards.length <= 1}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
