<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Ai\Agents\CustomerAgent;
use Laravel\Ai\Models\Conversation;

class AgentController extends Controller
{
    /**
     * Load the last conversation messages for the logged-in user.
     * Called when the chatbot opens.
     */
    public function loadConversation()
    {
        $user = auth()->user();

        if (session()->pull('clear_chat_on_login', false)) {
        return response()->json([
            'conversation_id' => null,
            'messages'        => [],
        ]);
    }

        // Find the latest conversation for this user
        $conversation = Conversation::where('user_id', $user->id)
            ->latest()
            ->first();

        // If no conversation exists, return empty
        if (!$conversation) {
            return response()->json([
                'conversation_id' => null,
                'messages' => [],
            ]);
        }

        // Load messages and format for frontend
        $messages = $conversation->messages()
            ->orderBy('created_at')
            ->get(['role', 'content'])
            ->map(fn($msg) => [
                'role'    => $msg->role === 'assistant' ? 'bot' : $msg->role,
                'content' => $msg->content,
            ])
            ->toArray();

        return response()->json([
            'conversation_id' => $conversation->id,
            'messages'        => $messages,
        ]);
    }

    /**
     * Handle incoming chat messages from the user.
     */
    public function send(Request $request)
    {
        $validated = $request->validate([
            'message'         => 'required|string|max:1000',
            'conversation_id' => 'nullable|string',
        ]);

        try {
            $user  = auth()->user();
            $agent = new CustomerAgent($user);

            // Continue existing conversation or start new one
            if (!empty($validated['conversation_id'])) {
                $response = $agent->continue($validated['conversation_id'], as: $user)
                                  ->prompt($validated['message']);
            } else {
                $response = $agent->forUser($user)
                                  ->prompt($validated['message']);
            }

            return response()->json([
                'response'        => (string) $response,
                'conversation_id' => $agent->currentConversation(),
            ]);

        } catch (\Throwable $e) {
            logger()->error('AI Agent Error: ' . $e->getMessage(), ['exception' => $e]);

            return response()->json([
                'response' => 'The assistant is temporarily unavailable. Please try again shortly.'
            ], 500);
        }
    }
}