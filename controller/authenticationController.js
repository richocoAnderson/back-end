const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { doc, setDoc, collection, query, where, getDocs, getDoc } = require('firebase/firestore');
const { firestore, AdminCollection, auth } = require('../config'); 

class User {
  static async createUser({ email, password, userName }) {
    try {
        const adminsCollection = collection(firestore, AdminCollection);
        const q = query(adminsCollection, where('userName', '==', userName));
        const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return { error: 'Username has been used' };
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDocRef = doc(firestore, AdminCollection, user.uid);
        await setDoc(userDocRef, {
          email,
          userName,
        });
        return { message: 'User Added' };
      }
    } catch (error) {
      console.error('Registration failed:', error.message);
      return { error: 'Registration failed', errorMessage: error };
    }
  }

  static async loginUser(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(firestore, AdminCollection, user.uid);
      const userDoc = await getDoc(userDocRef);
      const token = `TKN-${Math.floor(10000 + Math.random() * 90000)}`;
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return { 
          userName: userData.userName, // Mengambil properti userName dari userData
          email: userData.email, // Mengambil properti email dari userData
          token 
        };
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      throw error;
    }
  }
  
  
}

module.exports = User;
