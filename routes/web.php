<?php
use  App\Http\Controllers\CustomerListController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('/customer-lists', [CustomerListController:: class, 'customerlist'])->name('customer-list.customerlist');
    Route::post('/add-customer', [CustomerListController:: class, 'addCustomer'])->name('customer-list.addCustomer');
    Route::post('/archive-customer/{id}', [CustomerListController:: class, 'archive'])->name('customer-list.archive');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
