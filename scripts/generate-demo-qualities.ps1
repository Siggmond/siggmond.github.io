Param(
  [string]$InputDir = ".",
  [string]$OutputDir = "."
)

$ErrorActionPreference = "Stop"

function Require-Command {
  Param([Parameter(Mandatory = $true)][string]$Name)
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Required command not found in PATH: $Name"
  }
}

function Convert-Quality {
  Param(
    [Parameter(Mandatory = $true)][string]$InputPath,
    [Parameter(Mandatory = $true)][string]$OutputPath,
    [Parameter(Mandatory = $true)][string]$ScaleWidth,
    [Parameter(Mandatory = $true)][string]$Bitrate
  )

  & ffmpeg -y -i $InputPath -vf "scale='min($ScaleWidth,iw)':-2" -c:v libvpx-vp9 -b:v $Bitrate -crf 34 -row-mt 1 -tile-columns 2 -frame-parallel 1 -an $OutputPath
  if ($LASTEXITCODE -ne 0) {
    throw "ffmpeg failed while generating: $OutputPath"
  }
}

Require-Command -Name "ffmpeg"

$inputs = @(
  "vd1.webm",
  "vd2.webm",
  "vd3.webm"
)

$generated = New-Object System.Collections.Generic.List[string]

foreach ($name in $inputs) {
  $inputPath = Join-Path $InputDir $name
  if (-not (Test-Path $inputPath)) {
    throw "Missing input video: $inputPath"
  }

  $stem = [System.IO.Path]::GetFileNameWithoutExtension($name)
  $lowPath = Join-Path $OutputDir ("{0}_low.webm" -f $stem)
  $medPath = Join-Path $OutputDir ("{0}_med.webm" -f $stem)

  Convert-Quality -InputPath $inputPath -OutputPath $lowPath -ScaleWidth "960" -Bitrate "950k"
  Convert-Quality -InputPath $inputPath -OutputPath $medPath -ScaleWidth "1440" -Bitrate "1900k"

  $generated.Add((Split-Path -Leaf $lowPath)) | Out-Null
  $generated.Add((Split-Path -Leaf $medPath)) | Out-Null
}

Write-Host ""
Write-Host "Generated files to upload to GitHub Release:"
foreach ($name in $generated) {
  Write-Host "- $name"
}
Write-Host ""
Write-Host "Expected full demo set after upload:"
Write-Host "- vd1_low.webm, vd1_med.webm, vd1.webm"
Write-Host "- vd2_low.webm, vd2_med.webm, vd2.webm"
Write-Host "- vd3_low.webm, vd3_med.webm, vd3.webm"
