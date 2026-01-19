import { useEffect, useState } from 'react'
import { Button } from './common';
import { AnimatePresence } from 'framer-motion';
import FadeContent from './animations/FadeContent';

interface Project {
    id: number;
    name: string;
    company: string;
    role: string[];
    desc: string;
    image: string;
    year: string;
    link: string;
}

const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);

    const [showAll, setShowAll] = useState(false);

    const initialProjectCount = 3

    const projectsToShow = showAll ? projects : projects.slice(0, initialProjectCount);



    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/data/projects.json')
            .then(response => response.json())
            .then(data => {
                const sortedData = data.sort((a: Project, b: Project) => Number(b.year) - Number(a.year));
                setProjects(sortedData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching projects data:', error);
                setLoading(false);
            });
    }, []);

    if(loading) {
        return <div className="text-center py-10">Loading projects...</div>
    }
    return (
        <div id="projects" className="py-12 border-t border-black">
             <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 border-b border-black pb-4">
                <h2 className="font-serif font-bold text-4xl sm:text-5xl uppercase tracking-tighter">
                    Selected Projects
                </h2>
                <span className="font-mono text-sm uppercase tracking-widest mt-2 md:mt-0">
                    Archive Vol. I
                </span>
            </div>

            <AnimatePresence>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-black">
                    {projectsToShow.map((project, index) => (
                         <FadeContent key={project.id} delay={index * 100} blur={true}>
                            <div className="group border-r border-b border-black p-6 h-full flex flex-col hover:bg-gray-100 transition-colors duration-300">
                                <div className="mb-4 overflow-hidden border border-black h-48 relative">
                                    <img 
                                        src={'/assets/' + project.image} 
                                        alt={project.name} 
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                                    />
                                    <div className="absolute top-2 right-2 bg-black text-white text-xs font-mono px-2 py-1">
                                        {project.year}
                                    </div>
                                </div>
                                
                                <h3 className="font-serif text-2xl font-bold mb-2 group-hover:underline decoration-2 underline-offset-4">
                                    {project.name}
                                </h3>
                                
                                <div className="font-mono text-xs uppercase tracking-wider mb-4 text-gray-600 border-b border-gray-300 pb-2">
                                    {project.company}
                                </div>
                                
                                <p className="font-serif text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                                    {project.desc}
                                </p>

                                <div className="mt-auto">
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.role.map(role => (
                                            <span key={role} className="border border-black px-2 py-0.5 text-xs font-mono uppercase hover:bg-black hover:text-white transition-colors">
                                                {role}
                                            </span>
                                        ))}
                                    </div>
                                    
                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="block w-full">
                                        <button className="w-full border-t border-black pt-2 text-center font-mono text-sm uppercase tracking-widest hover:font-bold">
                                            Read More
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </FadeContent>
                    ))}
                </div>
            </AnimatePresence>

            {!showAll && projects.length > initialProjectCount && (
                <div className="flex justify-center mt-12">
                   <Button className="font-mono uppercase text-sm border-2 border-black bg-transparent text-black px-8 py-3 rounded-none hover:bg-black hover:text-white transition-colors" onClick={() => setShowAll(true)}>
                        View All Archives
                    </Button>
                </div>
            )}
             {showAll && projects.length > initialProjectCount && (
                <div className="flex justify-center mt-12">
                   <Button className="font-mono uppercase text-sm border-2 border-black bg-transparent text-black px-8 py-3 rounded-none hover:bg-black hover:text-white transition-colors" onClick={() => setShowAll(false)}>
                        Collapse Archive
                    </Button>
                </div>
            )}
        </div>
    )
}

export default Projects