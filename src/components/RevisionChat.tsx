import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type RevisionMode = "default" | "summary" | "keypoints" | "flashcards" | "formula" | "explanation" | "questions" | "mindmap";

export const RevisionChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<RevisionMode>("default");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const revisionModes = [
    { id: "default", label: "Chat", emoji: "💬" },
    { id: "summary", label: "Summary", emoji: "📝" },
    { id: "keypoints", label: "Key Points", emoji: "🔑" },
    { id: "flashcards", label: "Flashcards", emoji: "🎴" },
    { id: "formula", label: "Formulas", emoji: "📐" },
    { id: "explanation", label: "Explain", emoji: "💡" },
    { id: "questions", label: "Practice", emoji: "❓" },
    { id: "mindmap", label: "Mind Map", emoji: "🗺️" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const streamChat = async (userMessage: Message) => {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/revision-assistant`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          mode: selectedMode,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "Rate Limit",
            description: "Too many requests. Please wait a moment.",
            variant: "destructive",
          });
        } else if (response.status === 402) {
          toast({
            title: "Credits Required",
            description: "AI credits depleted. Please add more credits.",
            variant: "destructive",
          });
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let buffer = "";

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim() || line.startsWith(':')) continue;
          if (!line.startsWith('data: ')) continue;

          const data = line.slice(6).trim();
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = assistantMessage;
                return newMessages;
              });
            }
          } catch (e) {
            // Ignore parse errors for incomplete JSON
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
      setMessages(prev => prev.slice(0, -1));
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    await streamChat(userMessage);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Mode Selector */}
      <div className="mb-4 p-4 bg-card/50 rounded-lg border">
        <p className="text-sm text-muted-foreground mb-2">Select Revision Mode:</p>
        <div className="flex flex-wrap gap-2">
          {revisionModes.map((mode) => (
            <Badge
              key={mode.id}
              variant={selectedMode === mode.id ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => setSelectedMode(mode.id as RevisionMode)}
            >
              {mode.emoji} {mode.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
        {messages.length === 0 && (
          <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-secondary/5">
            <h3 className="text-xl font-semibold mb-2">👋 Hi! I'm your Quick-Revision Assistant</h3>
            <p className="text-muted-foreground mb-4">
              I can help you revise any subject quickly! Just paste your notes, chapter, or question below.
            </p>
            <p className="text-sm text-muted-foreground">
              💡 Tip: Select a revision mode above (Summary, Flashcards, etc.) for focused help, or just chat with me!
            </p>
          </Card>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <Card
              className={`max-w-[80%] p-4 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card"
              }`}
            >
              <div className="whitespace-pre-wrap break-words">{msg.content}</div>
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Paste your notes, questions, or chapter here... (Press Enter to send, Shift+Enter for new line)"
            className="min-h-[80px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="lg"
            className="self-end"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
