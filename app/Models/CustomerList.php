<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerList extends Model
{
    protected $fillable = ['naem', 'phonenumber', 'email', 'address'];
}
