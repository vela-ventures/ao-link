import React from "react"

import { getProcesses } from "@/services/messages-api"

import { ProcessesTable } from "./ProcessesTable"

type ProcessesByModuleProps = {
  moduleId: string
  open: boolean
  onCountReady?: (count: number) => void
}

export function ProcessesByModule(props: ProcessesByModuleProps) {
  const { moduleId, open, onCountReady } = props

  if (!open) return null

  const pageSize = 25

  return (
    <ProcessesTable
      hideModuleColumn
      pageSize={pageSize}
      fetchFunction={async (offset, ascending, sortField, lastRecord) => {
        const [count, records] = await getProcesses(
          pageSize,
          lastRecord?.cursor,
          ascending,
          moduleId,
        )

        if (count !== undefined && onCountReady) {
          onCountReady(count)
        }

        return records
      }}
    />
  )
}
