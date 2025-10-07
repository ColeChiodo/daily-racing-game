import { Link } from 'react-router-dom';

export default function Footer() {
    return(
        <>
            <p className="text-gray-900">© 2025 <a href="https://colechiodo.cc" target="_blank" className="hover:underline transition">
                colechiodo.cc
            </a></p>
            
            <div className="flex flex-row flex-wrap gap-2 justify-center mt-2">
                <Link to="/tos" target="_blank" className="hover:text-gray-900 transition">
                    Terms
                </Link>
                <div className="text-gray-900">|</div>
                <Link to="/privacy" target="_blank" className="hover:text-gray-900 transition">
                    Privacy
                </Link>
                <div className="text-gray-900">|</div>
                <Link to="/about" target="_blank" className="hover:text-gray-900 transition">
                    About
                </Link>
            </div>
        </>
    )
}