import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';

const visitorsCollectionRef = collection(db, 'visitors');

const fetchCountryConfig = [
    {
        url: 'https://ipapi.co/json/',
        field: 'country_name'
    },
    {
        url: 'https://ipwho.is/',
        field: 'country'
    },
    {
        url: 'https://api.db-ip.com/v2/free/self',
        field: 'countryName'
    }
];

const getCountry = async () => {
    for (const provider of fetchCountryConfig) {
        try {
            const response = await fetch(provider.url);
            if (!response.ok) continue;

            const data = await response.json();
            const country = data[provider.field];

            if (country) return country;
        } catch (e) {
            console.warn(`Failed to fetch country from ${provider.url}`, e);
            continue;
        }
    }
    return 'Unknown';
}

export const trackVisitor = async (pageInfo) => {
    try {
        const country = await getCountry();

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
