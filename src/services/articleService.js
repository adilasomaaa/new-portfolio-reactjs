import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp, getDoc, where, limit, doc, updateDoc, increment } from 'firebase/firestore';

const articlesCollectionRef = collection(db, 'articles');

/**
 * @returns {Promise<Array>} Sebuah array berisi objek artikel.
 */
export const getAllArticles = async () => {
    try {
        // Buat query untuk mengurutkan berdasarkan tanggal
        const q = query(articlesCollectionRef, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);

        // Olah data snapshot menjadi array yang bersih
        const articles = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return articles;
    } catch (error) {
        console.error("Error di service getAllArticles: ", error);
        // Lemparkan error agar bisa ditangkap oleh komponen yang memanggil
        throw new Error("Gagal mengambil data artikel.");
    }
};

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Ganti spasi dengan -
    .replace(/[^\w\-]+/g, '')       // Hapus karakter yang tidak valid
    .replace(/\-\-+/g, '-');        // Ganti beberapa -- dengan satu -
};

export const addArticle = async (articleData) => {
    try {
        const dataToSave = {
            ...articleData,
            slug: slugify(articleData.title),
            date: serverTimestamp(),
            views: 0
        };
        const docRef = await addDoc(articlesCollectionRef, dataToSave);
        return docRef.id;
    } catch (error) {
        console.error("Error di service addArticle: ", error);
        throw new Error("Gagal menambahkan artikel baru.");
    }
};

export const deleteArticle = async (id) => {
    try {
        const articleDoc = doc(db, 'articles', id);
        await deleteDoc(articleDoc);
    } catch (error) {
        console.error("Error di service deleteArticle: ", error);
        throw new Error("Gagal menghapus artikel.");
    }
};

export const showArticle = async (slug) => {
    try {
        const q = query(articlesCollectionRef, where('slug', '==', slug), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("Artikel tidak ditemukan.");
        }

        const articleDoc = querySnapshot.docs[0];
        const articleId = articleDoc.id;

        const articleRef = doc(db, 'articles', articleId);
        await updateDoc(articleRef, {
            views: increment(1)
        });

        const updatedDoc = await getDoc(articleRef);

        return { id: updatedDoc.id, ...updatedDoc.data() };
    } catch (error) {
        console.error("Error di service showArticle: ", error);
        throw new Error("Gagal mengambil data artikel.");
    }
};

export const getArticleById = async (id) => {
    try {
        const articleRef = doc(db, 'articles', id);
        const docSnap = await getDoc(articleRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting document:", error);
        throw new Error("Gagal mengambil data artikel.");
    }
};

export const updateArticle = async (id, updatedData) => {
    try {
        const articleDoc = doc(db, 'articles', id);
        await updateDoc(articleDoc, updatedData);
    } catch (error) {
        console.error("Error di service updateArticle: ", error);
        throw new Error("Gagal memperbarui artikel.");
    }
};