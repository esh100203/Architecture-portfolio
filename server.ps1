# Simple HTTP server for the portfolio site
# Run with: powershell -ExecutionPolicy Bypass -File server.ps1

$port = 5500
$root = $PSScriptRoot

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host ""
Write-Host "  Portfolio running at: http://localhost:$port" -ForegroundColor Green
Write-Host "  Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

# Open browser
Start-Process "http://localhost:$port"

$mimeTypes = @{
  '.html' = 'text/html'
  '.css'  = 'text/css'
  '.js'   = 'application/javascript'
  '.mjs'  = 'application/javascript'
  '.svg'  = 'image/svg+xml'
  '.png'  = 'image/png'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.ico'  = 'image/x-icon'
  '.mp4'  = 'video/mp4'
  '.glb'  = 'model/gltf-binary'
  '.gltf' = 'model/gltf+json'
}

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response

  $urlPath = $req.Url.LocalPath
  if ($urlPath -eq '/') { $urlPath = '/index.html' }

  # Strip leading /public from URL (serve public/ as root for /images, /textures, etc.)
  $filePath = Join-Path $root $urlPath.TrimStart('/')
  if (-not (Test-Path $filePath)) {
    $filePath = Join-Path $root "public$urlPath"
  }

  if (Test-Path $filePath -PathType Leaf) {
    $ext  = [System.IO.Path]::GetExtension($filePath).ToLower()
    $mime = if ($mimeTypes[$ext]) { $mimeTypes[$ext] } else { 'application/octet-stream' }
    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    $res.ContentType   = $mime
    $res.ContentLength64 = $bytes.Length
    # Allow importmap + ES modules
    $res.Headers.Add('Access-Control-Allow-Origin', '*')
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $res.StatusCode = 404
    $body = [Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
    $res.OutputStream.Write($body, 0, $body.Length)
  }

  $res.Close()
}
