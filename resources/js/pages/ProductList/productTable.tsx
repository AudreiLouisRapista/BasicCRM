import { Button } from "@/components/ui/button";
import { usePage, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';
import { Badge } from "@/components/ui/badge"
import { UserPen, FolderDown } from 'lucide-react';
import TablePagination from '@/components/TablePagination';
// import UpdateCustomerDialog from './updateCustomerDialog'
import {
    Table, TableBody, TableCaption, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"


export default function ProductTable() {
    const { product = { data: [], current_page: 1, last_page: 1, per_page: 10, total: 0 } }
        = usePage<PageProps>().props;
    const { current_page, last_page } = product;

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<{ id: number, product_name: string } | null>(null);

    const [processing, setProcessing] = useState(false);

    const handleArchiveClick = (id: number, product_name: string) => {
        setSelected({ id, product_name }); // ← store selected product
        setOpen(true);                 // ← open confirmation product
    };

    const handleConfirmArchive = () => {
        if (!selected) return;
        setProcessing(true)
        router.post(`/archive-product/${selected.id}`, {}, {
            onSuccess: () => {
                setOpen(false);
                setSelected(null);
            },
            onError: () => {
                setProcessing(false);
            }
        });
    };

    // const [editOpen, setEditOpen] = useState(false);
    // const [selectedEdit, setSelectedEdit] = useState<ProductList | null>(null);

    // const handleEditClick = (item: ProductList) => {
    //     setSelectedEdit(item);
    //     setEditOpen(true);
    // };

    return (
        <div>
            {/* Confirmation Dialog for Archiving */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Archive Customer</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to archive <strong>{selected?.product_name}</strong>?
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

            {/* <UpdateCustomerDialog
                open={editOpen}
                setOpen={setEditOpen}
                customer={selectedEdit}
            /> */}

            {/* Table */}
            {product.data.length > 0 ? (
                <div className='m-4'>
                    <Table>
                        <TableCaption>A list of your recent Customers.</TableCaption>
                        <TableHeader >
                            <TableRow >
                                <TableHead className="w-[100px] text-center">ID</TableHead>
                                <TableHead className="text-center">Product Name</TableHead>
                                <TableHead className="text-center">Category</TableHead>
                                <TableHead className="text-center">Price</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="text-center">
                            {product.data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.id}</TableCell>
                                    <TableCell>{item.product_name}</TableCell>
                                    <TableCell>{item.product_category}</TableCell>
                                    <TableCell>{item.product_price}</TableCell>
                                    <TableCell>{item.product_quantity}</TableCell>
                                    <TableCell> <Badge variant="destructive">Destructive</Badge></TableCell>
                                    <TableCell className="text-center">
                                        <div className='flex items-center justify-center gap-2'>
                                            <Button
                                                variant="success"
                                            // onClick={() => handleEditClick(item)}
                                            >
                                                <UserPen />
                                            </Button>
                                            <Button variant="destructive"
                                                onClick={() => handleArchiveClick(item.id, item.product_name)}
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
                        url="/product-lists"  // ← pass the route
                    />

                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    <p className="text-lg font-medium">No Product found</p>
                    <p className="text-sm">Add a product to get started</p>
                </div>
            )}
        </div>
    );
}