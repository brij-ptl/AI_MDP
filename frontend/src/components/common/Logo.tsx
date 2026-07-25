import Image from "next/image";
import Link from "next/link";

export default function Logo({ mark = false }: { mark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 select-none">
      <Image
        src={mark ? "/logos/logo-mark.svg" : "/logos/logo.svg"}
        alt="Nidaan+"
        width={mark ? 36 : 150}
        height={36}
        priority
      />
    </Link>
  );
}
