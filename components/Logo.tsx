import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/config/site.config";

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      aria-label={SITE.title}
    >
      <Image
        src={compact ? "/logo-mark.svg" : "/logo.svg"}
        alt=""
        width={compact ? 44 : 220}
        height={compact ? 44 : 60}
        priority
        className={compact ? "h-11 w-11" : "h-[52px] w-auto sm:h-14"}
      />
    </Link>
  );
}
