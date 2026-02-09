param(
  [ValidateSet("ensure", "list", "path", "route", "open", "dispatch")]
  [string]$Action = "list",

  # Where to keep persistent named worktrees (outside the repo).
  [string]$WorktreesRoot = "C:\\pt-study-sop-worktrees",

  # Base ref for new worktrees if their branches don't exist yet.
  [string]$BaseRef = "main",

  [ValidateSet("integrate", "ui", "brain", "docs")]
  [string]$Role = "integrate",

  # Used by route/dispatch. Provide one or more files you expect to touch.
  [string[]]$Paths = @(),

  [ValidateSet("powershell", "codex", "claude", "opencode", "custom")]
  [string]$Tool = "powershell",

  # Optional tool args appended verbatim (keep it simple; quote carefully).
  [string]$ToolArgs = "",

  # For Tool=custom, run this command in the new window.
  [string]$CustomCommand = "",

  # Include a docs/tests-focused worktree.
  [switch]$IncludeDocs
)

$ErrorActionPreference = "Stop"

function Normalize-FsPath {
  param([string]$Path)

  if ([string]::IsNullOrWhiteSpace($Path)) { return "" }
  $p = $Path.Trim() -replace '/', '\\'
  try {
    return [System.IO.Path]::GetFullPath($p)
  } catch {
    return $p
  }
}

function Get-RepoRoot {
  $root = (& git rev-parse --show-toplevel 2>$null)
  if (-not $root) { throw "Not inside a git repo." }
  return (Normalize-FsPath $root)
}

function Get-Worktrees {
  $lines = & git worktree list --porcelain
  $items = @()
  $current = $null

  foreach ($line in $lines) {
    if ($line -like "worktree *") {
      if ($current) { $items += $current }
      $rawPath = ($line -replace "^worktree\s+", "").Trim()
      $current = [pscustomobject]@{ path = (Normalize-FsPath $rawPath); branch = ""; head = "" }
      continue
    }
    if (-not $current) { continue }
    if ($line -like "branch *") {
      $current.branch = ($line -replace "^branch\s+", "").Trim()
      continue
    }
    if ($line -like "HEAD *") {
      $current.head = ($line -replace "^HEAD\s+", "").Trim()
      continue
    }
  }

  if ($current) { $items += $current }
  return $items
}

function Ensure-Worktree {
  param(
    [string]$WorktreePath,
    [string]$BranchName
  )

  $worktreeFull = Normalize-FsPath $WorktreePath
  $branchRef = "refs/heads/$BranchName"

  if ($env:AGENT_WORKTREES_DEBUG -eq "1") {
    Write-Host "DEBUG: want path=[$worktreeFull] branch=[$branchRef]"
    $dbg = Get-Worktrees
    foreach ($wt in $dbg) {
      Write-Host "DEBUG: have path=[$($wt.path)] branch=[$($wt.branch)]"
    }
  }

  $existing = Get-Worktrees | Where-Object { $_.path -eq $worktreeFull -or $_.branch -eq $branchRef } | Select-Object -First 1
  if ($existing) {
    Write-Host "OK: worktree exists: $($existing.path) ($($existing.branch))"
    return
  }

  if (Test-Path $worktreeFull) {
    throw "Directory exists but is not registered as a worktree: $worktreeFull"
  }

  & git show-ref --verify --quiet $branchRef 2>$null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "Creating worktree from existing branch: $BranchName -> $worktreeFull"
    & git worktree add $worktreeFull $BranchName | Out-Null
    return
  }

  Write-Host "Creating worktree: $BranchName ($BaseRef) -> $worktreeFull"
  & git worktree add -b $BranchName $worktreeFull $BaseRef | Out-Null
}

$repoRoot = Get-RepoRoot
if (-not (Test-Path $WorktreesRoot)) {
  New-Item -ItemType Directory -Force -Path $WorktreesRoot | Out-Null
}

$map = @(
  [ordered]@{ role = "integrate"; branch = "wt/integrate"; dir = (Join-Path $WorktreesRoot "integrate") },
  [ordered]@{ role = "ui";        branch = "wt/ui";        dir = (Join-Path $WorktreesRoot "ui") },
  [ordered]@{ role = "brain";     branch = "wt/brain";     dir = (Join-Path $WorktreesRoot "brain") }
)
if ($IncludeDocs) {
  $map += [ordered]@{ role = "docs"; branch = "wt/docs"; dir = (Join-Path $WorktreesRoot "docs") }
}

function Find-RoleEntry {
  param([string]$WantedRole)
  return $map | Where-Object { $_.role -eq $WantedRole } | Select-Object -First 1
}

function Route-RoleFromPaths {
  param([string[]]$InputPaths)

  if (-not $InputPaths -or $InputPaths.Count -eq 0) {
    return "integrate"
  }

  $repoRootLower = $repoRoot.ToLowerInvariant()
  $roles = New-Object System.Collections.Generic.HashSet[string]

  foreach ($p in $InputPaths) {
    if ([string]::IsNullOrWhiteSpace($p)) { continue }

    $full = if ([System.IO.Path]::IsPathRooted($p)) {
      [System.IO.Path]::GetFullPath($p)
    } else {
      [System.IO.Path]::GetFullPath((Join-Path $repoRoot $p))
    }

    $fullLower = $full.ToLowerInvariant()
    if (-not $fullLower.StartsWith($repoRootLower)) {
      $roles.Add("integrate") | Out-Null
      continue
    }

    $rel = $full.Substring($repoRoot.Length).TrimStart([char[]]@('\', '/')) -replace '\\', '/'
    $top = ($rel -split "/", 2)[0].ToLowerInvariant()

    switch ($top) {
      "dashboard_rebuild" { $roles.Add("ui") | Out-Null }
      "brain"            { $roles.Add("brain") | Out-Null }
      "docs"             { if ($IncludeDocs) { $roles.Add("docs") | Out-Null } else { $roles.Add("integrate") | Out-Null } }
      "conductor"        { if ($IncludeDocs) { $roles.Add("docs") | Out-Null } else { $roles.Add("integrate") | Out-Null } }
      "scripts"          { if ($IncludeDocs) { $roles.Add("docs") | Out-Null } else { $roles.Add("integrate") | Out-Null } }
      default            { $roles.Add("integrate") | Out-Null }
    }
  }

  if ($roles.Count -eq 1) { return ($roles | Select-Object -First 1) }
  return "integrate"
}

switch ($Action) {
  "ensure" {
    Write-Host "Repo: $repoRoot"
    Write-Host "WorktreesRoot: $WorktreesRoot"
    foreach ($e in $map) {
      Ensure-Worktree -WorktreePath $e.dir -BranchName $e.branch
    }
    Write-Host ""
    & git worktree list
    exit 0
  }

  "list" {
    Write-Host "Repo: $repoRoot"
    Write-Host "WorktreesRoot: $WorktreesRoot"
    Write-Host ""
    Write-Host "Named roles:"
    foreach ($e in $map) {
      Write-Host ("- {0,-10} {1,-14} {2}" -f $e.role, $e.branch, $e.dir)
    }
    Write-Host ""
    & git worktree list
    exit 0
  }

  "path" {
    $entry = Find-RoleEntry -WantedRole $Role
    if (-not $entry) { throw "Unknown role: $Role" }
    Write-Output $entry.dir
    exit 0
  }

  "route" {
    $r = Route-RoleFromPaths -InputPaths $Paths
    Write-Output $r
    exit 0
  }

  "open" {
    $entry = Find-RoleEntry -WantedRole $Role
    if (-not $entry) { throw "Unknown role: $Role" }

    # Ensure just the requested role exists.
    Ensure-Worktree -WorktreePath $entry.dir -BranchName $entry.branch

    $cmd = ""
    switch ($Tool) {
      "powershell" { $cmd = "" }
      "codex"      { $cmd = "codex $ToolArgs" }
      "claude"     { $cmd = "claude $ToolArgs" }
      "opencode"   { $cmd = "opencode $ToolArgs" }
      "custom"     { $cmd = $CustomCommand }
    }

    $command = "cd `"$($entry.dir)`";"
    if (-not [string]::IsNullOrWhiteSpace($cmd)) {
      $command = "$command $cmd"
    }

    Start-Process powershell -ArgumentList "-NoExit", "-Command", $command
    Write-Host "Opened $Tool for role '$Role' at: $($entry.dir)"
    exit 0
  }

  "dispatch" {
    $r = Route-RoleFromPaths -InputPaths $Paths
    $entry = Find-RoleEntry -WantedRole $r
    if (-not $entry) { throw "Role not available (try -IncludeDocs?): $r" }

    Ensure-Worktree -WorktreePath $entry.dir -BranchName $entry.branch

    $cmd = ""
    switch ($Tool) {
      "powershell" { $cmd = "" }
      "codex"      { $cmd = "codex $ToolArgs" }
      "claude"     { $cmd = "claude $ToolArgs" }
      "opencode"   { $cmd = "opencode $ToolArgs" }
      "custom"     { $cmd = $CustomCommand }
    }

    $command = "cd `"$($entry.dir)`";"
    if (-not [string]::IsNullOrWhiteSpace($cmd)) {
      $command = "$command $cmd"
    }

    Start-Process powershell -ArgumentList "-NoExit", "-Command", $command
    Write-Host "Dispatched $Tool to role '$r' at: $($entry.dir)"
    exit 0
  }
}

throw "Unhandled action: $Action"
