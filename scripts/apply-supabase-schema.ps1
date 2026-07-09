# Aplicar schema en Supabase (requiere contraseña de Postgres)

Param(
  [Parameter(Mandatory = $true)][string]$DatabaseUrl
)

$ErrorActionPreference = 'Stop'
$schemaPath = Join-Path $PSScriptRoot '..\agents\supabase\schema.sql'
if (-not (Test-Path $schemaPath)) { throw "No se encontró $schemaPath" }

if (-not (Get-Command psql -ErrorAction SilentlyContinue)) {
  Write-Host 'Instala psql (PostgreSQL client) o pega agents/supabase/schema.sql en Supabase → SQL Editor.'
  exit 1
}

Write-Host 'Aplicando schema.sql…'
psql $DatabaseUrl -f $schemaPath
Write-Host 'Listo. Verifica tablas: leads, chat_sessions, knowledge_chunks, legal_alerts.'
