# Carpeta fuente (siempre la misma)
$src_base = "C:\Users\ADATOS\Proyectos\devlogger\src\assets\icons\"
$target_base = "C:\Users\ADATOS\OneDrive - MONISA\Recursos\svgs\"

# Subcarpeta de origen
$src = Join-Path $src_base "src\classic\regular"

# Lista de destinos con su respectivo target
$routes = @(
    @{
        target = Join-Path $target_base "duotone-regular"
        dest   = Join-Path $src_base "src\duotones\regular"
    },
    @{
        target = Join-Path $target_base "duotone"
        dest   = Join-Path $src_base "src\duotones\solid"
    },
    @{
        target = Join-Path $target_base "solid"
        dest   = Join-Path $src_base "src\classic\solid"
    },
    @{
        target = Join-Path $target_base "light"
        dest   = Join-Path $src_base "src\classic\light"
    }
    # 👉 Aquí puedes seguir agregando más pares target/dest
)

# Obtener todos los archivos de la carpeta fuente (una sola vez)
$srcFiles = Get-ChildItem -Path $src -File

foreach ($route in $routes) {
    $target = $route.target
    $dest   = $route.dest

    # Crear carpeta destino si no existe
    if (-not (Test-Path -Path $dest)) {
        New-Item -ItemType Directory -Path $dest | Out-Null
    }

    foreach ($file in $srcFiles) {
        # Buscar el archivo con el mismo nombre en la carpeta target
        $targetFile = Get-ChildItem -Path $target -File -Filter $file.Name

        if ($targetFile) {
            # Copiar el archivo encontrado a la carpeta destino
            Copy-Item -Path $targetFile.FullName -Destination $dest -Force
            Write-Output "Copiado: $($targetFile.Name) → $dest"
        } else {
            Write-Output "No encontrado en target: $($file.Name)"
        }
    }
}
