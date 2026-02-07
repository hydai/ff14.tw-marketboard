import { Link } from "react-router";

interface ItemLinkProps {
  itemId: number;
  name: string;
  className?: string;
}

export function ItemLink({ itemId, name, className = "" }: ItemLinkProps) {
  return (
    <Link
      to={`/items/${itemId}`}
      className={`text-zinc-200 hover:text-gold-400 transition-colors ${className}`}
    >
      {name}
    </Link>
  );
}
