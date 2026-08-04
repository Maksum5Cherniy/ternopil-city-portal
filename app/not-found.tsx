import { Home, Search } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { uk } from "@/config/dictionaries/uk";

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[56vh] w-full max-w-[760px] content-center px-4 py-16 text-center sm:px-6">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-primary-soft text-primary">
        <Search aria-hidden size={26} />
      </div>
      <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">{uk.pages.notFoundTitle}</h1>
      <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-muted">
        {uk.pages.notFoundDescription}
      </p>
      <div className="mt-7 flex justify-center">
        <LinkButton href="/" leftIcon={<Home aria-hidden size={18} />}>
          {uk.common.backHome}
        </LinkButton>
      </div>
    </section>
  );
}
