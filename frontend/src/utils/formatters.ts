const LOCAL_PRODUCT_IMAGE_IDS = new Set([
  'photo-1521572267360-ee0c2909d518',
  'photo-1583743814966-8936f5b7be1a',
  'photo-1556905055-8f358a7a47b2',
  'photo-1509967419530-da38b4704bc6',
  'photo-1618354691373-d851c5c3a990',
  'photo-1581655353564-df123a1eb820',
  'photo-1596755094514-f87e34085b2c',
  'photo-1473966968600-fa801b869a1a',
  'photo-1507679799987-c73779587ccf',
  'photo-1602810318383-e386cc2a3ccf',
  'photo-1624378439575-d8705ad7ae80',
]);
const DEFAULT_PRODUCT_IMAGE = '/images/products/photo-1521572267360-ee0c2909d518.jpg';

export function formatRupiah(amount: number | string): string {
  const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numeric)) return 'Rp 0';

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numeric);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function getFullImageUrl(path: string | null): string {
  if (!path) return DEFAULT_PRODUCT_IMAGE;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    const unsplashImageId = path.match(/^https?:\/\/images\.unsplash\.com\/(photo-[^?]+)/)?.[1];
    if (unsplashImageId && LOCAL_PRODUCT_IMAGE_IDS.has(unsplashImageId)) {
      return `/images/products/${unsplashImageId}.jpg`;
    }
    return path;
  }
  return `http://localhost:5000${path}`;
}
