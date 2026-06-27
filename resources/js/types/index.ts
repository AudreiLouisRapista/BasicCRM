import { LucideIcon } from 'lucide-react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}


export interface PaginationData<T>{
    data: T[],
    current_page: number,
    last_page: number,
    per_page: number,
    total_page: number,
}
export interface PageProps extends InertiaPageProps  {
    customer: PaginationData<CustomerList>
    product: PaginationData<ProductList>
    flash: {
        message?: string
    }
}

export interface CustomerList {
    id: number,
    fullname: string,
    phonenumber: string,
    email: string,
    address: string,
    deleted_at: string | null,
}

export interface ProductList {
    id: number,
    product_name: string,
    product_category: string,
    product_price: number,
    product_quantity: number,
    deleted_at: string | null,
}