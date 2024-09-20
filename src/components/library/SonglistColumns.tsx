'use client'

import { Song } from '@/lib/schema'
import { ColumnDef } from "@tanstack/react-table"

export const songlistColumns: ColumnDef<Song>[] = [
  {
    accessorKey: 'title',
    header: 'Title'
  },
  {
    accessorKey: 'artist',
    header: 'Artist'
  },
  {
    accessorKey: 'times_played',
    header: 'Times Played'
  },
  {
    accessorKey: 'last_played',
    header: 'Last Played'
  }
]