"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Navbar } from "@/components/ui/navbar"
import { InsuranceRecord } from "@/mock-data/Insurancemock"
import { useQuery } from '@tanstack/react-query'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { APIInsuranceRecord, fetchInsuranceApplications, transformApiData } from '@/utils/insurance-utils'

export const columns: ColumnDef<InsuranceRecord>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "applicantName",
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
    cell: ({ row }) => <div className="capitalize">{row.getValue("applicantName")}</div>,
  },
  {
    accessorKey: "typeOfCustomer",
    header: "Category",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("typeOfCustomer")}</div>
    ),
  },
  {
    accessorKey: "insuranceType",
    header: "Insurance Type",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("insuranceType")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const record = row.original
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
              onClick={() => navigator.clipboard.writeText(record.id)}
            >
              Copy application ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => window.location.href = `/insurance-details/${record.id}`}
            >
              View application details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function InsuranceApplications() {
  const { data: apiData, isLoading, error, isError } = useQuery<APIInsuranceRecord[], Error>({
    queryKey: ['insuranceApplications'],
    queryFn: fetchInsuranceApplications,
    staleTime: 60000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: (failureCount, error) => {
      if (error.message.includes('404')) return false
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
  
  const transformedData = React.useMemo(() => {
    if (!apiData || isError) return []
    try {
      return transformApiData(apiData)
    } catch (e) {
      console.error('Error transforming data:', e)
      return []
    }
  }, [apiData, isError])

  return (
    <div className="min-h-screen bg-[#0d0f11]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Insurance Records</h1>
            <p className="text-gray-400">Manage and review all insurance applications</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={transformedData}
          searchKey="applicantName"
          isLoading={isLoading}
          error={error}
          pageSize={6}
        />
      </div>
    </div>
  )
}

