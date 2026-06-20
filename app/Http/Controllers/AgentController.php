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
        // Validate — message is required and max 1000 characters
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        try {
            // Create a new instance of our CustomerAgent
            $agent = new CustomerAgent();

            // Send the user's message to the agent
            // The agent will decide which tools to use automatically
            $reply = $agent->prompt($request->message);

            // Return the AI response as JSON
            return response()->json(['response' => (string) $reply]);

        } catch (\Throwable $e) {
            // If something goes wrong, return a friendly error message
            return response()->json([
                'response' => $e->getMessage()
            ], 200);
        }
    }
}