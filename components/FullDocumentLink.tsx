"use client";

import { forwardRef, type AnchorHTMLAttributes } from "react";

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  onNavigate?: (event: { preventDefault: () => void }) => void;
};

/** Vinext currently throws during client-side route transitions in production. */
const FullDocumentLink = forwardRef<HTMLAnchorElement, LinkProps>(
  function FullDocumentLink({ href, ...props }, ref) {
    // Keep native anchor behavior, including new tabs, downloads and keyboard use.
    const anchorProps = { ...props };
    delete anchorProps.prefetch;
    delete anchorProps.replace;
    delete anchorProps.scroll;
    delete anchorProps.onNavigate;
    const safeHref = /^(?:javascript|data):/i.test(href.trim()) ? "#" : href;
    return <a {...anchorProps} href={safeHref} ref={ref} />;
  },
);

export default FullDocumentLink;
