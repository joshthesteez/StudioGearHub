function Show-Tree {
    param (
        [string]$Path = ".",
        [int]$Depth = 5,
        [int]$Level = 0,
        [System.Collections.Generic.List[string]]$Lines = [System.Collections.Generic.List[string]]::new(),
        [string[]]$Exclude = @("node_modules", ".next", "public")
    )

    if ($Level -ge $Depth) { return }

    Get-ChildItem -LiteralPath $Path | Where-Object {
        -not ($Exclude -contains $_.Name)
    } | ForEach-Object {
        $prefix = ('|   ' * $Level) + '+-- '
        $Lines.Add($prefix + $_.Name)

        if ($_.PSIsContainer) {
            Show-Tree -Path $_.FullName -Depth $Depth -Level ($Level + 1) -Lines $Lines -Exclude $Exclude
        }
    }

    return $Lines
}

# Save tree to output file in current directory
$outputFile = "tree_output.txt"
$treeLines = Show-Tree -Path "." -Depth 5
$treeLines | Out-File -Encoding UTF8 $outputFile
Write-Host "Tree structure saved to $outputFile"
