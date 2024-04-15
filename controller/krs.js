const { doc, setDoc, collection, query, where, getDocs, getDoc, orWhere } = require('firebase/firestore');
const { firestore, KrsCollection, MahasiswaCollection, MatkulCollection } = require('../config'); 


class KRS{
    static async createKRS({ kodeMk, semesterKRS, nim, nilai, sks }) {
        try {
          const matCollection = collection(firestore, KrsCollection);
          const q = query(matCollection, where('kodeMk', '==', kodeMk), where('semesterKRS', '==', semesterKRS), where('nim', '==', nim) );
          const querySnapshot = await getDocs(q);
          let bobot;

            if (nilai >= 80 && nilai <= 100) {
              bobot = "A";
          } else if (nilai >= 75 && nilai <= 79) {
              bobot = "B+";
          } else if (nilai >= 70 && nilai <= 74) {
              bobot = "B";
          } else if (nilai >= 65 && nilai <= 69) {
              bobot = "C+";
          } else if (nilai >= 60 && nilai <= 64) {
              bobot = "C";
          } else if (nilai >= 55 && nilai <= 59) {
              bobot = "D+";
          } else if (nilai >= 50 && nilai <= 54) {
              bobot = "D";
          } else if (nilai >= 45 && nilai <= 49) {
              bobot = "E+";
          } else if (nilai >= 40 && nilai <= 44) {
              bobot = "E";
          } else if (nilai >= 0 && nilai <= 39) {
              bobot = "F";
          } else {
              bobot = "Nilai tidak valid";
          }

          if (!querySnapshot.empty) {
            return { error: 'Data mata kuliah pada krs Sudah Ada' };
          } else {
            const idKrs = `KRS-${Math.floor(10000 + Math.random() * 90000)}`;
            const newMahasiswaRef = doc(matCollection);
            await setDoc(newMahasiswaRef, {
                idKrs, kodeMk, semesterKRS, nim, nilai, sks, bobot
            });
            return { message: 'Mata kuliah Ditambahkan' };
          }
        } catch (error) {
          console.error('Gagal menambahkan mata kuliah:', error.message);
          return { error: 'Gagal menambahkan mata kuliah', errorMessage: error };
        }
      }

      static async getAllIPK() {
        try {
            const mahasiswaCollection = collection(firestore, MahasiswaCollection);
            const mahasiswaSnapshot = await getDocs(mahasiswaCollection);
            let hasilIPK = [];
    
            // Menunggu semua permintaan data selesai dengan Promise.all()
            await Promise.all(mahasiswaSnapshot.docs.map(async (mahasiswaDoc) => {
                const nim = mahasiswaDoc.data().nim;
                const nama = mahasiswaDoc.data().nama;
                const jurusan = mahasiswaDoc.data().jurusan;
                const jk = mahasiswaDoc.data().jenisKelamin;
    
                let totalNilai = 0;
                let totalSKS = 0;
                let matkulDiambil = [];
    
                const krsCollection = collection(firestore, KrsCollection);
                const krsQuery = query(krsCollection, where('nim', '==', nim));
                const krsSnapshot = await getDocs(krsQuery);
    
                await Promise.all(krsSnapshot.docs.map(async (krsDoc) => {
                    const bobotNilai = krsDoc.data().bobot;
                    const sks = krsDoc.data().sks;
                    const kodeMk = krsDoc.data().kodeMk;
                    const nilainya = krsDoc.data().nilai;
    
                    let nilai = 0;
    
                    if (bobotNilai === "A") {
                        nilai = 4.00;
                    } else if (bobotNilai === "B+") {
                        nilai = 3.50;
                    } else if (bobotNilai === "B") {
                        nilai = 3.00;
                    } else if (bobotNilai === "C+") {
                        nilai = 2.50;
                    } else if (bobotNilai === "C") {
                        nilai = 2.00;
                    } else if (bobotNilai === "D+") {
                        nilai = 1.50;
                    } else if (bobotNilai === "D") {
                        nilai = 1.00;
                    } else if (bobotNilai === "E") {
                        nilai = 0.00;
                    }
    
                    const matkulCollection = collection(firestore, MatkulCollection);
                    const matkulQuery = query(matkulCollection, where('kodeMk', '==', kodeMk));
                    const matkulSnapshot = await getDocs(matkulQuery);
                    const matkulData = matkulSnapshot.docs[0].data();
    
                    const matkul = matkulData.mataKuliah;
                    const jenisMk = matkulData.jenisMk;
                    const sksMk = matkulData.sks;
    
                    matkulDiambil.push({ kodeMk: kodeMk, matkul: matkul, jenisMk: jenisMk, sksMk: sksMk, nilaBobot: bobotNilai, nilai: nilainya });
    
                    totalNilai += nilai * sks;
                    totalSKS += sks;
                }));
    
                let ipk;
                if (Number.isInteger(totalNilai / totalSKS)) {
                    ipk = parseInt((totalNilai / totalSKS).toFixed(0)); // Mengonversi IPK ke integer
                } else {
                    ipk = parseFloat((totalNilai / totalSKS).toFixed(2)); // Mengonversi IPK ke float
                }
    
                hasilIPK.push({ nim: nim, nama: nama, jurusan: jurusan, ipk: ipk, jeniskelamin: jk, totalSks: totalSKS, matkulDiambil: matkulDiambil });
            }));
    
            return hasilIPK;
        } catch (error) {
            console.error('Gagal menghitung IPK:', error.message);
            throw error;
        }
    }
    
    
      

}


module.exports = KRS;