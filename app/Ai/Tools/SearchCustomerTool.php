<?php
namespace App\Ai\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Support\Facades\DB;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class SearchCustomerTool implements Tool
{
    public function description(): Stringable|string
    {
        return 'Search for a customer by name or email';
    }

    public function handle(Request $request): Stringable|string
    {
        $query = $request['query']; // ← get query parameter

        $results = DB::table('customer_lists')
            ->whereNull('deleted_at')
            ->where(function ($q) use ($query) {
                $q->where('fullname', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
            })
            ->select('id', 'fullname', 'email', 'phonenumber', 'address')
            ->get()
            ->toArray();

        return json_encode($results);
    }

    public function schema(JsonSchema $schema): array
    {
        // ← define the query parameter
        return [
            'query' => $schema->string()
                ->description('The name or email to search for')
                ->required(),
        ];
    }
}