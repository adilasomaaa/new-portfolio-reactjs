
const ContactPlaceholder = () => {
  return (
    // Gunakan class dan style yang sama persis dengan <section> di komponen Contact asli
    <section className="relative py-8 bg-blue-600" style={{ height: '600px' }}>
      <div className="flex h-full items-center justify-center">
        {/*
          Anda bisa menambahkan spinner animasi atau teks sederhana 
          untuk memberitahu pengguna bahwa sesuatu sedang dimuat.
        */}
        <p className="text-white text-lg font-serif">
          Loading Interactive Scene...
        </p>
      </div>
    </section>
  );
};

export default ContactPlaceholder;