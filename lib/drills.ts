export type DrillDifficulty = "Beginner" | "Intermediate" | "Advanced";

export type DrillCategory =
  | "PowerShell Function Design"
  | "Windows Automation"
  | "Support Automation"
  | "Cmdlet Design"
  | "Developer Experience";

export type Drill = {
  title: string;
  category: DrillCategory;
  difficulty: DrillDifficulty;
  prompt: string;
  rubric: string[];
  solution: string;
};

export const STARTER_TEMPLATE = `function Invoke-MyAutomation {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory)]
        [string]$InputValue
    )

    # TODO: implement logic

    [PSCustomObject]@{
        Success = $true
        Input   = $InputValue
    }
}`;

export const drills: Drill[] = [
  {
    title: "Command Discovery Helper",
    category: "PowerShell Function Design",
    difficulty: "Beginner",
    prompt:
      "Write a PowerShell advanced function that checks whether a command exists on PATH and returns a helpful error if not. The function should accept a command name as a parameter and return structured output when the command is found.",
    rubric: [
      "Uses Verb-Noun naming",
      "Uses CmdletBinding() for advanced-function behavior",
      "Accepts command name as a parameter",
      "Uses Get-Command safely",
      "Returns structured output instead of only writing text",
      "Provides a clear and actionable error path",
    ],
    solution: `function Test-CommandExists {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory)]
        [string]$Name
    )

    $command = Get-Command -Name $Name -ErrorAction SilentlyContinue

    if (-not $command) {
        throw "Command '$Name' was not found in PATH. Verify installation and environment configuration."
    }

    [PSCustomObject]@{
        Name        = $command.Name
        CommandType = $command.CommandType
        Source      = $command.Source
        Path        = $command.Path
    }
}`,
  },
  {
    title: "Environment Refresh Tool",
    category: "Windows Automation",
    difficulty: "Intermediate",
    prompt:
      "Design a PowerShell function that refreshes environment variables so a newly installed CLI is immediately usable in the current shell. Focus on Windows behavior and explain the difference between machine-level and user-level PATH values.",
    rubric: [
      "Explains process vs user vs machine environment scope",
      "Safely reads user and machine PATH values",
      "Updates the current process environment",
      "Avoids unsafe assumptions about shell restart behavior",
      "Uses readable output and predictable function structure",
    ],
    solution: `function Update-SessionPath {
    [CmdletBinding()]
    param ()

    $machinePath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
    $userPath = [System.Environment]::GetEnvironmentVariable("Path", "User")

    $combined = @($machinePath, $userPath) -join ";"
    $env:Path = $combined

    [PSCustomObject]@{
        Refreshed = $true
        MachinePathLength = $machinePath.Length
        UserPathLength = $userPath.Length
        CombinedPathLength = $combined.Length
    }
}`,
  },
  {
    title: "CLI Diagnostics Collector",
    category: "Support Automation",
    difficulty: "Intermediate",
    prompt:
      "Write a PowerShell function that gathers debugging information for a Windows CLI support case. It should collect the current user, PowerShell version, PATH, execution policy, and the resolved location of a requested command.",
    rubric: [
      "Accepts the command name as input",
      "Collects multiple useful diagnostic signals",
      "Handles missing commands gracefully",
      "Returns structured output",
      "Demonstrates support/debugging awareness",
    ],
    solution: `function Get-CliDiagnostics {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory)]
        [string]$CommandName
    )

    $resolved = Get-Command -Name $CommandName -ErrorAction SilentlyContinue

    [PSCustomObject]@{
        UserName        = $env:USERNAME
        PowerShell      = $PSVersionTable.PSVersion.ToString()
        ExecutionPolicy = (Get-ExecutionPolicy)
        CommandName     = $CommandName
        CommandFound    = [bool]$resolved
        CommandPath     = if ($resolved) { $resolved.Source } else { $null }
        Path            = $env:Path
    }
}`,
  },
  {
    title: "Safe File Cleanup Cmdlet",
    category: "Cmdlet Design",
    difficulty: "Advanced",
    prompt:
      "Design a PowerShell cmdlet for cleaning up temporary files in a workspace, but make it safe for real users. It should support preview behavior, clear targeting, and helpful output.",
    rubric: [
      "Uses approved PowerShell verb naming",
      "Includes safe targeting of files/directories",
      "Supports WhatIf or ShouldProcess semantics",
      "Returns structured result data",
      "Avoids destructive behavior by default",
      "Communicates what was removed or skipped",
    ],
    solution: `function Remove-WorkspaceTempFile {
    [CmdletBinding(SupportsShouldProcess)]
    param (
        [Parameter(Mandatory)]
        [string]$Path
    )

    $items = Get-ChildItem -Path $Path -Filter *.tmp -File -ErrorAction Stop
    $removed = @()

    foreach ($item in $items) {
        if ($PSCmdlet.ShouldProcess($item.FullName, "Remove temporary file")) {
            Remove-Item -Path $item.FullName -Force
            $removed += $item.FullName
        }
    }

    [PSCustomObject]@{
        TargetPath = $Path
        Removed    = $removed
        Count      = $removed.Count
    }
}`,
  },
  {
    title: "User-Friendly Installer Wrapper",
    category: "Developer Experience",
    difficulty: "Intermediate",
    prompt:
      "Write a PowerShell function that wraps a CLI installation workflow and improves the user experience. It should verify prerequisites, report progress clearly, and explain what to do next.",
    rubric: [
      "Validates prerequisites before continuing",
      "Provides clear success/failure messaging",
      "Includes actionable next steps",
      "Avoids vague or purely technical error text",
      "Shows awareness of install UX on Windows",
    ],
    solution: `function Install-ToolingWithChecks {
    [CmdletBinding()]
    param ()

    $winget = Get-Command winget -ErrorAction SilentlyContinue
    if (-not $winget) {
        throw "winget is not available. Install App Installer from Microsoft Store before continuing."
    }

    Write-Output "Installing Git..."
    winget install --id Git.Git --accept-source-agreements --accept-package-agreements

    Write-Output "Installation complete. Open a new terminal or refresh your session PATH before using git."
}`,
  },
];

export const allCategories: string[] = [
  "All",
  ...new Set(drills.map((d) => d.category)),
];

export const allDifficulties: string[] = [
  "All",
  ...new Set(drills.map((d) => d.difficulty)),
];
