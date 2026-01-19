import { VscAccount, VscArchive, VscBriefcase, VscHome, VscRocket } from 'react-icons/vsc';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const menus = [
            { 
                label: 'Home', 
                icon: <VscHome size={18} />, 
                type: 'anchor', 
                to: 'dashboard' 
            },
            // { 
            //     label: 'Skills', 
            //     icon: <VscAccount size={18} />, 
            //     type: 'anchor', 
            //     to: 'skills' 
            // },
            // { 
            //     label: 'Work Experiences', 
            //     icon: <VscBriefcase size={18} />, 
            //     type: 'anchor', 
            //     to: 'works' // Contoh link eksternal
            // },
            // { 
            //     label: 'Projects', 
            //     icon: <VscArchive size={18} />, 
            //     type: 'anchor', 
            //     to: 'projects' // Contoh link eksternal
            // },
            { 
                label: 'Blog', 
                icon: <VscRocket size={18} />, 
                type: 'external', 
                to: 'dashboard/blog' // Contoh link eksternal lain
            },
        ];
    return (
        <div className="flex w-full">
                <div className="my-0">
                    <h3 className="mb-6 text-2xl font-serif font-bold text-black border-b border-black pb-2">
                        Menu
                    </h3>

                    <div className="flex flex-col gap-2">
                    {menus.map((menu) => (
                        <Link to={menu.to} className="flex items-center py-2 text-gray-500 hover:text-black hover:font-bold group font-mono uppercase text-sm tracking-widest transition-all" key={menu.label}>
                            {menu.icon && (
                                <span className="mr-3 text-gray-400 group-hover:text-black">
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