"use client";

import { useEffect, useMemo, useState } from "react";

type DrillDifficulty = "Beginner" | "Intermediate" | "Advanced";
type DrillCategory =
  | "PowerShell Function Design"
  | "Windows Automation"
  | "Support Automation"
  | "Cmdlet Design"
  | "Developer Experience";

type Drill = {
  title: string;
  category: DrillCategory;
  difficulty: DrillDifficulty;
  prompt: string;
  rubric: string[];
  solution: string;
};

const STORAGE_KEY = "automation-drills-state-v2";

const drills: Drill[] = [
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

const starterTemplate = `function Invoke-MyAutomation {
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

type StoredState = {
  drillIndex: number;
  showRubric: boolean;
  showSolution: boolean;
  answers: Record<number, string>;
  selectedCategory: string;
  selectedDifficulty: string;
};

const allCategories = ["All", ...new Set(drills.map((d) => d.category))];
const allDifficulties = ["All", ...new Set(drills.map((d) => d.difficulty))];

function getDefaultState(): StoredState {
  return {
    drillIndex: 0,
    showRubric: true,
    showSolution: false,
    answers: { 0: starterTemplate },
    selectedCategory: "All",
    selectedDifficulty: "All",
  };
}

export default function AutomationPage() {
  const [hydrated, setHydrated] = useState(false);
  const [drillIndex, setDrillIndex] = useState(0);
  const [showRubric, setShowRubric] = useState(true);
  const [showSolution, setShowSolution] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({
    0: starterTemplate,
  });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [copied, setCopied] = useState(false);

  const filteredIndexes = useMemo(() => {
    return drills
      .map((drill, index) => ({ drill, index }))
      .filter(({ drill }) => {
        const categoryMatch =
          selectedCategory === "All" || drill.category === selectedCategory;
        const difficultyMatch =
          selectedDifficulty === "All" ||
          drill.difficulty === selectedDifficulty;
        return categoryMatch && difficultyMatch;
      })
      .map(({ index }) => index);
  }, [selectedCategory, selectedDifficulty]);

  const activeIndexes = filteredIndexes.length > 0 ? filteredIndexes : [0];
  const activePosition = Math.max(
    0,
    activeIndexes.findIndex((value) => value === drillIndex)
  );
  const safeDrillIndex = activeIndexes.includes(drillIndex)
    ? drillIndex
    : activeIndexes[0];

  const drill = drills[safeDrillIndex];
  const answer = answers[safeDrillIndex] ?? starterTemplate;

  const progressLabel = useMemo(
    () => `Prompt ${activePosition + 1} of ${activeIndexes.length}`,
    [activePosition, activeIndexes.length]
  );

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoredState>;

        const safeIndex =
          typeof parsed.drillIndex === "number" &&
          parsed.drillIndex >= 0 &&
          parsed.drillIndex < drills.length
            ? parsed.drillIndex
            : 0;

        setDrillIndex(safeIndex);
        setShowRubric(parsed.showRubric ?? true);
        setShowSolution(parsed.showSolution ?? false);
        setSelectedCategory(parsed.selectedCategory ?? "All");
        setSelectedDifficulty(parsed.selectedDifficulty ?? "All");
        setAnswers(
          parsed.answers && Object.keys(parsed.answers).length > 0
            ? parsed.answers
            : { [safeIndex]: starterTemplate }
        );
      }
    } catch {
      // ignore bad localStorage data
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const state: StoredState = {
      drillIndex: safeDrillIndex,
      showRubric,
      showSolution,
      answers,
      selectedCategory,
      selectedDifficulty,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [
    safeDrillIndex,
    showRubric,
    showSolution,
    answers,
    selectedCategory,
    selectedDifficulty,
    hydrated,
  ]);

  useEffect(() => {
    setCopied(false);
  }, [safeDrillIndex]);

  useEffect(() => {
    if (!filteredIndexes.includes(drillIndex) && filteredIndexes.length > 0) {
      setDrillIndex(filteredIndexes[0]);
    }
  }, [filteredIndexes, drillIndex]);

  const setAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [safeDrillIndex]: value,
    }));
  };

  const next = () => {
    const nextPosition = (activePosition + 1) % activeIndexes.length;
    const nextIndex = activeIndexes[nextPosition];
    setDrillIndex(nextIndex);
    setShowSolution(false);
    setCopied(false);
    setAnswers((prev) => ({
      ...prev,
      [nextIndex]: prev[nextIndex] ?? starterTemplate,
    }));
  };

  const previous = () => {
    const prevPosition =
      (activePosition - 1 + activeIndexes.length) % activeIndexes.length;
    const prevIndex = activeIndexes[prevPosition];
    setDrillIndex(prevIndex);
    setShowSolution(false);
    setCopied(false);
    setAnswers((prev) => ({
      ...prev,
      [prevIndex]: prev[prevIndex] ?? starterTemplate,
    }));
  };

  const loadSolutionIntoEditor = () => {
    setAnswer(drill.solution);
  };

  const resetCurrentEditor = () => {
    setAnswer(starterTemplate);
  };

  const clearAllDrafts = () => {
    const reset = getDefaultState();
    setDrillIndex(reset.drillIndex);
    setShowRubric(reset.showRubric);
    setShowSolution(reset.showSolution);
    setAnswers(reset.answers);
    setSelectedCategory(reset.selectedCategory);
    setSelectedDifficulty(reset.selectedDifficulty);
    setCopied(false);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const copySolution = async () => {
    try {
      await navigator.clipboard.writeText(drill.solution);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading automation drills...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Automation Drills
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-100">
              PowerShell & Cmdlet Practice
            </h1>

            <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300">
              Practice building Windows-focused automation helpers, advanced
              functions, and support tooling that reflect real engineering work.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-200">
              {drill.category}
            </span>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-950 dark:text-purple-200">
              {drill.difficulty}
            </span>
            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {progressLabel}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-950"
            >
              {allCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-950"
            >
              {allDifficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Prompt
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {drill.title}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={previous}
                className="min-h-[44px] rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                ← Previous
              </button>
              <button
                type="button"
                onClick={next}
                className="min-h-[44px] rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Next →
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm leading-7 text-gray-700 dark:text-gray-300">
              {drill.prompt}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowRubric((value) => !value)}
              className="min-h-[44px] rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {showRubric ? "Hide Rubric" : "Show Rubric"}
            </button>

            <button
              type="button"
              onClick={() => setShowSolution((value) => !value)}
              className="min-h-[44px] rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              {showSolution ? "Hide Solution" : "Show Solution"}
            </button>

            <button
              type="button"
              onClick={resetCurrentEditor}
              className="min-h-[44px] rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Reset Editor
            </button>

            <button
              type="button"
              onClick={clearAllDrafts}
              className="min-h-[44px] rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 dark:border-red-800 dark:bg-gray-900 dark:text-red-300 dark:hover:bg-red-950/40"
            >
              Clear Saved Drafts
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-300 dark:bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-yellow-300 dark:bg-yellow-500" />
                <span className="h-3 w-3 rounded-full bg-green-300 dark:bg-green-500" />
              </div>

              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                PowerShell Editor
              </p>
            </div>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              spellCheck={false}
              placeholder="Write your PowerShell function here..."
              className="min-h-[360px] w-full resize-y border-0 bg-white px-4 py-4 font-mono text-sm leading-6 text-gray-900 outline-none dark:bg-gray-950 dark:text-gray-100"
            />
          </div>
        </section>

        <aside className="space-y-6">
          {showRubric && (
            <section className="rounded-3xl border border-yellow-300 bg-yellow-50 p-5 shadow-sm sm:p-6 dark:border-yellow-800 dark:bg-yellow-950 dark:shadow-none">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Evaluation Criteria
              </h3>

              <ul className="mt-4 space-y-2">
                {drill.rubric.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl bg-white px-3 py-3 text-sm text-gray-700 dark:bg-gray-900 dark:text-gray-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {showSolution && (
            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Sample Solution
                </h3>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={loadSolutionIntoEditor}
                    className="min-h-[44px] rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    Load into Editor
                  </button>

                  <button
                    type="button"
                    onClick={copySolution}
                    className="min-h-[44px] rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <pre className="mt-4 overflow-x-auto rounded-2xl border border-gray-200 bg-black p-4 text-sm text-green-200 dark:border-gray-800">
                <code>{drill.solution}</code>
              </pre>
            </section>
          )}

          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              What good answers usually include
            </h3>

            <div className="mt-4 space-y-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
              <p>Clear naming, structured output, and safe defaults.</p>
              <p>Parameter validation, helpful errors, and Windows-aware behavior.</p>
              <p>
                Design choices that make the tool easier for another engineer or
                user to trust and debug.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}