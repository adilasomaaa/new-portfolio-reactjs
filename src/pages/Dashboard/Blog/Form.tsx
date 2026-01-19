import { Button, Input } from '@/components/common'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { addArticle, getArticleById, updateArticle } from '@/services/articleService'
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import ArticleSkeleton from '@/components/common/ArticleSkeleton'

const Form = () => {
    const { id } = useParams();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });

    const navigate = useNavigate(); // Hook untuk navigasi

    useEffect(() => {
        if (isEditMode) {
            const fetchArticleData = async () => {
                setLoading(true);
                try {
                    const article = await getArticleById(id);
                
                    if (article && 'title' in article && 'description' in article) {
                        setFormData({
                            title: (article as { title: string }).title,
                            description: (article as { description: string }).description,
                        });
                        setLoading(false);
                    } else {
                        alert('Artikel tidak ditemukan!');
                        navigate('/dashboard/blog');
                        setLoading(false);
                    }
                } catch (error) {
                    console.error(error);
                    alert('Gagal memuat data artikel.');
                    setLoading(false);
                }finally {
                    setLoading(false);
                }
        };
        
        fetchArticleData();
        }
    }, [id, navigate, isEditMode]); // Dependensi array


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [id]: value,
        }));
    };

    const editorRef = React.useRef<HTMLDivElement>(null);
    const quillRef = React.useRef<Quill | null>(null);

    // Initialize Quill
    useEffect(() => {
        if (loading || !editorRef.current) return;

        // Cleanup existing instance if any (though usually handled by return)
        if (quillRef.current) {
             // If we are here, it means loading changed but component didn't unmount?
             // Safer to just always create new if we rely on cleanup.
             // But strict mode might cause double run.
             // Let's rely on the check:
             const container = editorRef.current;
             // Check if already initialized to avoid double init in Strict Mode
             if (container.querySelector('.ql-editor')) return;
        }

        const quill = new Quill(editorRef.current, {
            theme: 'snow',
            modules: {
                toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link', 'image'],
                        ['clean'] // remove formatting button
                ]
            }
        });

        quillRef.current = quill;

        quill.on('text-change', () => {
                const content = quill.root.innerHTML || '';
                setFormData(prev => ({...prev, description: content}));
        });

        // Cleanup function
        return () => {
            quillRef.current = null; 
            // We don't necessarily need to destroy the DOM since React will remove the div
        };
    }, [loading]);

    useEffect(() => {
        if (quillRef.current && formData.description && quillRef.current.root.innerHTML === '<p><br></p>') {
             // Only set if editor is empty-ish (default empty state) to avoid overwriting user changes or loop
             // Better strategy: sync once when loading completes.
        }
    }, []); // Need a better way to sync initial data.
    
    
    useEffect(() => {
        if (quillRef.current && formData.description) {
            const currentContent = quillRef.current.root.innerHTML;
            if (currentContent === '<p><br></p>' || currentContent === '') {
                 quillRef.current.clipboard.dangerouslyPasteHTML(formData.description);
            }
        }
    }, [formData.description]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Mencegah reload halaman
        
        if (!formData.title || !formData.description) {
            alert("Judul dan deskripsi tidak boleh kosong!");
            return;
        }

        setLoading(true); // Mulai loading

        try {
            const articleData = {
                title: formData.title,
                description: formData.description,
            };
            
            if (isEditMode) {
                await updateArticle(id, articleData); // Gunakan service update
                alert("Blog berhasil diperbarui!");
            } else {
                await addArticle(articleData); // Gunakan service add
                alert("Blog berhasil dibuat!");
            }
            navigate('/dashboard/blog');
            

        } catch (error) {
            console.error("Gagal membuat blog:", error);
            alert("Terjadi kesalahan saat membuat blog.");
        } finally {
            setLoading(false); // Selesai loading
        }
    };

    if (loading) {
        return (
        <div className="p-4">
            {[...Array(3)].map((_, index) => (
            <ArticleSkeleton key={index} />
            ))}
        </div>
        );
    }
  return (
    <>
        <form onSubmit={handleSubmit}>
            <div className='flex justify-between items-center'>
            <div>
                <Link to={"/dashboard/blog"} className="text-gray-500 mb-8">Back</Link>
                {/* Judul dinamis berdasarkan mode */}
                <div className='text-xl sm:text-2xl lg:text-[44px] font-light text-left'>
                {isEditMode ? 'Edit Blog' : 'Add Blog'}
                </div>
                <p className='text-gray-600 '>
                {isEditMode ? 'Update your existing blog' : 'Add a new blog'}
                </p>
            </div>
            <Button type="submit" className='text-white' disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
            </Button>
            </div>
            <div className="mt-6">
                <div className="mb-4">
                    <Input
                        name="title"
                        label="Title"
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter blog title"
                        required/>
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                    <div className="h-64 mb-12"> 
                         <div ref={editorRef} className="h-full"></div>
                    </div>
                </div>
            </div>
        </form>
    </>
  )
}

export default Form