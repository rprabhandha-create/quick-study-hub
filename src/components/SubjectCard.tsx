import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SubjectCardProps {
  title: string;
  icon: LucideIcon;
  count: number;
  color: "primary" | "secondary" | "accent";
  onClick: () => void;
}

export const SubjectCard = ({ title, icon: Icon, count, color, onClick }: SubjectCardProps) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary hover:bg-primary/20",
    secondary: "bg-secondary/10 text-secondary hover:bg-secondary/20",
    accent: "bg-accent/10 text-accent hover:bg-accent/20",
  };

  return (
    <Card
      className={`p-6 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${colorClasses[color]}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-background/50 rounded-lg">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm opacity-80">{count} flashcards</p>
        </div>
      </div>
    </Card>
  );
};
