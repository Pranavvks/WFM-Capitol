"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Navbar } from "@/components/ui/navbar"
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ClaimRecord {
  claim_id: number
  applicant_name: string
  claim_type: string
  insurance_type: string
  approval_status: string
}

const fetchClaims = async (): Promise<ClaimRecord[]> => {
  const { data } = await axios.get('http://localhost:5001/claims')
  return data
}

export const columns: ColumnDef<ClaimRecord>[] = [
  {
    accessorKey: "claim_id",
    header: "ID",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("claim_id")}</div>
    ),
  },
  {
    accessorKey: "applicant_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Applicant Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("applicant_name")}</div>,
  },
  {
    accessorKey: "claim_type",
    header: "Claim Type",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("claim_type")}</div>
    ),
  },
  {
    accessorKey: "insurance_type",
    header: "Insurance Type",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("insurance_type")}</div>
    ),
  },
  {
    accessorKey: "approval_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("approval_status") as string
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === "Approved"
              ? "bg-green-500/20 text-green-400"
              : status === "Pending"
              ? "bg-yellow-500/20 text-yellow-400"
              : status === "Rejected"
              ? "bg-red-500/20 text-red-400"
              : "bg-purple-500/20 text-purple-400"
          }`}
        >
          {status}
        </span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const claim = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(claim.claim_id.toString())}
            >
              Copy claim ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => window.location.href = `/claim-details/${claim.claim_id}`}
            >
              View claim details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function ClaimApplications() {
  const { data, isLoading, error } = useQuery<ClaimRecord[], Error>({
    queryKey: ['claims'],
    queryFn: fetchClaims,
    staleTime: 60000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: (failureCount, error) => {
      if (error.message.includes('404')) return false
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })

  return (
    <div className="min-h-screen bg-[#0d0f11]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Liability Claims</h1>
            <p className="text-gray-400">Review all liability claim records here</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={data || []}
          searchKey="applicant_name"
          isLoading={isLoading}
          error={error}
          pageSize={6}
        />
      </div>
    </div>
  )
}

