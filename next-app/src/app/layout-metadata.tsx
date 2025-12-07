import type { Metadata } from 'next'

export const metadata: Metadata = {
    metadataBase: new URL('https://88shop.ir'), // تغییر به دامنه واقعی
    title: {
        default: 'فروشگاه لوازم آرایشی بیوتی‌شاپ',
        template: '%s | بیوتی‌شاپ'
    },
    description: 'خرید لوازم آرایشی، مراقبت پوست، مراقبت مو و عطر و ادکلن با بهترین قیمت',
    keywords: ['لوازم آرایشی', 'مراقبت پوست', 'مراقبت مو', 'عطر', 'ادکلن', 'بیوتی شاپ'],
    authors: [{ name: 'بیوتی‌شاپ' }],
    creator: 'بیوتی‌شاپ',
    publisher: 'بیوتی‌شاپ',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: 'website',
        locale: 'fa_IR',
        url: 'https://88shop.ir',
        siteName: 'بیوتی‌شاپ',
        title: 'فروشگاه لوازم آرایشی بیوتی‌شاپ',
        description: 'خرید لوازم آرایشی، مراقبت پوست و مو با بهترین قیمت',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'فروشگاه لوازم آرایشی بیوتی‌شاپ',
        description: 'خرید لوازم آرایشی، مراقبت پوست و مو با بهترین قیمت',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
