$ErrorActionPreference = 'Stop'

$projectId = '7324317543705053216'
$apiKey = $env:STITCH_API_KEY

if (-not $apiKey) {
  throw 'STITCH_API_KEY is required in the environment.'
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$requestDir = Join-Path $root 'requests'
$rawDir = Join-Path $root 'raw'
$downloadDir = Join-Path $root 'downloads'

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$screenIds = @(
  'e6070dbe3a874219993d075643448ef2',
  'asset-stub-assets-dc8999f873f245c8bd9c5ce8b862c4f3-1779993368397',
  '26ac5db54d3b4ae18fb13c1f798fc38b',
  '5af33309726a420bb190470690a2a3eb',
  'daf67fe4f42a47d1870f49dc82e658f9',
  '377ce35716094fedbdae92da70950691',
  '92843f35d0364f5d934687bce0b55b33',
  'd4fafbdca4e9412b8dda1815eaa87c5f'
)

function Invoke-StitchTool {
  param(
    [Parameter(Mandatory = $true)]
    [string]$ToolName,

    [Parameter(Mandatory = $true)]
    [string]$RequestFile
  )

  $result = & npx @_davideast/stitch-mcp tool $ToolName -f $RequestFile -o json
  if ($LASTEXITCODE -ne 0) {
    throw "Command failed: npx @_davideast/stitch-mcp tool $ToolName -f $RequestFile -o json"
  }

  return ($result -join "`n")
}

function Write-Utf8NoBom {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path,

    [Parameter(Mandatory = $true)]
    [string]$Content
  )

  [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

$summary = @()

foreach ($screenId in $screenIds) {
  $requestPath = Join-Path $requestDir "$screenId.json"
  $errorPath = Join-Path $rawDir "$screenId.error.txt"
  if (Test-Path $errorPath) {
    Remove-Item $errorPath -Force
  }
  $requestJson = @{
    projectId = $projectId
    screenId = $screenId
  } | ConvertTo-Json
  Write-Utf8NoBom -Path $requestPath -Content $requestJson

  $entry = [ordered]@{
    screenId = $screenId
    metadata = $null
    html = $null
    screenshot = $null
    error = $null
  }

  try {
    $metadataJson = Invoke-StitchTool -ToolName 'get_screen' -RequestFile $requestPath
    $metadataPath = Join-Path $rawDir "$screenId.get_screen.json"
    Write-Utf8NoBom -Path $metadataPath -Content $metadataJson
    $metadata = $metadataJson | ConvertFrom-Json
    $entry.metadata = $metadataPath

    $htmlJson = Invoke-StitchTool -ToolName 'get_screen_code' -RequestFile $requestPath
    $htmlJsonPath = Join-Path $rawDir "$screenId.get_screen_code.json"
    Write-Utf8NoBom -Path $htmlJsonPath -Content $htmlJson
    $htmlObject = $htmlJson | ConvertFrom-Json
    if ($null -ne $htmlObject.htmlContent) {
      $htmlPath = Join-Path $downloadDir "$screenId.html"
      Write-Utf8NoBom -Path $htmlPath -Content $htmlObject.htmlContent
      $entry.html = $htmlPath
    }

    if ($metadata.screenshot.downloadUrl) {
      $imagePath = Join-Path $downloadDir "$screenId.png"
      curl.exe -L $metadata.screenshot.downloadUrl -o $imagePath | Out-Null
      $entry.screenshot = $imagePath
    }

    if ($metadata.htmlCode.downloadUrl) {
      $hostedHtmlPath = Join-Path $downloadDir "$screenId.hosted.html"
      curl.exe -L $metadata.htmlCode.downloadUrl -o $hostedHtmlPath | Out-Null
    }
  } catch {
    $entry.error = $_.Exception.Message
    Write-Utf8NoBom -Path $errorPath -Content $_.Exception.ToString()
  }

  $summary += [pscustomobject]$entry
}

Write-Utf8NoBom -Path (Join-Path $root 'acquisition-summary.json') -Content ($summary | ConvertTo-Json -Depth 5)
