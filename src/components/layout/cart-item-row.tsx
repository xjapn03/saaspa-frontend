import { Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CartItem } from "@/context/cart-provider"

interface CartItemRowProps {
  item: CartItem
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const atMax = item.quantity >= (item.maxQuantity || 999)
  const formatPrice = (p: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(p)

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
      <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted/20">
        {item.mainImage ? (
          <img src={item.mainImage} alt={item.name} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-xs text-muted-foreground">✦</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.name}</p>
        <p className="text-xs text-muted-foreground">{formatPrice(item.price)}</p>
        <div className="mt-1 flex items-center gap-1">
          <Button variant="outline" size="icon-xs" onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}>
            <Minus className="size-3" />
          </Button>
          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
          <Button variant="outline" size="icon-xs" disabled={atMax} onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)} title={atMax ? `Máximo ${item.maxQuantity} disponibles` : "Aumentar cantidad"}>
            <Plus className="size-3" />
          </Button>
        </div>
        {atMax && <p className="mt-1 text-[10px] text-muted-foreground">Stock máximo: {item.maxQuantity}</p>}
      </div>
      <Button variant="ghost" size="icon-xs" onClick={() => onRemove(item.productId)} title="Eliminar">
        <X className="size-3" />
      </Button>
    </div>
  )
}
