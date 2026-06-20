<?php
namespace App\Ai\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Support\Facades\DB;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class GetCustomersTool implements Tool
{
    public function description(): Stringable|string
    {
        return 'Get the list of all active customers';
    }

    public function handle(Request $request): Stringable|string
    {
        $customers = DB::table('customer_lists')
            ->whereNull('deleted_at')
            ->select('id', 'fullname', 'email', 'phonenumber', 'address')
            ->get()
            ->toArray();

        return json_encode($customers);
    }

    public function schema(JsonSchema $schema): array
    {
        return []; // ← no parameters needed
    }
}