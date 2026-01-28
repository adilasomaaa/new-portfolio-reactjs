import Hero from '../components/Hero'
import Skills from '../components/Skills'
import WorkExperience from '../components/WorkExperience'
import Projects from '../components/Projects'

import useVisitorTracker from '../hooks/useVisitorTracker'
import { Helmet } from 'react-helmet-async'

const Landing = () => {
  useVisitorTracker('Landing');
  return (
    <>
      <Helmet>
        <title>Yasdil Lasoma - Portfolio</title>
        <meta name="description" content="Fullstack Developer with expertise in React, Node.js, and modern web technologies. Explore my projects, work experience, and technical skills in software engineering." />
      </Helmet>
          <Hero/>
          <Skills/>
          <WorkExperience/>
          <Projects/>
          
    </>
  )
}

export default Landing