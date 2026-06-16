import { Button } from "@/components/ui/button";
import { usePage, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';
import TablePagination from '@/components/TablePagination';
import {
    Table, TableBody, TableCaption, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

export default function CustomerTable() {
    // In customerTable.tsx
    const { customer = { data: [], current_page: 1, last_page: 1, per_page: 10, total: 0 } }
        = usePage<PageProps>().props;
    const { current_page, last_page } = customer;

    // DELETE 
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<{ id: number, fullname: string } | null>(null);
    const { delete: destroy, processing } = useForm({});
    const handleDeleteClick = (id: number, fullname: string) => {
        setSelected({ id, fullname }); // ← store selected customer
        setOpen(true);                 // ← open confirmation dialog
    };
    const handleConfirmArchive = () => {
        if (!selected) return;
        destroy(`/force_delete_customer/${selected.id}`, {
            onSuccess: () => {
                setOpen(false);
                setSelected(null);
            },
            onError: () => {
                console.error('Archive failed');
            }
        });
    };

    // RESTORE 
    const [restoreOpen, setRestoreOpen] = useState(false);
    const [selectedRestore, setSelectedRestore] = useState<{ id: number, fullname: string } | null>(null);
    const { post, processing: restoreProcessing } = useForm({});
    const handleRestoreClick = (id: number, fullname: string) => {
        setSelectedRestore({ id, fullname });
        setRestoreOpen(true);
    };
    const handleConfirmRestore = () => {
        if (!selectedRestore) return;
        post(`/restore-customer/${selectedRestore.id}`, {
            onSuccess: () => {
                setRestoreOpen(false);
                setSelectedRestore(null);
            },
            onError: () => {
                console.error('Restoring failed');
            }
        });
    };

    return (
        <div>
            {/* Confirmation Dialog Delete */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete Customer</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{selected?.fullname}</strong>?
                            This can be restored later.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-red-500 hover:bg-red-700"
                            onClick={handleConfirmArchive}
                            disabled={processing}
                        >
                            {processing ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog Restore */}
            <Dialog open={restoreOpen} onOpenChange={setRestoreOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete Customer</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{selected?.fullname}</strong>?
                            This can be restored later.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-blue-400 hover:bg-blue-700"
                            onClick={handleConfirmRestore}
                            disabled={restoreProcessing}
                        >
                            {restoreProcessing ? 'Restoring...' : 'Restore'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            {/* Table */}
            {customer.data.length > 0 ? (
                <div className='m-4'>
                    <Table>
                        <TableCaption>A list of your recent Customers.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Fullname</TableHead>
                                <TableHead>Phonenumber</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customer.data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.id}</TableCell>
                                    <TableCell>{item.fullname}</TableCell>
                                    <TableCell>{item.phonenumber}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>{item.address}</TableCell>
                                    <TableCell className="text-center">
                                        <div className='flex items-center justify-center gap-2'>
                                            <Button disabled={restoreProcessing}
                                                className='bg-blue-400 hover:bg-blue-700'
                                                onClick={() => handleRestoreClick(item.id, item.fullname)}
                                            >
                                                Restore
                                            </Button>
                                            <Button disabled={processing}
                                                className='bg-red-500 hover:bg-red-700'
                                                onClick={() => handleDeleteClick(item.id, item.fullname)}
                                            >
                                                Delete
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