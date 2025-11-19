import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  question: string;
  answer: string;
  category: string;
}

export const Flashcard = ({ question, answer, category }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="perspective-1000 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          "relative w-full h-80 transition-transform duration-600 transform-style-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        {/* Front of card */}
        <Card
          className={cn(
            "absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-8 border-2 hover:shadow-lg transition-all",
            "bg-gradient-to-br from-card to-muted"
          )}
        >
          <span className="text-xs font-semibold text-primary mb-4 px-3 py-1 bg-primary/10 rounded-full">
            {category}
          </span>
          <p className="text-2xl font-bold text-center text-foreground">{question}</p>
          <p className="text-sm text-muted-foreground mt-6">Click to reveal answer</p>
        </Card>

        {/* Back of card */}
        <Card
          className={cn(
            "absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 border-2",
            "bg-gradient-to-br from-primary/5 to-secondary/5"
          )}
        >
          <span className="text-xs font-semibold text-secondary mb-4 px-3 py-1 bg-secondary/10 rounded-full">
            Answer
          </span>
          <p className="text-xl text-center text-foreground">{answer}</p>
          <p className="text-sm text-muted-foreground mt-6">Click to flip back</p>
        </Card>
      </div>
    </div>
  );
};
