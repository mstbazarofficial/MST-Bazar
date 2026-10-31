export function getFeaturedImageUrl(
  images: { url: string; isFeatured: boolean }[],
) {
  return (images.find((image) => image.isFeatured) ?? images[0])?.url ?? null;
}
