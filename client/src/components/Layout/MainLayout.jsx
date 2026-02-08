import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout() {
    return (
<<<<<<< HEAD
        <div className="min-h-screen bg-app dark:bg-app-dark flex transition-colors">
=======
        <div className="min-h-screen bg-lavender/20 flex">
>>>>>>> 48ffff9 (Royal Amethyst theme + login UI update)
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
                <Header />
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
