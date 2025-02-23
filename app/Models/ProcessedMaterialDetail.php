<?php

namespace App\Models;

use Illuminate\Support\Str;
use App\Models\ProcessedMaterial;
use Illuminate\Database\Eloquent\Model;

class ProcessedMaterialDetail extends Model
{
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'processed_material_details';
    protected $guarded = [
        'id',
    ];

    public function material()
    {
        return $this->belongsTo(Material::class);
    }

    public function processed_material()
    {
        return $this->belongsTo(ProcessedMaterial::class);
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = Str::uuid();
        });
    }
}
