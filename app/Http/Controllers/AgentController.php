<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Ai\Agents\CustomerAgent; 

class AgentController extends Controller
{

    // public function index()
    // {
    //     return Inertia::render('Agent/agent');
    // }

    /**
     * Handle incoming chat messages from the user.
     * Passes the message to the AI agent and returns the response.
     */
public function send(Request $request)
{
    // 1. Include the tracking parameter in your validation rules
    $validated = $request->validate([
        'message' => 'required|string|max:1000',
        'conversation_id' => 'nullable|string',
    ]);

    try {
        $user = auth()->user();
        
        // Clean instantiation without double-passing the user context
        $agent = new CustomerAgent($user);

        // 2. Conditionally retain conversational history
        if (!empty($validated['conversation_id'])) {
            $response = $agent->continue($validated['conversation_id'], as: $user)
                              ->prompt($validated['message']);
        } else {
            $response = $agent->forUser($user)
                              ->prompt($validated['message']);
        }

        return response()->json([
            'response' => (string) $response,
            'conversation_id' => $response->conversationId ?? $validated['conversation_id'],
        ]);

    } catch (\Throwable $e) {
        // 3. Log the real issue for yourself, but return a safe fallback to the user
        logger()->error('AI Agent Error: ' . $e->getMessage(), ['exception' => $e]);

        return response()->json([
            'response' => 'The assistant is temporarily unavailable. Please try again shortly.'
        ], 500); // 4. Correct HTTP semantic error status
    }
}
}