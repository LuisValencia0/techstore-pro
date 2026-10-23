import { useContext } from "react";
import { CartContext } from "./CartContext";

function BadgeCarrito() {
    const { items } = useContext(CartContext);

    if (items.length === 0) return null;

    return (
        <span className="bg-accent text-paper text-xs font-bold rounded-full px-2 py-0.5">
            {items.length}
        </span>
    );
}

export default BadgeCarrito;