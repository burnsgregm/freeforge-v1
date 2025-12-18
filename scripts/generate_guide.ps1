param([string]$GuidePath)
$GuidePath = [System.IO.Path]::GetFullPath($GuidePath)

function Append-File {
    param([string]$FilePath)
    if (-not (Test-Path $FilePath)) { return }
    $RelPath = Resolve-Path $FilePath -Relative
    $Ext = [System.IO.Path]::GetExtension($FilePath).Trim('.')
    switch ($Ext) {
        "ts" { $Lang = "typescript" } "tsx" { $Lang = "typescript" }
        "js" { $Lang = "javascript" } "jsx" { $Lang = "javascript" }
        "py" { $Lang = "python" } "tf" { $Lang = "hcl" }
        "yml" { $Lang = "yaml" } "yaml" { $Lang = "yaml" }
        "ps1" { $Lang = "powershell" } "json" { $Lang = "json" }
        "css" { $Lang = "css" } "html" { $Lang = "html" }
        Default { $Lang = "" }
    }
    Add-Content -Path $GuidePath -Value "`n#### $RelPath`n"
    Add-Content -Path $GuidePath -Value "```$Lang"
    Get-Content $FilePath | Add-Content $GuidePath
    Add-Content -Path $GuidePath -Value "```"
}

Write-Host "Appending Root..."
Add-Content -Path $GuidePath -Value "`n## 1. Root`n"
Append-File ".\deploy.ps1"; Append-File ".\cloudbuild.yaml"; Append-File ".\docker-compose.yml"; Append-File ".\.gcloudignore"

Write-Host "Appending Infrastructure..."
Add-Content -Path $GuidePath -Value "`n## 2. Infrastructure`n"
Get-ChildItem ".\infrastructure" -Recurse -File -Include *.tf | ForEach-Object { Append-File $_.FullName }

Write-Host "Appending Server..."
Add-Content -Path $GuidePath -Value "`n## 3. Server`n"
Get-ChildItem ".\server" -Recurse -File -Include *.ts,*.json,Dockerfile | Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "dist" -and $_.FullName -notmatch "coverage" } | ForEach-Object { Append-File $_.FullName }

Write-Host "Appending Simulation..."
Add-Content -Path $GuidePath -Value "`n## 4. Simulation`n"
Get-ChildItem ".\simulation" -Recurse -File -Include *.py,requirements.txt,Dockerfile | Where-Object { $_.FullName -notmatch "__pycache__" -and $_.FullName -notmatch "venv" } | ForEach-Object { Append-File $_.FullName }

Write-Host "Appending Frontend..."
Add-Content -Path $GuidePath -Value "`n## 5. Frontend`n"
Get-ChildItem ".\frontend" -Recurse -File -Include *.tsx,*.ts,*.css,*.html,*.json,Dockerfile | Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "dist" -and $_.FullName -notmatch "coverage" } | ForEach-Object { Append-File $_.FullName }
