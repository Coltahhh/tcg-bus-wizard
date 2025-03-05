// components/Layout.js
export default function Layout({ children }) {
    return (
        <div id="root"> {/* Add this ID */}
            {/* Your existing nav/main/footer */}
            {children}
        </div>
    )
}