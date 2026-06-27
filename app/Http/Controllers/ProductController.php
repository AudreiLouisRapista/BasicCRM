<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function productlist(){
        $product = DB::table('product_lists')
        ->select('product_lists.*')
        ->whereNull('deleted_at')
        ->orderBy('product_lists.id', 'desc')
        ->paginate(10);
        // ->get();
        return Inertia::render('ProductList/productList', compact('product'));
    }

    public function addProduct(Request $request)
    {
        
        $validated = $request->validate([
            'productName'        => 'required|string|max:255',
            'productCategory' => 'required|string|max:11',
            'productPrice'       => 'required|integer',
            'productQuantity'     => 'required|integer',
        ]);
        try {
            DB::table('product_lists')->insert([
                'product_name'    => $validated['productName'],
                'product_category' => $validated['productCategory'],
                'product_price'       => $validated['productPrice'],
                'product_quantity'     => $validated['productQuantity'],
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
                
            return redirect()->route('product-lists.productlist')->with('message','Successfully Save!');

        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'errorMessage' => 'An error occurred while saving. Please try again.',
            ])->withInput();
            //   dd($e->getMessage()); 
        }
    }
}
