function Show-Help {
  Write-Output "Usage: yarn.ps1 [option...]"
  Write-Output ""
  Write-Output "   -h, --help       Show this help message"
  Write-Output "   -v, --version    Show script version"
  Write-Output "   -f, --force      Force delete .yarnrc.yml without asking"
  Write-Output ""
}

function Show-Version {
  Write-Output "1.0"
}

function Delete-Yarnrc {
  if (Test-Path .yarnrc.yml) {
    if ($ForceDelete) {
      Remove-Item .yarnrc.yml
    } else {
      $response = Read-Host "Do you really want to delete your current .yarnrc.yml? [Y/n]"
      if ($response -match "^[Yy]$" -or [string]::IsNullOrEmpty($response)) {
        Remove-Item .yarnrc.yml
      } else {
        exit 1
      }
    }
  }
}

# Parse command line arguments
$ForceDelete = $false
$args | ForEach-Object {
  switch ($_) {
    "-h" { Show-Help; exit }
    "--help" { Show-Help; exit }
    "-v" { Show-Version; exit }
    "--version" { Show-Version; exit }
    "-f" { $ForceDelete = $true }
    "--force" { $ForceDelete = $true }
    default { Write-Host "Invalid option: $_"; Show-Help; exit 1 }
  }
}

# Main script
corepack enable
Delete-Yarnrc
yarn set version stable
yarn set version 4.5.3 --yarn-path
yarn config set nodeLinker node-modules
yarn config set npmScopes.plentymarkets.npmRegistryServer "https://registry.npmjs.org"
yarn config set npmScopes.plentymarkets.npmAlwaysAuth false
yarn
