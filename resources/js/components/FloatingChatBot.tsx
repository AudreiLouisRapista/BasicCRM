import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown'
import { Send, Bot, User, X, MessageCircle } from 'lucide-react';
import axios from 'axios';

interface Message {
    role: 'user' | 'bot';
    content: string;
}

const DEFAULT_MESSAGE: Message = {
    role: 'bot',
    content: 'Hi! I am your customer assistant. How can I help you?'
};

export default function FloatingChatbot() {

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([DEFAULT_MESSAGE]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);

    // ← loading state for fetching previous messages
    const [loadingHistory, setLoadingHistory] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom when messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    // Load conversation
    useEffect(() => {
        if (!isOpen) return;
        setLoadingHistory(true);
        axios.get('/agent/conversation')
            .then(({ data }) => {
                if (data.messages && data.messages.length > 0) {
                    setMessages(data.messages);
                    setConversationId(data.conversation_id);
                } else {
                    setMessages([DEFAULT_MESSAGE]);
                    setConversationId(null);
                }
            })
            .catch(() => {
                setMessages([DEFAULT_MESSAGE]);
                setConversationId(null);
            })
            .finally(() => setLoadingHistory(false));

    }, [isOpen]);

    // Send message
    const sendMessage = async (text?: string) => {
        const userMessage = (text || input).trim();
        if (!userMessage) return;

        setInput('');
        setLoading(true);
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

        try {
            const { data } = await axios.post('/agent/send', {
                message: userMessage,
                conversation_id: conversationId,
            });

            if (data.conversation_id) setConversationId(data.conversation_id);
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

                        {/* Loading history spinner */}
                        {loadingHistory ? (
                            <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                                <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                <span className="text-xs">Loading conversation...</span>
                            </div>
                        ) : (
                            <>
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
                                            {msg.role === 'bot' ? (
                                                <ReactMarkdown
                                                    components={{
                                                        p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                                                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                                        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-1">{children}</ul>,
                                                        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-1">{children}</ol>,
                                                        li: ({ children }) => <li className="text-xs">{children}</li>,
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            ) : (
                                                msg.content
                                            )}
                                        </div>

                                        {msg.role === 'user' && (
                                            <div className="h-6 w-6 rounded-full bg-slate-500 flex items-center justify-center shrink-0 mt-1">
                                                <User className="h-3 w-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                ))}


                                {/* Thinking indicator */}
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

                                {/* Suggestions — only show on fresh conversation */}
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
                            </>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t flex gap-2">
                        <Input
                            className="text-xs h-8"
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            disabled={loading || loadingHistory}
                        />
                        <Button
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => sendMessage()}
                            disabled={loading || loadingHistory}
                        >
                            <Send className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Toggle button */}
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