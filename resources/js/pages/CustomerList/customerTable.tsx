import { Button } from "@/components/ui/button";
import { usePage, router } from '@inertiajs/react';
import { PageProps, CustomerList } from '@/types';
import { useState } from 'react';
import { Badge } from "@/components/ui/badge"
import { UserPen, FolderDown } from 'lucide-react';
import TablePagination from '@/components/TablePagination';
import UpdateCustomerDialog from './updateCustomerDialog'
import {
    Table, TableBody, TableCaption, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

export default function CustomerTable() {
    const { customer = { data: [], current_page: 1, last_page: 1, per_page: 10, total: 0 } }
        = usePage<PageProps>().props;
    const { current_page, last_page } = customer;

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<{ id: number, fullname: string } | null>(null);

    const [processing, setProcessing] = useState(false);

    const handleArchiveClick = (id: number, fullname: string) => {
        setSelected({ id, fullname }); // ← store selected customer
        setOpen(true);                 // ← open confirmation dialog
    };

    const handleConfirmArchive = () => {
        if (!selected) return;
        setProcessing(true)
        router.post(`/archive-customer/${selected.id}`, {}, {
            onSuccess: () => {
                setOpen(false);
                setSelected(null);
            },
            onError: () => {
                setProcessing(false);
            }
        });
    };

    const [editOpen, setEditOpen] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<CustomerList | null>(null);

    const handleEditClick = (item: CustomerList) => {
        setSelectedEdit(item);
        setEditOpen(true);
    };

    return (
        <div>
            {/* Confirmation Dialog for Archiving */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Archive Customer</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to archive <strong>{selected?.fullname}</strong>?
                            This can be restored later.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={handleConfirmArchive}
                            disabled={processing}
                        >
                            {processing ? 'Archiving...' : 'Archive'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <UpdateCustomerDialog
                open={editOpen}
                setOpen={setEditOpen}
                customer={selectedEdit}
            />

            {/* Table */}
            {customer.data.length > 0 ? (
                <div className='m-4'>
                    <Table>
                        <TableCaption>A list of your recent Customers.</TableCaption>
                        <TableHeader >
                            <TableRow >
                                <TableHead className="w-[100px] text-center">ID</TableHead>
                                <TableHead className="text-center">Fullname</TableHead>
                                <TableHead className="text-center">Phonenumber</TableHead>
                                <TableHead className="text-center">Email</TableHead>
                                <TableHead className="text-center">Address</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="text-center">
                            {customer.data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.id}</TableCell>
                                    <TableCell>{item.fullname}</TableCell>
                                    <TableCell>{item.phonenumber}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>{item.address}</TableCell>
                                    <TableCell> <Badge variant="destructive">Destructive</Badge></TableCell>
                                    <TableCell className="text-center">
                                        <div className='flex items-center justify-center gap-2'>
                                            <Button
                                                variant="success"
                                                onClick={() => handleEditClick(item)}
                                            >
                                                <UserPen />
                                            </Button>
                                            <Button variant="destructive"
                                                onClick={() => handleArchiveClick(item.id, item.fullname)}
                                            >
                                                <FolderDown />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {/* Pagination */}
                    <TablePagination
                        current_page={current_page}
                        last_page={last_page}
                        url="/customer-lists"  // ← pass the route
                    />

                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    <p className="text-lg font-medium">No customers found</p>
                    <p className="text-sm">Add a customer to get started</p>
                </div>
            )}
        </div>
    );
}