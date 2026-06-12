<?php

namespace App\Services;

use App\Models\Pedido;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class WompiServicio
{
    public function estaConfigurado(): bool
    {
        return filled(config('services.wompi.private_key'));
    }

    public function crearLinkDePago(Pedido $pedido): array
    {
        $response = Http::acceptJson()
            ->withToken(config('services.wompi.private_key'))
            ->post($this->baseUrl().'/payment_links', [
                'name' => 'JD Store - Pedido #'.$pedido->id,
                'description' => 'Pago del pedido '.$pedido->referencia_pago,
                'single_use' => true,
                'collect_shipping' => false,
                'currency' => 'COP',
                'amount_in_cents' => (int) round(((float) $pedido->total) * 100),
                'expires_at' => now()->addMinutes($this->expirationMinutes())->toIso8601String(),
                'redirect_url' => $this->buildRedirectUrl($pedido),
                'sku' => substr((string) $pedido->referencia_pago, 0, 36),
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('Wompi no pudo generar el link de pago.');
        }

        $data = $response->json('data');

        if (! is_array($data) || empty($data['id'])) {
            throw new RuntimeException('Respuesta inesperada de Wompi al crear el link.');
        }

        return $data;
    }

    public function obtenerTransaccion(string $transactionId): array
    {
        $response = Http::acceptJson()
            ->withToken(config('services.wompi.private_key'))
            ->get($this->baseUrl().'/transactions/'.$transactionId);

        if (! $response->successful()) {
            throw new RuntimeException('No se pudo consultar la transacción en Wompi.');
        }

        $data = $response->json('data');

        if (! is_array($data) || empty($data['id'])) {
            throw new RuntimeException('Respuesta inesperada de Wompi al consultar la transacción.');
        }

        return $data;
    }

    public function validarFirmaEvento(array $payload, ?string $checksumHeader = null): bool
    {
        $secret = (string) config('services.wompi.events_secret');
        $signature = $payload['signature'] ?? null;

        if ($secret === '' || ! is_array($signature)) {
            return false;
        }

        $properties = $signature['properties'] ?? [];
        $timestamp = (string) ($signature['timestamp'] ?? '');
        $checksumRecibido = strtolower((string) ($checksumHeader ?: ($signature['checksum'] ?? '')));

        if (! is_array($properties) || $timestamp === '' || $checksumRecibido === '') {
            return false;
        }

        $base = '';

        foreach ($properties as $property) {
            $value = data_get($payload['data'] ?? [], $property);

            if (is_bool($value)) {
                $value = $value ? 'true' : 'false';
            } elseif (is_array($value)) {
                $value = json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            }

            $base .= (string) $value;
        }

        $checksumGenerado = hash('sha256', $base.$timestamp.$secret);

        return hash_equals($checksumGenerado, $checksumRecibido);
    }

    public function extraerCheckoutUrl(array $linkPago): ?string
    {
        $url = $linkPago['permalink']
            ?? $linkPago['url']
            ?? $linkPago['public_url']
            ?? $linkPago['checkout_url']
            ?? null;

        if ((! is_string($url) || $url === '') && ! empty($linkPago['id'])) {
            $url = 'https://checkout.wompi.co/l/'.$linkPago['id'];
        }

        return is_string($url) && $url !== '' ? $url : null;
    }

    private function buildRedirectUrl(Pedido $pedido): string
    {
        $frontendUrl = rtrim((string) config('services.wompi.frontend_url'), '/');

        return $frontendUrl.'/checkout/resultado?pedido_id='.$pedido->id;
    }

    private function expirationMinutes(): int
    {
        return max(5, (int) config('services.wompi.payment_link_expiration_minutes', 30));
    }

    private function baseUrl(): string
    {
        return $this->isProduction()
            ? 'https://production.wompi.co/v1'
            : 'https://sandbox.wompi.co/v1';
    }

    private function isProduction(): bool
    {
        return (string) config('services.wompi.environment', 'sandbox') === 'production';
    }
}
