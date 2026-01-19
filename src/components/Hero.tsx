import { useEffect, useState } from 'react'
import { MdEmail, MdLocationPin } from "react-icons/md";
import { Button } from './common';
import FadeContent from './animations/FadeContent';
import { Link } from 'react-scroll';
import { FaLinkedin } from 'react-icons/fa';


interface ContactInfoProps {
    contacts: {
        email: string;
        linkedin: string;
        address: string;
    };
}

interface Profile {
    name: string;
    job: string;
    description: string;
    contacts: {
        email: string;
        linkedin: string;
        address: string;
    };
}

const ContactInfo = ({ contacts } : ContactInfoProps) => {
    
    const iconMap : { [key: string]: React.ReactNode } = {
        email: <MdEmail size={20} className="text-gray-600" />,
        linkedin: <FaLinkedin size={20} className="text-gray-600" />,
        address: <MdLocationPin size={20} className="text-gray-600" />
    };

    return (
        <div className='flex flex-col md:flex-row items-center justify-start gap-4 md:gap-8'>
            {Object.entries(contacts).map(([key, value]) => {
                const icon = iconMap[key];

                if (!icon) return null;

                return (
                    <div key={key} className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                            {icon}
                        </div>
                        <span className="text-gray-800 text-sm md:text-base">{value}</span>
                    </div>
                );
            })}
        </div>
    );
};


const Hero = () => {

    const [profile, setProfile] = useState<Profile>({} as Profile)

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/data/profile.json'
            ).then(response => response.json()
            ).then(data => {
                setProfile(data);
                setLoading(false);
            }).catch(error => {
                console.error('Error fetching profile data:', error);
                setLoading(false);
        });

    }, []);
    

    if(loading) {
        return <div>Loading...</div>
    }
        
    return (
        <section className="container mx-auto py-16" id="home">
            
            <div className="w-full text-center mb-16 border-b border-black pb-16">
                <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
                    <div className="flex flex-col items-center">
                        {/* Headline */}
                        <h1 className="font-serif font-black text-6xl sm:text-7xl lg:text-9xl leading-none mb-6">
                            {profile.name}
                        </h1>
                        
                        {/* Subheadline/Role */}
                        <div className="flex items-center gap-4 mb-8">
                            <span className="h-[1px] w-12 bg-black"></span>
                            <span className="font-mono text-lg uppercase tracking-widest">{profile.job}</span>
                            <span className="h-[1px] w-12 bg-black"></span>
                        </div>

                        {/* Editorial Description */}
                        <div className="max-w-3xl mx-auto text-lg sm:text-xl font-serif leading-relaxed text-center mb-12">
                             <div dangerouslySetInnerHTML={{__html: profile.description}} />
                        </div>

                        {/* Contact & Actions */}
                        <div className="flex flex-col items-center gap-8">
                             <ContactInfo contacts={profile.contacts} />
                             
                             <div className="flex gap-4 mt-4">
                                <a href="mailto:yasdilofficial@gmail.com">
                                    <Button className="font-mono uppercase text-sm border-2 border-black bg-black text-white px-8 py-3 rounded-none hover:bg-white hover:text-black transition-colors">
                                        Contact Me
                                    </Button>
                                </a>
                                <Link to="projects" smooth={true} duration={500} offset={-70}>
                                    <Button className="font-mono uppercase text-sm border-2 border-black bg-transparent text-black px-8 py-3 rounded-none hover:bg-black hover:text-white transition-colors">
                                        View Projects
                                    </Button>
                                </Link>
                             </div>
                        </div>
                    </div>
                </FadeContent>
            </div>
        </section>
    )
}

export default Hero;