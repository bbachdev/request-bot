import { ColumnDef } from "@tanstack/react-table"

export type QueueItem = {
  id: string;
  song: string;
  artist: string;
  requestedBy: string;
  notes: string;
}

export const queueColumns: ColumnDef<QueueItem>[] = [
  {
    accessorKey: "Song",
    header: "Song",
  },
  {
    accessorKey: "Artist",
    header: "Artist",
  },
  {
    accessorKey: "Requested By",
    header: "Requested By",
  },
  {
    accessorKey: "Notes",
    header: "Notes",
  }
]