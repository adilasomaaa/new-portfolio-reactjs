import { useEffect, useState } from 'react'
import FadeContent from './animations/FadeContent';

interface workExperiences {
    id: number,
    name: string,
    role: string[],
    startDate: string,
    endDate: string
}


const WorkExperience = () => {
    const [workExperiences, setWorkExperiences] = useState<workExperiences[]>([]);

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetch('/data/work.json')
            .then(response => response.json())
            .then(data => {
                setWorkExperiences(data);
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
                console.log(error);
                
            })
    }, [])

    if(loading) {
        return <div>Loading ...</div>
    }

    return (
        <div className='py-12 border-t border-black'>
             <div id='works' className="flex flex-col md:flex-row justify-between items-baseline mb-8 border-b border-black pb-4">
                <h2 className="font-serif font-bold text-4xl sm:text-5xl uppercase tracking-tighter">
                   Career History
                </h2>
                <span className="font-mono text-sm uppercase tracking-widest mt-2 md:mt-0">
                    Professional Timeline
                </span>
            </div>

            <section className="container mx-auto">
                <div className="flex flex-col">
                    {workExperiences.map((item, index) => {
                        return (
                            <FadeContent key={item.id} delay={item.id * 100} >
                                <div className={`group flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b border-black hover:bg-gray-100 transition-colors duration-300 px-4 ${index === 0 ? 'border-t' : ''}`}>
                                    
                                    <div className="flex items-center gap-6 md:w-1/3">
                                         <span className="font-serif text-4xl font-bold text-gray-300 group-hover:text-black transition-colors">
                                            {String(item.id).padStart(2, '0')}
                                         </span>
                                         <div>
                                            <h3 className="font-serif text-2xl font-bold leading-tight">
                                                {item.name}
                                            </h3>
                                         </div>
                                    </div>

                                    <div className='flex flex-wrap gap-2 md:w-1/3 my-4 md:my-0 justify-start md:justify-center'>
                                        {item.role.map(role => (
                                            <span key={role} className="border border-gray-400 px-2 py-0.5 text-xs font-mono uppercase text-gray-600">
                                                {role}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="md:w-1/3 text-right">
                                        <span className='font-mono text-sm uppercase tracking-widest block'>
                                            {item.startDate} — {item.endDate ? item.endDate : 'Present'}
                                        </span>
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

export default WorkExperience