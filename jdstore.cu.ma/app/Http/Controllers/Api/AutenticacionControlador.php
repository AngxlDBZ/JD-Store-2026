<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\IniciarSesionRequest;
use App\Http\Requests\RegistrarUsuarioRequest;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AutenticacionControlador extends Controller
{
    private function normalizarDireccionesGuardadas(?array $direcciones): array
    {
        return collect($direcciones ?? [])
            ->map(fn ($direccion) => trim((string) $direccion))
            ->filter(fn ($direccion) => $direccion !== '' && mb_strlen($direccion) >= 8)
            ->unique()
            ->values()
            ->take(10)
            ->all();
    }

    private function enviarCorreoPlano(string $destinatarioEmail, string $destinatarioNombre, string $asunto, string $cuerpo): void
    {
        try {
            Mail::raw($cuerpo, function ($mensaje) use ($destinatarioEmail, $destinatarioNombre, $asunto) {
                $mensaje->from((string) config('mail.from.address'), (string) config('mail.from.name', 'JD Store'));
                $mensaje->to($destinatarioEmail, $destinatarioNombre)
                    ->subject($asunto);
            });

            return;
        } catch (\Throwable $smtpError) {
            Log::warning('Fallo envio SMTP, se intentará mail() nativo', [
                'error' => $smtpError->getMessage(),
                'exception' => get_class($smtpError),
            ]);
        }

        if (! function_exists('mail')) {
            throw new \RuntimeException('La función mail() no está disponible en el servidor.');
        }

        $fromAddress = (string) config('mail.from.address');
        $fromName = (string) config('mail.from.name', 'JD Store');
        $asuntoCodificado = '=?UTF-8?B?'.base64_encode($asunto).'?=';
        $remitente = trim($fromName) !== '' ? sprintf('%s <%s>', $fromName, $fromAddress) : $fromAddress;
        $headers = implode("\r\n", [
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'From: '.$remitente,
            'Reply-To: '.$fromAddress,
            'X-Mailer: PHP/'.PHP_VERSION,
        ]);

        $enviado = @mail($destinatarioEmail, $asuntoCodificado, $cuerpo, $headers, '-f '.$fromAddress);

        if (! $enviado) {
            throw new \RuntimeException('No se pudo enviar el correo usando mail() nativo.');
        }
    }

    public function registrar(RegistrarUsuarioRequest $request)
    {
        $datos = $request->validated();
        $datos['rol'] = 'cliente';
        $datos['estado'] = 'activo';
        $datos['direcciones_guardadas'] = $this->normalizarDireccionesGuardadas(array_filter([
            $datos['direccion'] ?? null,
            ...($datos['direcciones_guardadas'] ?? []),
        ]));

        $usuario = Usuario::create($datos);

        $token = $usuario->createToken('spa')->plainTextToken;

        return response()->json([
            'usuario' => $usuario,
            'token' => $token,
        ], 201);
    }

    public function iniciarSesion(IniciarSesionRequest $request)
    {
        $credenciales = $request->validated();

        $usuario = Usuario::query()->where('email', $credenciales['email'])->first();

        if (! $usuario || ! Hash::check($credenciales['password'], $usuario->password)) {
            throw ValidationException::withMessages(['email' => 'Credenciales inválidas']);
        }

        if ($usuario->estado !== 'activo') {
            return response()->json(['mensaje' => 'Usuario inactivo'], 403);
        }

        $usuario->tokens()->delete();
        $token = $usuario->createToken('spa')->plainTextToken;

        return response()->json([
            'usuario' => $usuario,
            'token' => $token,
        ]);
    }

    public function cerrarSesion(Request $request)
    {
        $usuario = $request->user();

        if ($usuario) {
            $usuario->currentAccessToken()?->delete();
        }

        return response()->json(['ok' => true]);
    }

    public function yo(Request $request)
    {
        return response()->json(['usuario' => $request->user()]);
    }

    public function actualizarPerfil(Request $request)
    {
        $usuario = $request->user();

        $datos = $request->validate([
            'nombre_completo' => ['required', 'string', 'min:3', 'max:255', 'regex:/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/u'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($usuario?->id)],
            'telefono' => ['nullable', 'digits:10'],
            'direccion' => ['required', 'string', 'min:8', 'max:255'],
            'direcciones_guardadas' => ['nullable', 'array', 'max:10'],
            'direcciones_guardadas.*' => ['string', 'min:8', 'max:255'],
        ]);

        $datos['direcciones_guardadas'] = $this->normalizarDireccionesGuardadas(array_filter([
            $datos['direccion'] ?? null,
            ...($datos['direcciones_guardadas'] ?? []),
        ]));

        $usuario->fill($datos);
        $usuario->save();

        return response()->json(['usuario' => $usuario->fresh()]);
    }

    public function enviarRecuperacionPassword(Request $request)
    {
        $request->validate(['email' => ['required', 'email']]);

        $email = (string) $request->input('email');

        $usuario = Usuario::query()->where('email', $email)->first();

        if (! $usuario || $usuario->estado !== 'activo') {
            return response()->json(['ok' => true]);
        }

        $temporal = Str::upper(Str::random(3)).'-'.random_int(100, 999).'-'.Str::lower(Str::random(3));

        $hashAnterior = $usuario->password;
        $temporalCreadoAnterior = $usuario->password_temporal_creado_en;
        $temporalAnterior = $usuario->password_temporal;

        $usuario->forceFill([
            'password' => Hash::make($temporal),
            'password_temporal' => true,
            'password_temporal_creado_en' => now(),
        ])->save();

        $cuerpo = "Hola {$usuario->nombre_completo},\n\n".
            "Recibimos una solicitud de recuperación de contraseña para tu cuenta en JD Store.\n\n".
            "Tu contraseña temporal es:\n\n".
            "{$temporal}\n\n".
            "Inicia sesión con esta contraseña y cámbiala desde tu perfil.\n\n".
            "Si tú no solicitaste este cambio, ignora este correo.\n\n".
            "— JD Store";

        try {
            $this->enviarCorreoPlano(
                (string) $usuario->email,
                (string) $usuario->nombre_completo,
                'Recuperación de contraseña - JD Store',
                $cuerpo
            );
        } catch (\Throwable $e) {
            Log::error('No se pudo enviar correo de recuperación', [
                'error' => $e->getMessage(),
                'exception' => get_class($e),
            ]);
            $usuario->forceFill([
                'password' => $hashAnterior,
                'password_temporal' => $temporalAnterior,
                'password_temporal_creado_en' => $temporalCreadoAnterior,
            ])->save();

            return response()->json(['mensaje' => 'No se pudo enviar el correo'], 422);
        }

        $usuario->tokens()->delete();

        return response()->json(['ok' => true]);
    }

    public function cambiarPassword(Request $request)
    {
        $request->validate([
            'password_actual' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $usuario = $request->user();

        if (! $usuario || ! Hash::check((string) $request->input('password_actual'), $usuario->password)) {
            throw ValidationException::withMessages(['password_actual' => 'La contraseña actual no es correcta']);
        }

        $usuario->forceFill([
            'password' => Hash::make((string) $request->input('password')),
            'remember_token' => Str::random(60),
            'password_temporal' => false,
            'password_temporal_creado_en' => null,
        ])->save();

        return response()->json(['ok' => true]);
    }
}
