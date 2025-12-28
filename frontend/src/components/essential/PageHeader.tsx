import Link from "next/link";
import { ReactNode } from "react";

interface PageHeaderProps {
  label?: string;
  title: string;
  description?: string;
  settingHref?: string;
  children?: ReactNode;
}

export default function PageHeader({
  label,
  title,
  description,
  settingHref,
  children,
}: PageHeaderProps) {
  return (
    <div className="mb-8 items-end justify-between sm:flex">
      <div className="flex-1">
        {label && (
          <p className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">
            {label}
          </p>
        )}
        <div className="flex items-center gap-2">
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h1>
          {settingHref && (
            <Link
              href={settingHref}
              className="mt-1 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          )}
        </div>
        {description && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      {children && <div className="mt-4 sm:mt-0">{children}</div>}
    </div>
  );
}
