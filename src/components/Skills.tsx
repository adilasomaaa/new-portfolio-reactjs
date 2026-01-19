import { useEffect, useState } from 'react'
import FadeContent from './animations/FadeContent';

interface SkillItem {
    name: string;
    icon: string;
    description: string;
    duration: string;
    value: number;
    keywords: string[];
}

interface Skill {
    id: number;
    name: string;
    icon: string;
    description: string;
    items: SkillItem[];
}

const Skills = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/data/skills.json')
            .then(response => response.json())
            .then(data => {
                setSkills(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching skills data:', error);
                setLoading(false);
            });
    }, []);

    if(loading) {
        return <div>Loading...</div>
    }

    return (
        <div id="skills" className="py-12 border-t border-black">
             <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 border-b border-black pb-4">
                <h2 className="font-serif font-bold text-4xl sm:text-5xl uppercase tracking-tighter">
                   Technical Expertise
                </h2>
                <span className="font-mono text-sm uppercase tracking-widest mt-2 md:mt-0">
                    Skill Set Inventory
                </span>
            </div>

            <section className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black border border-black">
                    {skills.map((skill) => {
                        return (
                            <FadeContent key={skill.id} blur={true} delay={skill.id * 100}>
                                <div className="bg-paper p-8 h-full flex flex-col justify-between">
                                    <div className="mb-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <h3 className="font-serif text-2xl font-bold">{skill.name}</h3>
                                        </div>
                                        <p className="font-serif text-sm leading-relaxed mb-6 border-l-2 border-black pl-4">
                                            {skill.description}
                                        </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-2">
                                        {skill.items.map((item) => (
                                            <div key={item.name} className="flex items-baseline justify-between border-b border-gray-300 pb-1 mb-2 last:border-0 hover:bg-gray-100 transition-colors cursor-default">
                                                <span className="font-mono text-sm font-bold uppercase">{item.name}</span>
                                                <span className="font-mono text-xs text-gray-600">{item.duration}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </FadeContent>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}

export default Skills