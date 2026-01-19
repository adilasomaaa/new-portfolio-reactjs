import { VscAccount, VscArchive, VscBriefcase, VscHome, VscRocket } from 'react-icons/vsc';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const menus = [
            { 
                label: 'Home', 
                icon: <VscHome size={18} />, 
                type: 'anchor', 
                to: 'home' 
            },
            { 
                label: 'Skills', 
                icon: <VscAccount size={18} />, 
                type: 'anchor', 
                to: 'skills' 
            },
            { 
                label: 'Work Experiences', 
                icon: <VscBriefcase size={18} />, 
                type: 'anchor', 
                to: 'works' // Contoh link eksternal
            },
            { 
                label: 'Projects', 
                icon: <VscArchive size={18} />, 
                type: 'anchor', 
                to: 'projects' // Contoh link eksternal
            },
            { 
                label: 'Blog', 
                icon: <VscRocket size={18} />, 
                type: 'external', 
                to: 'dashboard/blog' // Contoh link eksternal lain
            },
        ];
    return (
        <div className="flex w-full">
            <div className="w-full bg-gray-50 border border-gray-200 rounded-lg">

                <div className="my-10">
                    <h3 className="mx-6 mb-2 text-xs text-gray-400 uppercase tracking-widest">
                        Main
                    </h3>

                    {menus.map((menu) => (
                        <Link to={menu.to} className="flex items-center px-6 py-2.5 text-gray-500 hover:text-blue-600 group" key={menu.label}>
                            {menu.icon && (
                                <span className="h-5 w-5 text-gray-400 mr-2 group-hover:text-blue-600 flex items-center justify-center">
                                    {menu.icon}
                                </span>
                            )}
                            {menu.label}
                        </Link>
                    ))}

                </div>


            </div>
        </div>
    )
}

export default Sidebar