'use client'
import { ColumnDef } from "@tanstack/react-table"

export type QueueItem = { 
  id: string,
  title: string,
  artist: string,
  requested_by: string,
  notes: string,
  position: number
  cover_image_url: string
}

export const queueColumns: ColumnDef<QueueItem>[] = [
  {
    accessorKey: 'title',
    header: 'Title'
  },
  {
    accessorKey: 'artist',
    header: 'Artist'
  },
  {
    accessorKey: 'requested_by',
    header: 'Requested By'
  },
  {
    accessorKey: 'notes',
    header: 'Notes'
  }
]