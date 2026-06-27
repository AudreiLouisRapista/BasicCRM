<?php

namespace App\Ai\Agents;

use Laravel\Ai\Contracts\Agent;          
use Laravel\Ai\Contracts\Conversational; 
use Laravel\Ai\Contracts\HasTools;       
use Laravel\Ai\Contracts\Tool;           
use Laravel\Ai\Messages\Message;        
use App\Ai\Tools\GetCustomersTool;    
use App\Ai\Tools\GetArchivedCustomerTool;    
use App\Ai\Tools\GetCustomerCountTool;  
use App\Ai\Tools\SearchCustomerTool; 
use Laravel\Ai\Promptable;             
use Laravel\Ai\Concerns\RemembersConversations;
use Laravel\Ai\Tools\Tool as ToolDefinition; 
use App\Models\User;
use Illuminate\Support\Facades\DB;    
use Stringable;

class CustomerAgent implements Agent, Conversational, HasTools
{
    use Promptable, RemembersConversations;  

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
            - Use **bold** for customer names
            - Use bullet points for lists
            - Separate each customer with a blank line
            - Keep responses short and concise
            - Never return raw JSON

            CUSTOMER FORMAT:
            **Name:** John Doe
            **Phone:** 09123456789
            **Email:** john@email.com
            **Address:** Davao City

            GENERAL RULES:
            - Be helpful and professional
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