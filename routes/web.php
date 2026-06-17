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
    Route::get('/archive-customer', [CustomerListController:: class, 'archiveCustomer'])->name('customer-list.archiveCustomer');
    Route::delete('/force-delete-customer/{id}', [CustomerListController::class, 'force_delete_customer'])->name('force_delete_customer');
    Route::post('/restore-customer/{id}', [CustomerListController::class, 'restore_customer'])->name('restore_customer');
    Route::post('/add-customer', [CustomerListController:: class, 'addCustomer'])->name('customer-list.addCustomer');
    Route::post('/archive-customer/{id}', [CustomerListController:: class, 'archive'])->name('customer-list.archive');
    Route::post('/edit-customer/{id}', [CustomerListController::class, 'update'])->name('customer-list.update');


});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
