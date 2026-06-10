<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\CustomerList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class CustomerListController extends Controller
{
    public function customerlist(){
        $customer = DB::table('customer_lists')
        ->select('customer_lists.*')
        ->limit(10)
        ->get();
        return Inertia::render('CustomerList/customerList', compact('customer'));
    }

public function addCustomer(Request $request)
{
    $validated = $request->validate([
        'name'        => 'required|string|max:255',
        'phonenumber' => 'required|string|max:11',
        'email'       => 'required|email|max:255',
        'address'     => 'required|string|max:255',
    ]);
    try {
        DB::table('customer_lists')->insert([
            'fullname'    => $validated['name'],
            'phonenumber' => $validated['phonenumber'],
            'email'       => $validated['email'],
            'address'     => $validated['address'],
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);
            
        return redirect()->route('customer-list.customerlist')->with('message','Successfully Save!');

    } catch (\Exception $e) {
        return redirect()->back()->withErrors([
            'errorMessage' => 'An error occurred while saving. Please try again.',
        ])->withInput();
        //   dd($e->getMessage()); 
    }
}
    
}
