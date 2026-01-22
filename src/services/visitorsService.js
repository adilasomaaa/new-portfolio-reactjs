import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';

const visitorsCollectionRef = collection(db, 'visitors');

export const trackVisitor = async (pageInfo) => {
    try {
        let country = 'Unknown';
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            if (data && data.country_name) {
                country = data.country_name;
            }
        } catch (e) {
            console.warn('Could not fetch country data', e);
        }

        const visitorData = {
            ...pageInfo,
            country,
            user_agent: navigator.userAgent,
            timestamp: serverTimestamp()
        };

        await addDoc(visitorsCollectionRef, visitorData);
    } catch (error) {
        console.error("Error tracking visitor: ", error);
    }
};

export const getVisitorStats = async () => {
    try {
        const q = query(visitorsCollectionRef, orderBy('timestamp', 'asc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Ensure timestamp is converted to JS Date if it's a Firestore Timestamp
                timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date(data.timestamp)
            };
        });
    } catch (error) {
        console.error("Error getting visitor stats: ", error);
        return [];
    }
};
