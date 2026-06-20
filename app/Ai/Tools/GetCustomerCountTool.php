<?php
namespace App\Ai\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Support\Facades\DB;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class GetCustomerCountTool implements Tool
{
    public function description(): Stringable|string
    {
        return 'Get total number of active and archived customers';
    }

    public function handle(Request $request): Stringable|string
    {
        return json_encode([
            'active'   => DB::table('customer_lists')->whereNull('deleted_at')->count(),
            'archived' => DB::table('customer_lists')->whereNotNull('deleted_at')->count(),
            'total'    => DB::table('customer_lists')->count(),
        ]);
    }

    public function schema(JsonSchema $schema): array
    {
        return []; // ← no parameters needed
    }
}