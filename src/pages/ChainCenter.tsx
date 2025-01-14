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
  Chip,
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
import ChainDrawer from '@/components/ChainDrawer'

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "名称", uid: "name", sortable: true },
  { name: "IP", uid: "ip" },
  { name: "操作系统", uid: "os" },
  { name: "描述", uid: "description" },
  { name: "状态", uid: "status", sortable: true },
  { name: "创建时间", uid: "createdAt", sortable: true },
  { name: "操作", uid: "actions" },
];

const statusColorMap = {
  active: "success",
  inactive: "danger",
  vacation: "warning",
};

const capitalize = (s: string) => {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
};

const statusOptions = [
  { name: "Active", cnName: "运行中", uid: "active" },
  { name: "Inactive", cnName: "已停止", uid: "inactive" },
  { name: "Vacation", cnName: "空闲中", uid: "vacation" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "name",
  "ip",
  "status",
  "createdAt",
  "actions",
];

const chainCenter = [
  {
    id: 1,
    name: "测试子链1",
    ip: "192.168.1.1",
    password: "123456",
    status: "active",
    os: "ubuntu",
    description: "测试子链1",
    createdAt: "2024-01-20 12:00:00",
  },
  {
    id: 2,
    name: "测试子链2",
    ip: "192.168.1.2",
    password: "123456",
    status: "inactive",
    os: "centos",
    description: "测试子链2",
    createdAt: "2024-01-21 13:00:00",
  },
  {
    id: 3,
    name: "测试子链3",
    ip: "192.168.1.3",
    password: "123456",
    status: "inactive",
    os: "centos",
    description: "测试子链3",
    createdAt: "2024-01-22 13:00:00",
  },
  {
    id: 4,
    name: "测试子链4",
    ip: "192.168.1.4",
    password: "123456",
    status: "active",
    os: "ubuntu",
    description: "测试子链4",
    createdAt: "2024-01-23 13:00:00",
  },
  // 添加更多测试数据...
];

export default function ChainCenter() {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [page, setPage] = React.useState(1);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "createdAt",
    name: "descending",
  });
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [drawerMode, setDrawerMode] = React.useState<'create' | 'edit' | 'view'>('create')
  const [selectedChain, setSelectedChain] = React.useState<any>(null)
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [chainToDelete, setChainToDelete] = React.useState<any>(null);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filtered = [...chainCenter];
    if (hasSearchFilter) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filtered = filtered.filter((obj) =>
        Array.from(statusFilter).includes(obj.status)
      );
    }
    return filtered;
  }, [chainCenter, filterValue, statusFilter]);

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

  //   const items = React.useMemo(() => {
  //     const start = (page - 1) * rowsPerPage;
  //     const end = start + rowsPerPage;
  //     return filteredItems.slice(start, end);
  //   }, [page, filteredItems, rowsPerPage]);

  const renderCell = React.useCallback((chain, columnKey) => {
    const cellValue = chain[columnKey];

    switch (columnKey) {
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[chain.status]}
            size="sm"
            variant="dot"
          >
            {chain.status === "active"
              ? "运行中"
              : chain.status === "inactive"
              ? "已停止"
              : "空闲中"}
          </Chip>
        );
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
                  setSelectedChain(chain);
                  setDrawerMode('view');
                  setDrawerOpen(true);
                }}>查看</DropdownItem>
                <DropdownItem onPress={() => {
                  setSelectedChain(chain);
                  setDrawerMode('edit');
                  setDrawerOpen(true);
                }}>编辑</DropdownItem>
                <DropdownItem 
                  className="text-danger" 
                  color="danger"
                  onPress={() => {
                    setChainToDelete(chain);
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

  const onSearchChange = React.useCallback((value) => {
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
            placeholder="搜索子链..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange} radius="sm"
          />
          <div className="flex gap-3">
            <Dropdown className="dark">
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat" radius="sm"
                >
                  状态
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {status.cnName}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown className="dark">
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat" radius="sm"
                >
                  显示列
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
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
          </div>
          <Button 
            color="primary" 
            radius="sm" 
            endContent={<PlusIcon />}
            onPress={() => {
              console.log('Create button clicked');
              setDrawerMode('create');
              setDrawerOpen(true);
            }}
          >
            新建子链
          </Button>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    hasSearchFilter,
  ]);

  const handleDrawerClose = () => {
    console.log('Closing drawer');
    setDrawerOpen(false);
    setSelectedChain(null);
  }

  const handleDrawerSubmit = (data: any) => {
    if (drawerMode === 'create') {
      console.log('Create:', data)
    } else if (drawerMode === 'edit') {
      console.log('Edit:', data)
    }
  }

  // 添加调试日志
  React.useEffect(() => {
    console.log('Drawer state:', { drawerOpen, drawerMode, selectedChain });
  }, [drawerOpen, drawerMode, selectedChain]);

  // 处理删除确认
  const handleDelete = () => {
    console.log('Deleting chain:', chainToDelete?.id);
    // TODO: 调用删除 API
    setDeleteModalOpen(false);
    setChainToDelete(null);
  };

  return (
    <div className="flex-1 p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-white">子链管理</h1>
      </div>

      <Table
        aria-label="子链列表表格"
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
          setChainToDelete(null);
        }}
        classNames={{
          base: "dark",  // 使用深色主题
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
                  确定要删除子链 "{chainToDelete?.name}" 吗？此操作无法撤销。
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

      <ChainDrawer
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        mode={drawerMode}
        data={selectedChain}
        onSubmit={handleDrawerSubmit}
      />
    </div>
  );
}
