const { doc, setDoc, collection, query, where, getDocs, getDoc } = require('firebase/firestore');
const { firestore, MatkulCollection, auth } = require('../config'); 

class MK{
    static async createMatakuliah({ mataKuliah, sks, jenisMk, semesterMk }) {
        try {
          const matCollection = collection(firestore, MatkulCollection);
          const q = query(matCollection, where('mataKuliah', '==', mataKuliah));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            return { error: 'Data mata kuliah Sudah Ada' };
          } else {
            const kodeMk = `MK-${Math.floor(10000 + Math.random() * 90000)}`;
            const newMahasiswaRef = doc(matCollection);
            await setDoc(newMahasiswaRef, {
                mataKuliah, 
                sks, 
                jenisMk, 
                semesterMk,
                kodeMk
            });
            return { message: 'Mata kuliah Ditambahkan' };
          }
        } catch (error) {
          console.error('Gagal menambahkan mata kuliah:', error.message);
          return { error: 'Gagal menambahkan mata kuliah', errorMessage: error };
        }
      }

      static async displayAllMatakuliah() {
        try {
          const matCollection = collection(firestore, MatkulCollection);
          const querySnapshot = await getDocs(matCollection);
          const matakuliahList = [];
          
          querySnapshot.forEach(doc => {
            matakuliahList.push(doc.data());
          });
          return matakuliahList;
        } catch (error) {
          console.error('Gagal menampilkan matakuliah:', error.message);
          return { error: 'Gagal menampilkan matakuliah', errorMessage: error };
        }
      }
}

module.exports = MK;