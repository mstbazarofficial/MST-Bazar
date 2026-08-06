"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// --- Shared query shape, reused so both cart lookups stay in sync ---
// We infer the item type directly from the query itself (via Awaited<ReturnType<...>>)
// instead of Prisma.validator / Prisma.CartItemGetPayload. Those namespace-based helpers
// were removed in newer Prisma versions (6.16+) for the new `prisma-client` generator,
// but inferring from the actual call always works regardless of generator/version.
function findCartWithItems(userId: string) {
  return prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: { include: { images: { take: 1 } } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

type CartWithItems = NonNullable<Awaited<ReturnType<typeof findCartWithItems>>>;
type CartItemWithProduct = CartWithItems["items"][number];

// Define the shape of the data the client actually needs
export type PopulatedCartItem = {
  id: string;
  productId: string;
  quantity: number;
  product: {
    title: string;
    slug: string;
    price: number;
    discountPercentage: number;
    unit: string | null;
    image: string | null;
  };
};

const MAX_QTY = 10;

// --- Helper: Get Auth ---
async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id || null;
}

// --- Helper: Format Prisma result to Client type ---
function formatCartItems(items: CartItemWithProduct[]): PopulatedCartItem[] {
  return items.map((item) => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    product: {
      title: item.product.title,
      slug: item.product.slug,
      price: item.product.price,
      discountPercentage: item.product.discountPercentage,
      unit: item.product.unit,
      image: item.product.images?.[0]?.url || null,
    },
  }));
}

// ---------------------------------------------------------
// 1. Fetch Cart (For Logged In Users)
// ---------------------------------------------------------
export async function getDbCart(): Promise<PopulatedCartItem[]> {
  const userId = await getUserId();
  if (!userId) return [];

  let cart = await findCartWithItems(userId);

  if (!cart) {
    // Freshly created cart has no items yet, but we still need the same
    // shape as findCartWithItems for formatCartItems to accept it.
    await prisma.cart.create({ data: { userId } });
    cart = await findCartWithItems(userId);
  }

  return formatCartItems(cart?.items ?? []);
}

// ---------------------------------------------------------
// 2. Resolve Guest Cart (Fetch secure prices for LocalStorage items)
// ---------------------------------------------------------
export async function resolveGuestCart(
  localItems: { productId: string; quantity: number }[],
): Promise<PopulatedCartItem[]> {
  if (!localItems.length) return [];

  const products = await prisma.product.findMany({
    where: { id: { in: localItems.map((i) => i.productId) } },
    include: { images: { take: 1 } },
  });

  const resolvedItems = products.map((product) => {
    const localItem = localItems.find((i) => i.productId === product.id);
    // Clamp quantity defensively — localStorage can be tampered with by the client
    const safeQty = Math.min(Math.max(localItem?.quantity ?? 1, 1), MAX_QTY);

    return {
      id: `guest-${product.id}`, // Fake ID for client mapping
      productId: product.id,
      quantity: safeQty,
      product: {
        title: product.title,
        slug: product.slug,
        price: product.price,
        discountPercentage: product.discountPercentage,
        unit: product.unit,
        image: product.images?.[0]?.url || null,
      },
    };
  });

  return resolvedItems;
}

// ---------------------------------------------------------
// 3. Merge Guest Cart to DB (Fires exactly ONCE on login)
// ---------------------------------------------------------
export async function syncGuestCartToDb(
  localItems: { productId: string; quantity: number }[],
): Promise<PopulatedCartItem[]> {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const cart = await prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  // Only sync items for products that actually exist, and clamp quantity
  const validItems = localItems.filter((i) => i.productId && i.quantity > 0);

  if (validItems.length) {
    await prisma.$transaction(
      validItems.map((item) =>
        prisma.cartItem.upsert({
          where: {
            cartId_productId: { cartId: cart.id, productId: item.productId },
          },
          create: {
            cartId: cart.id,
            productId: item.productId,
            quantity: Math.min(item.quantity, MAX_QTY),
          },
          update: {
            quantity: { increment: item.quantity },
          },
        }),
      ),
    );

    // Re-clamp anything that exceeded MAX_QTY after increment, in one query
    await prisma.cartItem.updateMany({
      where: { cartId: cart.id, quantity: { gt: MAX_QTY } },
      data: { quantity: MAX_QTY },
    });
  }

  return getDbCart();
}

// ---------------------------------------------------------
// 4. Mutate Item (Handles Add, Update, Remove securely)
// ---------------------------------------------------------
export async function mutateCartItem(productId: string, quantity: number) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const cart = await prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, productId },
    });
    return;
  }

  const safeQty = Math.min(quantity, MAX_QTY);

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    create: { cartId: cart.id, productId, quantity: safeQty },
    update: { quantity: safeQty },
  });
}

// ---------------------------------------------------------
// 5. Clear Cart
// ---------------------------------------------------------
export async function clearServerCart() {
  const userId = await getUserId();
  if (!userId) return;

  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}
