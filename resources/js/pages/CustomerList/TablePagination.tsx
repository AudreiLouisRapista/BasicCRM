import { router } from '@inertiajs/react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface TablePaginationProps {
    current_page: number;
    last_page: number;
    url: string; // ← route url so it's reusable
}

export default function TablePagination({ current_page, last_page, url }: TablePaginationProps) {
    return (
        <Pagination className="mt-4">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => router.get(`${url}?page=${current_page - 1}`)}
                        className={current_page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>
                <PaginationItem>
                    <span className="text-sm px-4">
                        Page {current_page} of {last_page}
                    </span>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext
                        onClick={() => router.get(`${url}?page=${current_page + 1}`)}
                        className={current_page === last_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}