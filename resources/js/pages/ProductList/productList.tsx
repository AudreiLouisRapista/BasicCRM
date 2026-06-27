import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { CheckCheck } from "lucide-react";
import AddProductDialog from './addProductDialog';
import ProductTable from './productTable';


import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
// import { Button } from '@/components/ui/button';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Product List',
        href: '/product-lists',
    },
];


export default function ProductList() {

    const { flash = {} } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product List" />

            <div className='m-4'>
                <div>
                    {flash.message && (
                        <Alert className="max-w-md">
                            <CheckCheck className='h-4 w-4' />
                            <AlertTitle>Notification</AlertTitle>
                            <AlertDescription>
                                {flash.message}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
            <div className='flex items-left justify-left'>
                <div className='m-4'>
                    <AddProductDialog />
                </div>
            </div>

            <div className='m-4'>
                <ProductTable />

            </div>

        </AppLayout>
    );
}