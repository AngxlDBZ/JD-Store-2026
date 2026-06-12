<?php

namespace Database\Seeders;

use App\Models\Usuario;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UsuarioAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Usuario::updateOrCreate(
            ['email' => 'admin@jdstore.com'],
            [
                'nombre_completo' => 'Administrador JD Store',
                'password' => 'Admin1234*',
                'telefono' => '3183260720',
                'direccion' => 'Centro Comercial La 14, Local 128, Piso 1, Ibagué, Tolima',
                'rol' => 'admin',
                'estado' => 'activo',
            ]
        );
    }
}
