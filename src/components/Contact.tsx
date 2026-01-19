
const Contact = () => {
  return (
    <>
        <section className="py-8 bg-blue-600 px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col justify-center items-start text-white px-4">
                        <h2 className="text-4xl font-serif mb-4">Get in Touch</h2>
                        <p className="mb-6 text-lg">I'm currently open to new opportunities and collaborations. Whether you have a question, a project idea, or just want to say hello, feel free to reach out!</p>
                        <a href="mailto:yasdilofficial@gmail.com" className="bg-white text-blue-600 py-2 px-4 rounded-md hover:bg-gray-200 transition duration-300 ease-in-out">Contact Me!</a>
                </div>
            </div>
        </section>
    </>
    
  )
}

export default Contact