<?php

namespace Database\Seeders;

use App\Models\Categoria;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nombres = [
            'Camisas',
            'Camisetas',
            'Sacos',
            'Jeans',
            'Pantalón',
            'Pantalonetas',
            'Polos',
            'Chaquetas',
        ];

        foreach ($nombres as $nombre) {
            Categoria::updateOrCreate(['nombre' => $nombre]);
        }
    }
}
