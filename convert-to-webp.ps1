# PowerShell script to convert images to WebP using ffmpeg
# Make sure you have ffmpeg installed: winget install ffmpeg or download from ffmpeg.org

$images = @(
    # App page images
    "public\assets\appdev\chat-image.png",
    "public\assets\appdev\user-profile.jpg",
    "public\assets\app-hero-img.png",
    "public\assets\newimages\mobileapp.png",
    "public\assets\react-native-icon.png",
    "public\assets\flutter-icon.png",
    "public\assets\swift-icon.png",
    "public\assets\kotlin-icon.png",
    "public\assets\nodejs-icon.png",
    "public\assets\firebase-icon.png",
    "public\assets\mongodb-icon.png",
    "public\assets\aws-icon.png",
    "public\assets\app-img-3.png",
    
    # Web page images
    "public\assets\newimages\laptop.png",
    "public\assets\newimages\whychoseus.png",
    "public\assets\WebDev\buildwithus.png"
)

Write-Host "🚀 Starting WebP conversion using ffmpeg..." -ForegroundColor Cyan
Write-Host ""

$convertedCount = 0
$skippedCount = 0
$errorCount = 0

foreach ($imagePath in $images) {
    if (Test-Path $imagePath) {
        $outputPath = $imagePath -replace '\.(png|jpg|jpeg)$', '.webp'
        
        try {
            # Convert with quality 85 (adjust as needed)
            ffmpeg -i $imagePath -quality 85 $outputPath -y 2>$null
            
            if ($LASTEXITCODE -eq 0) {
                $inputSize = (Get-Item $imagePath).Length
                $outputSize = (Get-Item $outputPath).Length
                $savings = [math]::Round(((1 - ($outputSize / $inputSize)) * 100), 1)
                
                Write-Host "✅ Converted: $imagePath → .webp ($savings% smaller)" -ForegroundColor Green
                $convertedCount++
            } else {
                Write-Host "❌ Error converting: $imagePath" -ForegroundColor Red
                $errorCount++
            }
        }
        catch {
            Write-Host "❌ Error converting: $imagePath - $_" -ForegroundColor Red
            $errorCount++
        }
    }
    else {
        Write-Host "⚠️  Skipped: $imagePath (file not found)" -ForegroundColor Yellow
        $skippedCount++
    }
}

Write-Host ""
Write-Host "✨ Conversion complete!" -ForegroundColor Cyan
Write-Host "   Converted: $convertedCount" -ForegroundColor Green
Write-Host "   Skipped: $skippedCount" -ForegroundColor Yellow
Write-Host "   Errors: $errorCount" -ForegroundColor Red
Write-Host ""
Write-Host "💡 Note: Original images are preserved. Delete them after verifying WebP versions work." -ForegroundColor Gray
