const { doc, setDoc, collection, query, where, getDocs, getDoc } = require('firebase/firestore');
const { firestore, MahasiswaCollection, auth } = require('../config'); 

class mahasiswa{
    static async createMahasiswa({ nim, nama, jurusan, semester, jenisKelamin }) {
        try {
          const mahasCollection = collection(firestore, MahasiswaCollection);
          const q = query(mahasCollection, where('nim', '==', nim));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            return { error: 'Data Mahasiswa Sudah Ada' };
          } else {
            const newMahasiswaRef = doc(mahasCollection);
            await setDoc(newMahasiswaRef, {
              nim, 
              nama, 
              jurusan, 
              semester,
              jenisKelamin
            });
            return { message: 'Mahasiswa Ditambahkan' };
          }
        } catch (error) {
          console.error('Gagal menambahkan mahasiswa:', error.message);
          return { error: 'Gagal menambahkan mahasiswa', errorMessage: error };
        }
      }
}

module.exports = mahasiswa;