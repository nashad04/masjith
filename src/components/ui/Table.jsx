import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Table = ({ children, className, ...props }) => (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className={twMerge('w-full text-sm text-left', className)} {...props}>
            {children}
        </table>
    </div>
);

export const TableHeader = ({ children, className, ...props }) => (
    <thead className={twMerge('text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200', className)} {...props}>
        {children}
    </thead>
);

export const TableBody = ({ children, className, ...props }) => (
    <tbody className={twMerge('bg-white divide-y divide-gray-200', className)} {...props}>
        {children}
    </tbody>
);

export const TableHead = ({ children, className, ...props }) => (
    <th className={twMerge('px-6 py-3 font-medium text-gray-900 whitespace-nowrap', className)} {...props}>
        {children}
    </th>
);

export const TableRow = ({ children, className, ...props }) => (
    <tr className={twMerge('hover:bg-gray-50 transition-colors', className)} {...props}>
        {children}
    </tr>
);

export const TableCell = ({ children, className, ...props }) => (
    <td className={twMerge('px-6 py-4', className)} {...props}>
        {children}
    </td>
);
