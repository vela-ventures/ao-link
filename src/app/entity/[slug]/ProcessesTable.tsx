import { Paper, TableCell, TableRow, Tooltip } from "@mui/material"
import { useRouter } from "next/navigation"
import React from "react"

import { AsyncTable, AsyncTableProps, HeaderCell } from "@/components/AsyncTable"
import { IdBlock } from "@/components/IdBlock"
import { TypeBadge } from "@/components/TypeBadge"
import { AoMessage } from "@/utils/ao-event-utils"
import { TYPE_PATH_MAP, truncateId } from "@/utils/data-utils"
import { formatFullDate, formatRelative } from "@/utils/date-utils"
import { formatNumber } from "@/utils/number-utils"

import { RetryableMsgCount } from "./RetryableMsgCount"

type ProcessesTableProps = Pick<AsyncTableProps, "fetchFunction" | "pageSize"> & {
  hideModuleColumn?: boolean
}

export function ProcessesTable(props: ProcessesTableProps) {
  const { hideModuleColumn } = props
  const router = useRouter()

  const headerCells: HeaderCell[] = [
    { label: "Type", sx: { width: 140 } },
    { label: "ID", sx: { width: 220 } },
    { label: "Name" },
    // { label: "Tags" },
    { label: "Module" },
    { label: "Incoming messages", align: "right", sx: { width: 160 } },
    {
      label: "Block Height",
      sx: { width: 160 },
      align: "right",
    },
    {
      field: "created",
      label: "Created",
      sx: { width: 160 },
      align: "right",
      sortable: true,
    },
  ]

  if (hideModuleColumn) {
    headerCells.splice(3, 1)
  }

  return (
    <AsyncTable
      {...props}
      component={Paper}
      initialSortDir="desc"
      initialSortField="created"
      headerCells={headerCells}
      renderRow={(item: AoMessage) => (
        <TableRow
          sx={{ cursor: "pointer" }}
          key={item.id}
          onClick={() => {
            router.push(`/${TYPE_PATH_MAP[item.type]}/${item.id}`)
          }}
        >
          <TableCell>
            <TypeBadge type={item.type} />
          </TableCell>
          <TableCell>
            <IdBlock label={truncateId(item.id)} value={item.id} href={`/entity/${item.id}`} />
          </TableCell>
          <TableCell>{item.tags["Name"]}</TableCell>
          {!hideModuleColumn && (
            <TableCell>
              <IdBlock
                label={truncateId(item.tags["Module"])}
                value={item.tags["Module"]}
                href={`/module/${item.tags["Module"]}`}
              />
            </TableCell>
          )}
          <TableCell align="right">
            <RetryableMsgCount processId={item.id} />
          </TableCell>
          <TableCell align="right">
            {item.blockHeight === null ? (
              "Processing"
            ) : (
              <IdBlock
                label={formatNumber(item.blockHeight)}
                value={String(item.blockHeight)}
                href={`/block/${item.blockHeight}`}
              />
            )}
          </TableCell>
          <TableCell align="right">
            <Tooltip title={formatFullDate(item.created)}>
              <span>{formatRelative(item.created)}</span>
            </Tooltip>
          </TableCell>
        </TableRow>
      )}
    />
  )
}
