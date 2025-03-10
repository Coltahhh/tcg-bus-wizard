// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta charSet="utf-8" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <body>
            <Main /> {/* This is where your app content mounts */}
            <NextScript /> {/* Required for Next.js scripts */}
            </body>
        </Html>
    )
}