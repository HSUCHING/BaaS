"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import {
  SearchIcon,
  PlusIcon,
  VerticalDotsIcon,
  ChevronDownIcon,
} from "@/components/icons";
import APIDrawer from '@/components/APIDrawer';

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "接口名称", uid: "name", sortable: true },
  { name: "端口", uid: "port" },
  { name: "模版合约", uid: "contract" },
  { name: "创建时间", uid: "createdAt", sortable: true },
  { name: "操作", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "name",
  "port",
  "contract",
  "createdAt",
  "actions",
];

// 测试数据
const apiList = [
  {
    id: 1,
    name: "接口1",
    port: "8080",
    contract: "合约1",
    heightQueryUrl: "/api/height",
    hashQueryUrl: "/api/hash",
    traceUrl: "/api/trace",
    preciseQueryUrl: "/api/precise",
    fuzzySearchUrl: "/api/fuzzy",
    blockchainInfoUrl: "/api/info",
    uploadUrl: "/api/upload",
    txHashQueryUrl: "/api/tx",
    txBlockQueryUrl: "/api/block",
    createdAt: "2024-01-20 12:00:00",
  },
  {
    id: 2,
    name: "接口2",
    port: "8081",
    contract: "合约2",
    heightQueryUrl: "/api/height",
    hashQueryUrl: "/api/hash",
    traceUrl: "/api/trace",
    preciseQueryUrl: "/api/precise",
    fuzzySearchUrl: "/api/fuzzy",
    blockchainInfoUrl: "/api/info",
    uploadUrl: "/api/upload",
    txHashQueryUrl: "/api/tx",
    txBlockQueryUrl: "/api/block",
    createdAt: "2024-01-21 13:00:00",
  },
];

export default function APICenter() {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "createdAt",
    direction: "descending",
  });
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerMode, setDrawerMode] = React.useState<'create' | 'edit' | 'view'>('create');
  const [selectedAPI, setSelectedAPI] = React.useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [apiToDelete, setAPIToDelete] = React.useState<any>(null);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filtered = [...apiList];
    if (hasSearchFilter) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filtered;
  }, [apiList, filterValue]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const renderCell = React.useCallback((api, columnKey) => {
    const cellValue = api[columnKey];

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Dropdown className="dark">
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onPress={() => {
                  setSelectedAPI(api);
                  setDrawerMode('view');
                  setDrawerOpen(true);
                }}>查看</DropdownItem>
                <DropdownItem onPress={() => {
                  setSelectedAPI(api);
                  setDrawerMode('edit');
                  setDrawerOpen(true);
                }}>编辑</DropdownItem>
                <DropdownItem 
                  className="text-danger" 
                  color="danger"
                  onPress={() => {
                    setAPIToDelete(api);
                    setDeleteModalOpen(true);
                  }}
                >
                  删除
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="搜索接口..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onSearchChange("")}
            onValueChange={onSearchChange}
            variant="bordered"
            classNames={{
              base: "max-w-full",
              inputWrapper: [
                "bg-white/5",
                "border-white/10",
                "group-data-[focus=true]:border-white/30",
                "hover:border-white/20",
                "!cursor-text",
                "shadow-xl",
                "backdrop-blur-sm"
              ].join(" "),
            }}
          />
          <div className="flex gap-3">
            <Dropdown className="dark">
              <DropdownTrigger>
                <Button
                  endContent={<ChevronDownIcon className="text-small" />} 
                  variant="bordered"
                  radius="sm"
                  className="border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  显示列
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="显示列"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button 
              color="primary" 
              radius="sm" 
              endContent={<PlusIcon />}
              onPress={() => {
                setDrawerMode('create');
                setDrawerOpen(true);
              }}
            >
              新建接口
            </Button>
          </div>
        </div>
      </div>
    );
  }, [filterValue, visibleColumns, onSearchChange]);

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedAPI(null);
  };

  const handleDrawerSubmit = (data: any) => {
    if (drawerMode === 'create') {
      console.log('Create:', data);
    } else if (drawerMode === 'edit') {
      console.log('Edit:', data);
    }
  };

  const handleDelete = () => {
    console.log('Deleting API:', apiToDelete?.id);
    // TODO: 调用删除 API
    setDeleteModalOpen(false);
    setAPIToDelete(null);
  };

  return (
    <div className="flex-1 p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-white">接口管理</h1>
      </div>

      <Table
        aria-label="接口列表表格"
        isHeaderSticky
        radius="sm"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={setPage}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[calc(100vh-300px)]",
          td: "py-1 text-base h-8",
          th: "text-base h-8 first:rounded-l-sm last:rounded-r-sm",
          tr: "h-12"
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "start" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"暂无数据"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* 删除确认对话框 */}
      <Modal 
        isOpen={deleteModalOpen} 
        onClose={() => {
          setDeleteModalOpen(false);
          setAPIToDelete(null);
        }}
        classNames={{
          base: "dark",
          backdrop: "bg-black/50",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-white">确认删除</span>
              </ModalHeader>
              <ModalBody>
                <p className="text-white/90">
                  确定要删除接口 "{apiToDelete?.name}" 吗？此操作无法撤销。
                </p>
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="default" 
                  variant="light" 
                  onPress={onClose}
                >
                  取消
                </Button>
                <Button 
                  color="danger" 
                  onPress={handleDelete}
                >
                  删除
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <APIDrawer
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        mode={drawerMode}
        data={selectedAPI}
        onSubmit={handleDrawerSubmit}
      />
    </div>
  );
} 