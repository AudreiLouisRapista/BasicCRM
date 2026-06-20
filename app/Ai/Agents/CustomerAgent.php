<?php

namespace App\Ai\Agents;

use Laravel\Ai\Contracts\Agent;          // ← Base agent contract
use Laravel\Ai\Contracts\Conversational; // ← Allows conversation history
use Laravel\Ai\Contracts\HasTools;       // ← Allows agent to use tools
use Laravel\Ai\Contracts\Tool;           // ← Tool contract
use Laravel\Ai\Messages\Message;         // ← Message structure
use App\Ai\Tools\GetCustomersTool;    
use App\Ai\Tools\GetArchivedCustomerTool;    
use App\Ai\Tools\GetCustomerCountTool;  
use App\Ai\Tools\SearchCustomerTool; 
use Laravel\Ai\Promptable;              // ← Adds prompt() method to agent
use Laravel\Ai\Concerns\RemembersConversations;
use Laravel\Ai\Tools\Tool as ToolDefinition; // ← Tool builder
use App\Models\User;
use Illuminate\Support\Facades\DB;      // ← Database queries
use Stringable;

class CustomerAgent implements Agent, Conversational, HasTools
{
    use Promptable, RemembersConversations;  // ← Gives this agent the ability to be prompted

      public function __construct(public User $user) {
        $this->user = $user;
      }

    /**
     * Instructions tell the AI how to behave.
     * Think of this as the "personality" or "role" of the agent.
     */
    public function instructions(): Stringable|string
    {
        return 'You are a helpful assistant for a customer management system.

        RESPONSE FORMATTING RULES:
        - Keep responses short and concise
        - Use bullet points (•) for lists
        - For customer data, always format as a clean list
        - Never return raw JSON to the user
        - Always use human-readable formats

        GENERAL RULES:
        - Greet users warmly
        - If you cannot answer, say so clearly
        - Always be helpful and professional
        - Keep responses under 200 words unless listing customers';
    }

    /**
     * Conversation history — stores previous messages.
     * Empty for now since we handle history on the frontend.
     */
    // public function messages(): iterable
    // {
    //     return [];
    // }

    /**
     * Tools are actions the agent can perform.
     * The AI decides when to use them based on the user's question.
     */
    public function tools(): iterable
    {
        return [
            new GetCustomersTool(),      
            new GetCustomerCountTool(),
            new SearchCustomerTool(),
            new GetArchivedCustomerTool(),
        ];
    }
}