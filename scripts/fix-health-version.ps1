# Ensure all Health Connect dependencies use the same version after `npx cap sync`
$files = @(
    "android/app/capacitor.build.gradle",
    "android/capacitor-cordova-android-plugins/build.gradle",
    "android/app/build.gradle"
)

foreach ($f in $files) {
    $path = Join-Path $PSScriptRoot "..\$f"
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        if ($content -match "connect-client:1\.1\.0[^-\s]") {
            $content = $content -replace "connect-client:1\.1\.0(?!-alpha10)", "connect-client:1.1.0-alpha10"
            Set-Content $path $content -NoNewline
            Write-Host "Fixed: $f"
        }
    }
}
