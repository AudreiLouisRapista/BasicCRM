import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { AlertTriangleIcon } from 'lucide-react';
import {
    Dialog, DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AddProductDialog() {

    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        productName: "",
        productCategory: "",
        productPrice: "",
        productQuantity: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/add-product', {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>
                    Add Product
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-semibold">Product Information</DialogTitle>
                        <DialogDescription>
                            Add all the information of the product.
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
                            <Label htmlFor="productName-1">Product name</Label>
                            <Input id="productName-1" name="productName" type='text' value={data.productName}
                                onChange={(e) => setData("productName", e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="productCategory-1">Category</Label>
                            <Input id="productCategory-1" name="productCategory" type='text' value={data.productCategory}
                                onChange={(e) => setData("productCategory", e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="productPrice-1">Price</Label>
                            <Input id="productPrice-1" name="productPrice" type='number' value={data.productPrice}
                                onChange={(e) => setData("productPrice", e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="productQuantity-1">Quantity</Label>
                            <Input id="productQuantity-1" name="productQuantity" type='number' value={data.productQuantity}
                                onChange={(e) => setData("productQuantity", e.target.value)} />
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
    );
}