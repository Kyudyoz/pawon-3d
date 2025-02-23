<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'materials';
    protected $guarded = [
        'id',
    ];
    protected $fillable = ['name', 'quantity', 'unit'];

    public function processed_material_details()
    {
        return $this->hasMany(ProcessedMaterialDetail::class);
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = Str::uuid();
        });
    }
}
