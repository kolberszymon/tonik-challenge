import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  FilterFn,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import React, { useState, useMemo, useEffect } from "react";
import PaginationPicker from "./PaginationPicker";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import GlobalStore from "@/store/GlobalStore";
import { GithubRepoFormatted } from "@/types/GithubTypes";

interface TableProps {
  data: any;
  pageSize: number;
}

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const Table: React.FC<TableProps> = ({
  // columns,
  data,
  pageSize = 10,
}) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo<ColumnDef<GithubRepoFormatted, any>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: (info) => {
          return (
            <a
              href={info.row.original.html_url}
              target="_blank"
              className="hover:text-purple-500"
            >
              {info.row.original.name}
            </a>
          );
        },
      },
      { header: "Owner", accessorKey: "owner" },
      { header: "Stars", accessorKey: "stars" },
      { header: "Created at", accessorKey: "created_at" },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      globalFilter,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  const setPage = (pageIndex: number | "plus" | "minus") => {
    if (pageIndex === "minus") {
      GlobalStore.decrementPage();
    } else if (pageIndex === "plus") {
      GlobalStore.incrementPage();
    } else {
      if (pageIndex >= 1 && pageIndex <= table.getPageCount()) {
        table.setPageIndex(pageIndex - 1);
      }
    }
  };

  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize]);

  return (
    <div className="min-w-full flex flex-col gap-3 mt-8">
      <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none flex items-center"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {{
                        asc: <IoIosArrowUp />,
                        desc: <IoIosArrowDown />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="whitespace-nowrap px-4 py-2 text-sm text-gray-500"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="text-center text-gray-600 text-sm pt-6">
          There is currently no data.
        </div>
      )}
      <div className="flex justify-center">
        <PaginationPicker setPage={setPage} />
      </div>
    </div>
  );
};

export default Table;
