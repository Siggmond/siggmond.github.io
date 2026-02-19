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

Require-Command -Name "ffmpeg"

$inputs = @(
  @{ Index = 1; Name = "vd1.webm" },
  @{ Index = 2; Name = "vd2.webm" },
  @{ Index = 3; Name = "vd3.webm" }
)

$generated = New-Object System.Collections.Generic.List[string]

foreach ($item in $inputs) {
  $index = $item.Index
  $inputPath = Join-Path $InputDir $item.Name
  if (-not (Test-Path $inputPath)) {
    throw "Missing input video: $inputPath"
  }

  $posterPath = Join-Path $OutputDir ("poster-vd{0}.jpg" -f $index)
  $previewPath = Join-Path $OutputDir ("vd{0}_preview.webm" -f $index)

  & ffmpeg -y -ss 00:00:01 -i $inputPath -frames:v 1 -q:v 2 $posterPath
  if ($LASTEXITCODE -ne 0) {
    throw "ffmpeg failed while generating poster: $posterPath"
  }

  & ffmpeg -y -ss 00:00:00 -i $inputPath -t 8 -vf "fps=24,scale='min(960,iw)':-2" -c:v libvpx-vp9 -b:v 1800k -an $previewPath
  if ($LASTEXITCODE -ne 0) {
    throw "ffmpeg failed while generating preview: $previewPath"
  }

  $generated.Add((Split-Path -Leaf $posterPath)) | Out-Null
  $generated.Add((Split-Path -Leaf $previewPath)) | Out-Null
}

Write-Host ""
Write-Host "Generated release assets:"
foreach ($name in $generated) {
  Write-Host "- $name"
}
Write-Host ""
Write-Host "Upload these 6 files to the GitHub Release tag used by CI (v1.0 by default)."
