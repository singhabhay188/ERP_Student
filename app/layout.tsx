import './globals.css'
export const metadata = {
  title: "ERP Student",
  description: "A attendance app build for students",
};

export default function RootLayout({ children }: {children:React.ReactNode}) {
  return (
    <html lang="en">
      <body>
          {children}
      </body>
    </html>
  );
}