<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class ProcessedMaterial extends Model
{
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'processed_materials';
    protected $guarded = [
        'id',
    ];
    protected $fillable = ['name', 'quantity'];

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
