import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Send, Stethoscope } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

export default function TriagePage() {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: `Hello ${user?.name ? user.name.split(" ")[0] : "there"}! I am HealthBot. Please describe your symptoms in detail, and I can help you understand what might be going on or whether you should see a doctor.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/ai/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: data.data.role, content: data.data.content },
        ]);
      }
    } catch (error) {
      console.error("Error communicating with AI:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "ai", content: "Sorry, I am having trouble connecting right now. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
          <Stethoscope className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            AI Triage
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Describe your symptoms for a preliminary assessment.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col glass-card rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/50 dark:shadow-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                key={msg.id}
                className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md shrink-0 ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                      : "bg-gradient-to-br from-teal-400 to-emerald-600 text-white"
                  }`}
                >
                  {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div
                  className={`max-w-[80%] px-5 py-4 rounded-3xl shadow-sm text-[15px] leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100 rounded-tr-none border border-indigo-100 dark:border-indigo-800/50"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700"
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 flex-row"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white dark:bg-slate-800 px-5 py-4 rounded-3xl rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-1.5 h-[56px]">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-2" />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="relative flex items-center max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Describe your symptoms..."
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-teal-500 dark:focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-2xl pl-5 pr-14 py-4 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100 shadow-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2.5 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-md active:scale-95"
              aria-label="Send message"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </div>
          <div className="text-center mt-3 text-xs text-slate-400 dark:text-slate-500">
            AI Triage is for preliminary informational purposes only and does not replace professional medical advice.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
