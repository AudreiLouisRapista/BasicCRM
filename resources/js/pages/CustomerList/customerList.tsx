import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import AddCustomerDialog from './addCustomerDialog';
import CustomerTable from './customerTable';
import { CheckCheck } from "lucide-react";

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customer List',
        href: '/customer-lists',
    },
];


export default function CustomerList() {

    const { flash = {} } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customer List" />
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

            <div className='m-4'>
                <AddCustomerDialog />
            </div>

            <div className='m-4'>
                <CustomerTable />
            </div>

        </AppLayout>
    );
}