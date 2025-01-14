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
import UserDrawer from '@/components/UserDrawer';

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "用户名", uid: "username", sortable: true },
  { name: "姓名", uid: "name", sortable: true },
  { name: "角色", uid: "role" },
  { name: "局办", uid: "department" },
  { name: "创建时间", uid: "createdAt", sortable: true },
  { name: "操作", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "username",
  "name",
  "role",
  "department",
  "createdAt",
  "actions",
];

// 测试数据
const userList = [
  {
    id: 1,
    username: "admin",
    name: "管理员",
    role: "管理员",
    department: "技术部",
    createdAt: "2024-01-20 12:00:00",
  },
  {
    id: 2,
    username: "user1",
    name: "张三",
    role: "普通用户",
    department: "运营部",
    createdAt: "2024-01-21 13:00:00",
  },
];

export default function UserCenter() {
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
  const [selectedUser, setSelectedUser] = React.useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<any>(null);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filtered = [...userList];
    if (hasSearchFilter) {
      filtered = filtered.filter((item) =>
        item.username.toLowerCase().includes(filterValue.toLowerCase()) ||
        item.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filtered;
  }, [userList, filterValue]);

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

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

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
                  setSelectedUser(user);
                  setDrawerMode('view');
                  setDrawerOpen(true);
                }}>查看</DropdownItem>
                <DropdownItem onPress={() => {
                  setSelectedUser(user);
                  setDrawerMode('edit');
                  setDrawerOpen(true);
                }}>编辑</DropdownItem>
                <DropdownItem 
                  className="text-danger" 
                  color="danger"
                  onPress={() => {
                    setUserToDelete(user);
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
            placeholder="搜索用户..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onSearchChange("")}
            onValueChange={onSearchChange}
            variant="bordered"
            classNames={{
              base: "max-w-full",
              label: "text-white/90 font-normal",
              input: ["text-white", "placeholder:text-white/60"].join(" "),
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
              新建用户
            </Button>
          </div>
        </div>
      </div>
    );
  }, [filterValue, visibleColumns, onSearchChange]);

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedUser(null);
  };

  const handleDrawerSubmit = (data: any) => {
    if (drawerMode === 'create') {
      console.log('Create:', data);
    } else if (drawerMode === 'edit') {
      console.log('Edit:', data);
    }
  };

  const handleDelete = () => {
    console.log('Deleting user:', userToDelete?.id);
    // TODO: 调用删除 API
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  return (
    <div className="flex-1 p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-white">用户管理</h1>
      </div>

      <Table
        aria-label="用户列表表格"
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
          setUserToDelete(null);
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
                  确定要删除用户 "{userToDelete?.name}" 吗？此操作无法撤销。
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

      <UserDrawer
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        mode={drawerMode}
        data={selectedUser}
        onSubmit={handleDrawerSubmit}
      />
    </div>
  );
} 