
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  addDoc, 
  Timestamp,
  startAfter,
  getCountFromServer 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCz9MQaDoU9sMCI_-v3ZX7-yz6djDQxJKA",
  authDomain: "app-dance-cf2aa.firebaseapp.com",
  projectId: "app-dance-cf2aa",
  storageBucket: "app-dance-cf2aa.firebasestorage.app",
  messagingSenderId: "875369744589",
  appId: "1:875369744589:web:f0ead9b575d2c59e92c184",
  measurementId: "G-ZW8KT76NVH"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Verificar a conexão com o Firebase
export const verificarConexaoFirebase = async () => {
  try {
    // Tentar fazer uma consulta simples
    const videosCollectionRef = collection(db, 'videos');
    const snapshot = await getCountFromServer(videosCollectionRef);
    
    console.log('Conexão com Firebase estabelecida com sucesso!', snapshot.data().count);
    return true;
  } catch (err) {
    console.error('Exceção ao tentar conectar ao Firebase:', err);
    return false;
  }
};


export { app };
export default { auth, db, storage, verificarConexaoFirebase,  };
