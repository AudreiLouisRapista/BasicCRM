import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { AlertTriangleIcon, CheckCheck } from "lucide-react";
import { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customer List',
        href: '/customer-lists',
    },
];

interface CustomerList {
    id: number,
    fullname: string,
    phonenumber: number,
    email: string,
    address: string,
}


interface PageProps {
    flash: {
        message?: string
    }
    customer: CustomerList[]
}

export default function CustomerList() {

    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        phonenumber: "",
        email: "",
        address: "",
    });

    const hundleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/add-customer', {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    const { customer, flash } = usePage().props as PageProps;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customer List" />
            <div className='m-4'>
                <div>
                    {flash.message && (
                        <Alert className="max-w-md">
                            <CheckCheck className='h-4 w-4' />
                            <AlertTitle>Account save successfully</AlertTitle>
                            <AlertDescription>
                                {flash.message}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
            <div className="m-4">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => setOpen(true)}>
                            Add Customer
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <form onSubmit={hundleSubmit}>
                            <DialogHeader className="mb-4">
                                <DialogTitle className="text-xl font-semibold">Customer Information</DialogTitle>
                                <DialogDescription>
                                    Add all the information of the customer.
                                </DialogDescription>
                            </DialogHeader>

                            {/* Display Error */}
                            {Object.keys(errors).length > 0 && (
                                <Alert className="mb-4 border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
                                    <AlertTriangleIcon className="h-4 w-4" />
                                    <AlertTitle>Please fix the following errors:</AlertTitle>
                                    <AlertDescription>
                                        <ul className="list-disc list-inside space-y-1 text-sm">
                                            {Object.entries(errors).map(([key, message]) => (
                                                <li key={key}>{message as string}</li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="name-1">Name</Label>
                                    <Input id="name-1" name="name" placeholder='Full name' type='text' value={data.name}
                                        onChange={(e) => setData("name", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="phonenumber-1">Phone Number</Label>
                                    <Input id="phonenumber-1" name="phonenumber" placeholder='+63' type='text' value={data.phonenumber}
                                        onChange={(e) => setData("phonenumber", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="email-1">Email</Label>
                                    <Input id="email-1" name="email" placeholder='example@email.com' type='email' value={data.email}
                                        onChange={(e) => setData("email", e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="address-1">Address</Label>
                                    <Input id="address-1" name="address" placeholder='Current Location' type='text' value={data.address}
                                        onChange={(e) => setData("address", e.target.value)} />
                                </div>
                            </div>

                            <DialogFooter className="mt-6">
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {customer.length > 0 && (
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
                            {customer.map((customer) => (
                                <TableRow>
                                    <TableCell className="font-medium">{customer.id}</TableCell>
                                    <TableCell>{customer.fullname}</TableCell>
                                    <TableCell>{customer.phonenumber}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.address}</TableCell>
                                    <TableCell className="text-center">
                                        <div className='flex items-center justify-center gap-2'>
                                            <Button className='bg-slate-500 hover:bg-slate-700'>Edit</Button>
                                            <Button className='bg-red-500 hover:bg-red-700'>Archive</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </AppLayout>
    );
}