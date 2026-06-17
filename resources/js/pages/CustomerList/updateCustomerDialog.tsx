import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { AlertTriangleIcon } from 'lucide-react';
import { CustomerList } from '@/types';
import {
    Dialog, DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


interface EditCustomerDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    customer: CustomerList | null; // ← receives selected customer
}

export default function EditCustomerDialog({ open, setOpen, customer }: EditCustomerDialogProps) {

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        phonenumber: "",
        email: "",
        address: "",
    });

    // Fill form when customer changes
    useEffect(() => {
        if (customer) {
            setData({
                name: customer.fullname,
                phonenumber: customer.phonenumber,
                email: customer.email,
                address: customer.address,
            });
        }
    }, [customer, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/edit-customer/${customer?.id}`, {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-semibold">Edit Customer</DialogTitle>
                        <DialogDescription>
                            Update the information of the customer.
                        </DialogDescription>
                    </DialogHeader>

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
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" placeholder='Full name' type='text' value={data.name}
                                onChange={(e) => setData("name", e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="phonenumber">Phone Number</Label>
                            <Input id="phonenumber" name="phonenumber" placeholder='+63' type='text' value={data.phonenumber}
                                onChange={(e) => setData("phonenumber", e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" placeholder='example@email.com' type='email' value={data.email}
                                onChange={(e) => setData("email", e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" name="address" placeholder='Current Location' type='text' value={data.address}
                                onChange={(e) => setData("address", e.target.value)} />
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}