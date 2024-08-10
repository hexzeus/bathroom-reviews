import './globals.css';  // This line imports the global Tailwind CSS styles
import { Inter, Roboto } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const roboto = Roboto({ weight: ['400', '700'], subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${inter.className} ${roboto.className} bg-gray-900 text-gray-200`}>
                <div className="container mx-auto min-h-screen">
                    <header className="py-4 border-b border-gray-800 mb-6">
                        <h1 className="text-4xl font-bold text-green-400">Alien Bathroom Reviews</h1>
                    </header>
                    <main>{children}</main>
                    <footer className="mt-12 py-6 border-t border-gray-800 text-center">
                        <p className="text-gray-500">© 2024 Alien Bathroom Reviews</p>
                    </footer>
                </div>
            </body>
        </html>
    );
}
