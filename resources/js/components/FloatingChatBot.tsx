import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, X, MessageCircle } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────

interface Message {
    role: 'user' | 'bot';
    content: string;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function FloatingChatbot() {

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: 'Hi! I am your customer assistant. How can I help you?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    // 1. Add state to hold onto the database conversation ID context
    const [conversationId, setConversationId] = useState<string | null>(null);

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ── Send Message ────────────────────────────────────────────────────────

    const sendMessage = async (text?: string) => {
        const userMessage = (text || input).trim();
        if (!userMessage) return;

        setInput('');
        setLoading(true);

        const updatedMessages = [...messages, { role: 'user' as const, content: userMessage }];
        setMessages(updatedMessages);

        try {
            const res = await fetch('/agent/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
                        ?.content ?? '',
                },
                body: JSON.stringify({
                    message: userMessage,
                    // 2. Swap out raw message array for our state-tracked tracker ID
                    conversation_id: conversationId,
                }),
            });

            const data = await res.json();

            // 3. Capture the ID from the backend to ensure subsequent loops match up
            if (data.conversation_id) {
                setConversationId(data.conversation_id);
            }

            setMessages(prev => [...prev, { role: 'bot', content: data.response }]);

        } catch {
            setMessages(prev => [...prev, {
                role: 'bot',
                content: 'Something went wrong. Please try again.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    // ── Render ──────────────────────────────────────────────────────────────

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

            {isOpen && (
                <div className="w-80 h-[450px] bg-background border rounded-2xl shadow-xl flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-primary text-primary-foreground rounded-t-2xl">
                        <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4" />
                            <span className="text-sm font-semibold">Customer Assistant</span>
                        </div>
                        <button onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.role === 'bot' && (
                                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                                        <Bot className="h-3 w-3 text-primary-foreground" />
                                    </div>
                                )}

                                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs ${msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-foreground'
                                    }`}>
                                    {msg.content}
                                </div>

                                {msg.role === 'user' && (
                                    <div className="h-6 w-6 rounded-full bg-slate-500 flex items-center justify-center shrink-0 mt-1">
                                        <User className="h-3 w-3 text-white" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="flex gap-2 justify-start">
                                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                                    <Bot className="h-3 w-3 text-primary-foreground" />
                                </div>
                                <div className="bg-muted px-3 py-2 rounded-2xl text-xs text-muted-foreground">
                                    Thinking...
                                </div>
                            </div>
                        )}

                        {messages.length === 1 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {[
                                    'How many customers?',
                                    'List all customers',
                                    'Search for audrei',
                                ].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => sendMessage(s)}
                                        className="text-xs px-2 py-1 rounded-full border hover:bg-muted transition-colors"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t flex gap-2">
                        <Input
                            className="text-xs h-8"
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            disabled={loading}
                        />
                        <Button
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => sendMessage()}
                            disabled={loading}
                        >
                            <Send className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            )}

            <Button
                size="icon"
                className="h-12 w-12 rounded-full shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
            </Button>
        </div>
    );
}