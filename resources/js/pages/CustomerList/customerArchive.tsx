import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import CustomerTableArchive from './customerTableArchive';
import { CheckCheck } from "lucide-react";

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { Button } from '@/components/ui/button';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customer Archive',
        href: '/archive-customer',
    },
];


export default function CustomerArchive() {

    const { flash = {} } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customer List" />
            <div className='m-4'>
                <Link href={route('customer-list.customerlist')}> <Button variant="outline">Back</Button> </Link>
            </div>
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
                <CustomerTableArchive />
            </div>

        </AppLayout>
    );
}