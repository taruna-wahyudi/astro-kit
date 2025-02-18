"use client"

import { Progress } from "./ui/progress"

interface ProgressBarProps {
  progress: number
  fileName: string
}

export function ProgressBar({ progress, fileName }: ProgressBarProps) {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{fileName}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} />
    </div>
  )
}